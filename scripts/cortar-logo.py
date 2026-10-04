"""
Prepara el logo (logo.jpg, raster sin transparencia) para el sitio y el preloader.
No redibuja nada: separa las dos tintas del fondo y recorta piezas del original.

1. Escala x2 (Lanczos) para que aguante pantallas retina en el preloader.
2. "Des-mezcla" cada píxel: p = fondo + a_blanco*(blanco-fondo) + a_ladrillo*(ladrillo-fondo)
   (mínimos cuadrados con las tintas medidas del propio archivo) -> PNG con alfa
   que sobre negro se ve igual al original y sobre una foto no deja la caja negra.
3. Recorta: logo completo, "SM", "C" y el subtítulo; mide la línea y las letras
   del subtítulo (columnas vacías entre glifos) y escribe la geometría en
   content/logo-geometria.json, en fracciones de la caja del logo.

Uso: python scripts/cortar-logo.py
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "logo.jpg"
OUT = ROOT / "public" / "brand"
OUT.mkdir(parents=True, exist_ok=True)
SCALE = 2

BG = np.array([9, 8, 6], float)
WHITE = np.array([252, 252, 252], float)
BRICK = np.array([126, 56, 44], float)


def unmix(rgb: np.ndarray) -> np.ndarray:
    h, w, _ = rgb.shape
    p = rgb.reshape(-1, 3).astype(float) - BG
    m = np.stack([WHITE - BG, BRICK - BG], axis=1)  # 3x2
    coef, *_ = np.linalg.lstsq(m, p.T, rcond=None)  # 2xN
    coef = np.clip(coef, 0, None)
    alpha = np.clip(coef.sum(axis=0), 0, 1)
    # leve aumento de contraste del borde (compensa el blando del JPG reescalado)
    alpha = np.clip((alpha - 0.5) * 1.25 + 0.5, 0, 1)
    tot = coef.sum(axis=0)
    tot[tot == 0] = 1
    color = (np.outer(WHITE, coef[0]) + np.outer(BRICK, coef[1])) / tot
    out = np.zeros((h * w, 4))
    out[:, :3] = color.T
    out[:, 3] = alpha * 255
    out[alpha < 0.04, 3] = 0
    return out.reshape(h, w, 4).clip(0, 255).astype(np.uint8)


def bands(mask_1d):
    res, s = [], None
    for i, v in enumerate(mask_1d):
        if v and s is None:
            s = i
        if not v and s is not None:
            res.append((s, i - 1))
            s = None
    if s is not None:
        res.append((s, len(mask_1d) - 1))
    return res


def main():
    src = Image.open(SRC).convert("RGB")
    src = src.resize((src.width * SCALE, src.height * SCALE), Image.LANCZOS)
    rgba = unmix(np.asarray(src))
    alpha = rgba[:, :, 3] > 30

    rows = bands(alpha.any(axis=1))
    # rows: SMC, línea, (tilde de la Ó), subtítulo
    smc_y = rows[0]
    line_y = rows[1]
    sub_y = (rows[2][0], rows[-1][1])

    cols = alpha.any(axis=0)
    x0, x1 = np.where(cols)[0][[0, -1]]
    y0, y1 = smc_y[0], sub_y[1]
    pad = 2 * SCALE
    box = (x0 - pad, y0 - pad, x1 + 1 + pad, y1 + 1 + pad)
    bw, bh = box[2] - box[0], box[3] - box[1]

    full = Image.fromarray(rgba).crop(box)
    full.save(OUT / "logo.png", optimize=True)
    full.save(OUT / "logo.webp", quality=92, method=6)

    # piezas del preloader (coordenadas relativas a la caja del logo)
    top = alpha[smc_y[0]:smc_y[1] + 1]
    letters_top = bands(top.any(axis=0))  # S, M, C
    sm = (letters_top[0][0], letters_top[1][1])
    c = letters_top[2]
    line_cols = np.where(alpha[line_y[0]:line_y[1] + 1].any(axis=0))[0]

    def piece(name, xa, xb, ya, yb):
        im = Image.fromarray(rgba).crop((xa, ya, xb + 1, yb + 1))
        im.save(OUT / f"{name}.webp", quality=92, method=6)
        return {
            "src": f"/brand/{name}.webp",
            "x": (xa - box[0]) / bw, "y": (ya - box[1]) / bh,
            "w": (xb + 1 - xa) / bw, "h": (yb + 1 - ya) / bh,
        }

    geo = {
        "aspect": bw / bh,
        "sm": piece("pl-sm", sm[0], sm[1], smc_y[0], smc_y[1]),
        "c": piece("pl-c", c[0], c[1], smc_y[0], smc_y[1]),
        "sub": piece("pl-sub", x0, x1, sub_y[0], sub_y[1]),
        "line": {
            "y": (line_y[0] - box[1]) / bh,
            "h": (line_y[1] + 1 - line_y[0]) / bh,
            "x": (line_cols[0] - box[0]) / bw,
            "w": (line_cols[-1] + 1 - line_cols[0]) / bw,
        },
    }

    # letras del subtítulo: columnas con tinta, agrupando la tilde con su letra
    sub = alpha[sub_y[0]:sub_y[1] + 1, x0:x1 + 1]
    glyphs = bands(sub.any(axis=0))
    sw = x1 + 1 - x0
    geo["sub"]["letters"] = [[a / sw, (b + 1) / sw] for a, b in glyphs]

    (ROOT / "content" / "logo-geometria.json").write_text(
        json.dumps(geo, indent=2), encoding="utf-8"
    )
    print(f"caja {bw}x{bh}, letras del subtítulo: {len(glyphs)}")
    print(json.dumps({k: v for k, v in geo.items() if k != 'sub'}, indent=1))


if __name__ == "__main__":
    main()
