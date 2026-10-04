#!/usr/bin/env bash
# Prepara un video generado para el loop del hero.
#
#  1. Descarta los extremos del clip (HEAD s al principio, TAIL s al final): los
#     modelos de video suelen meter un salto en el primer y en el último cuadro.
#  2. (Opcional, ESTAB=1) Estabiliza en modo trípode con vidstab. Solo si el video
#     viene movido: sobre un video ya quieto, vidstab AGREGA saltos de un cuadro.
#  3. Funde los últimos FADE segundos con los primeros: con la cámara fija solo
#     cambia el cielo, así que el corte del loop no se ve.
#  4. Sin audio, H.264 high, un solo keyframe por vuelta e ipratio=1 (sin el
#     "pulso" de nitidez de cada keyframe), +faststart.
#
# Ojo: no pedirle al modelo que termine en el mismo cuadro con el que empieza.
# Para lograrlo mueve la cámara, frena a mitad de clip y vuelve: se ve como una
# vibración. Mejor cámara fija (solo cuadro inicial) + este fundido.
#
# Uso: [ESTAB=1] [HEAD=0.3] [TAIL=0.6] scripts/video-loop.sh entrada.mp4 salida.mp4 ANCHO [CRF=28] [FADE=1.5]
set -euo pipefail
IN="$1"; OUT="$2"; W="$3"; CRF="${4:-28}"; FADE="${5:-1.5}"
HEAD="${HEAD:-0.3}"; TAIL="${TAIL:-0.6}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cp "$IN" "$TMP/in.mp4"
cd "$TMP"   # vidstab no se lleva bien con rutas de Windows (C:) en result=

# 1) recorte de los extremos (intermedio casi sin pérdida)
DUR0=$(ffprobe -v error -show_entries format=duration -of csv=p=0 in.mp4)
END=$(awk "BEGIN{print $DUR0 - $TAIL}")
ffmpeg -nostdin -y -loglevel error -i in.mp4 -vf "trim=start=${HEAD}:end=${END},setpts=PTS-STARTPTS" \
  -an -c:v libx264 -preset slow -crf 10 clip.mp4

# 2) estabilización trípode (opcional)
if [ "${ESTAB:-0}" = "1" ]; then
  ffmpeg -nostdin -y -loglevel error -i clip.mp4 -vf "vidstabdetect=tripod=1:shakiness=4:accuracy=15:result=t.trf" -f null -
  ffmpeg -nostdin -y -loglevel error -i clip.mp4 \
    -vf "vidstabtransform=tripod=1:input=t.trf:interpol=bicubic:optzoom=0:zoom=1.5:crop=black" \
    -an -c:v libx264 -preset slow -crf 10 base.mp4
else
  mv clip.mp4 base.mp4
fi

# 3) loop con fundido (el cuerpo arranca donde termina la cabeza del fundido)
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 base.mp4)
CUT=$(awk "BEGIN{print $DUR - 2*$FADE}")
ffmpeg -nostdin -y -loglevel error -i base.mp4 -filter_complex "
  [0:v]split[a][b];
  [a]trim=start=0:end=${FADE},setpts=PTS-STARTPTS[head];
  [b]trim=start=${FADE},setpts=PTS-STARTPTS[rest];
  [rest]split[r1][r2];
  [r1]trim=end=${CUT},setpts=PTS-STARTPTS[body];
  [r2]trim=start=${CUT},setpts=PTS-STARTPTS[tail];
  [tail][head]xfade=transition=fade:duration=${FADE}:offset=0[seam];
  [body][seam]concat=n=2:v=1[v];
  [v]scale=${W}:-2:flags=lanczos,format=yuv420p[out]" \
  -map "[out]" -an -c:v libx264 -profile:v high -preset slow -crf "$CRF" -tune film \
  -x264-params keyint=600:min-keyint=600:scenecut=0:ipratio=1.0:pbratio=1.0:aq-mode=3 \
  -movflags +faststart out.mp4
cd - >/dev/null
cp "$TMP/out.mp4" "$OUT"
ls -la "$OUT"
