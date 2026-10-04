"""
Extrae un frame por cada foto distinta de los videos de /material/instagram.

1. ffmpeg calcula el puntaje de cambio de escena de cada cuadro
   (el mismo valor que usa select='gt(scene,0.3)').
2. Se corta en escenas con umbral 0.3. Si un video casi no tiene cortes
   (transiciones suaves, zoom, fundidos) se baja el umbral para ese video.
3. Dentro de cada escena se descartan los cuadros pegados al corte
   (transición) y se elige el más nítido (varianza del Laplaciano).
4. Se recortan las franjas negras (como cropdetect). El umbral es 6 y no 24:
   las franjas de estos videos son negro puro y un cielo nocturno anda en 7-20.
5. Se descartan escenas casi negras y duplicados (hash perceptual).

Uso: python scripts/extraer-frames.py
"""
import json
import re
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "material" / "instagram"
OUT = ROOT / "material" / "frames"
OUT.mkdir(parents=True, exist_ok=True)


def scene_scores(video: Path) -> list[tuple[float, float]]:
    cmd = [
        "ffmpeg", "-nostdin", "-hide_banner", "-i", str(video),
        "-vf", "select='gte(scene,0)',metadata=print:file=-",
        "-an", "-f", "null", "-",
    ]
    out = subprocess.run(cmd, capture_output=True, text=True).stdout
    scores, t = [], None
    for line in out.splitlines():
        m = re.search(r"pts_time:([0-9.]+)", line)
        if m:
            t = float(m.group(1))
        m = re.search(r"lavfi\.scene_score=([0-9.]+)", line)
        if m and t is not None:
            scores.append((t, float(m.group(1))))
    return scores


def segments(scores, duration, threshold):
    cuts = [t for t, s in scores if s > threshold]
    bounds = [0.0] + cuts + [duration]
    return [(a, b) for a, b in zip(bounds, bounds[1:]) if b - a >= 0.25]


def crop_black(img, thr=6):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    rows = np.where(gray.max(axis=1) > thr)[0]
    cols = np.where(gray.max(axis=0) > thr)[0]
    if len(rows) == 0 or len(cols) == 0:
        return None
    # refinamiento: una fila/columna cuenta como imagen si el 30 % supera el umbral
    rmask = (gray > thr).mean(axis=1) > 0.3
    cmask = (gray > thr).mean(axis=0) > 0.3
    r = np.where(rmask)[0]
    c = np.where(cmask)[0]
    if len(r) == 0 or len(c) == 0:
        return None
    # recortar a par para que ffmpeg/encoders no se quejen
    y0, y1, x0, x1 = r[0], r[-1] + 1, c[0], c[-1] + 1
    return img[y0:y1, x0:x1]


def sharpness(img):
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return cv2.Laplacian(g, cv2.CV_64F).var()


def dhash(img, size=16):
    g = cv2.cvtColor(cv2.resize(img, (size + 1, size)), cv2.COLOR_BGR2GRAY)
    return (g[:, 1:] > g[:, :-1]).flatten()


# Por debajo de esto el cuadro está movido o es una placa lisa (la del logo).
MIN_SHARPNESS = 40


def is_transition(img):
    """Cubo 3D / barrido: quedan zonas negras puras DENTRO del recorte."""
    black = (img.max(axis=2) < 4).mean()
    return black > 0.04


def refine(segs, frames, fps, step=0.25, dist=0.3):
    """Los fundidos dan puntajes de escena bajos: dentro de una escena larga
    se corta donde la imagen cambia de verdad respecto del comienzo."""
    out = []
    for a, b in segs:
        if b - a <= 2.5:
            out.append((a, b))
            continue
        start, anchor = a, None
        t = a
        while t < b:
            k = min(int(t * fps), len(frames) - 1)
            img = crop_black(frames[k])
            if img is not None and img.shape[0] > 100 and not is_transition(img):
                h = dhash(img)
                if anchor is None:
                    anchor = h
                elif (h != anchor).mean() > dist:
                    out.append((start, t))
                    start, anchor = t, h
            t += step
        out.append((start, b))
    return [(x, y) for x, y in out if y - x >= 0.25]


def main():
    report = []
    for video in sorted(SRC.glob("*.mp4")):
        cap = cv2.VideoCapture(str(video))
        fps = cap.get(cv2.CAP_PROP_FPS)
        n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = n / fps
        scores = scene_scores(video)
        threshold = 0.3
        segs = segments(scores, duration, threshold)
        # objetivo: ~1 escena cada 2,5 s; los fundidos dan puntajes de 0.05-0.15
        while len(segs) < duration / 2.5 and threshold > 0.05:
            threshold = round(threshold - 0.02, 2)
            segs = segments(scores, duration, threshold)

        frames = []
        ok = True
        while ok:
            ok, f = cap.read()
            if ok:
                frames.append(f)
        cap.release()

        segs = refine(segs, frames, fps)
        kept = []  # (hash, nitidez, indice en report)
        for i, (a, b) in enumerate(segs):
            margin = min(0.2, (b - a) * 0.2)
            lo, hi = int((a + margin) * fps), int((b - margin) * fps)
            best, best_s = None, -1
            for k in range(max(lo, 0), min(hi, len(frames))):
                img = crop_black(frames[k])
                if img is None or img.shape[0] < 200 or img.shape[1] < 200:
                    continue
                if img.mean() < 18:  # escena casi negra
                    continue
                if is_transition(img):
                    continue
                s = sharpness(img)
                if s > best_s:
                    best, best_s, best_k = img, s, k
            if best is None or best_s < MIN_SHARPNESS:
                continue
            h = dhash(best)
            dup = next((j for j, (kh, _, _) in enumerate(kept) if (h != kh).mean() < 0.2), None)
            if dup is not None:
                if kept[dup][1] >= best_s:
                    continue
                # el nuevo es más nítido: reemplaza al anterior
                old = report[kept[dup][2]]
                (OUT / old["archivo"]).unlink(missing_ok=True)
                old["descartado"] = True
            name = f"{video.stem}_{i:02d}_t{best_k / fps:05.2f}.png"
            cv2.imwrite(str(OUT / name), best)
            report.append({
                "archivo": name, "video": video.name, "escena": [round(a, 2), round(b, 2)],
                "t": round(best_k / fps, 2), "umbral": threshold,
                "tamano": f"{best.shape[1]}x{best.shape[0]}", "nitidez": round(float(best_s), 1),
            })
            entry = (h, best_s, len(report) - 1)
            if dup is not None:
                kept[dup] = entry
            else:
                kept.append(entry)
        report[:] = [r for r in report if not r.get("descartado")]
    (OUT / "_reporte.json").write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    for r in report:
        print(r)


if __name__ == "__main__":
    sys.exit(main())
