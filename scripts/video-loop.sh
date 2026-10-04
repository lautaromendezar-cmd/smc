#!/usr/bin/env bash
# Prepara un video generado para el loop del hero:
#  1. funde los últimos 0,6 s con los primeros (crossfade) para que el corte del
#     loop no se note aunque el modelo no haya cerrado exacto en el cuadro inicial
#  2. sin audio, H.264 high, +faststart (empieza a reproducir antes de bajar entero)
#
# Uso: scripts/video-loop.sh entrada.mp4 salida.mp4 ANCHO [CRF]
set -euo pipefail
IN="$1"; OUT="$2"; W="$3"; CRF="${4:-27}"
FADE=0.6
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
# cola = últimos FADE s; cuerpo = desde FADE hasta el final menos FADE.
# el cuerpo arranca donde termina el fundido, así el último cuadro empalma con el primero.
ffmpeg -nostdin -y -loglevel error -i "$IN" -filter_complex "
  [0:v]split[a][b];
  [a]trim=start=0:end=${FADE},setpts=PTS-STARTPTS[head];
  [b]trim=start=${FADE},setpts=PTS-STARTPTS[rest];
  [rest]split[r1][r2];
  [r1]trim=end=$(awk "BEGIN{print $DUR - 2*$FADE}"),setpts=PTS-STARTPTS[body];
  [r2]trim=start=$(awk "BEGIN{print $DUR - 2*$FADE}"),setpts=PTS-STARTPTS[tail];
  [tail][head]xfade=transition=fade:duration=${FADE}:offset=0[seam];
  [body][seam]concat=n=2:v=1[v];
  [v]scale=${W}:-2:flags=lanczos,format=yuv420p[out]" \
  -map "[out]" -an -c:v libx264 -profile:v high -preset slow -crf "$CRF" -movflags +faststart "$OUT"
ls -la "$OUT"
