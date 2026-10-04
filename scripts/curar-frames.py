"""
Segundo paso, después de extraer-frames.py: renombra los frames buenos con
nombres descriptivos y mueve el resto a material/frames/_descartados.
La curaduría se hizo mirando la hoja de contacto (no es automatizable:
duplicados entre los dos videos, placas del logo y fundidos a medias).

Uso: python scripts/curar-frames.py
"""
import shutil
from pathlib import Path

FRAMES = Path(__file__).resolve().parent.parent / "material" / "frames"
DESC = FRAMES / "_descartados"

KEEP = {
    "C1vzq1utQEr_00_t01.27.png": "nave-estructura-metalica-frente.png",
    "C1vzq1utQEr_01_t02.20.png": "nave-estructura-andamios.png",
    "C1vzq1utQEr_02_t03.30.png": "nave-estructura-esquina.png",
    "C1vzq1utQEr_03_t04.23.png": "nave-vidriado-lateral-alero.png",
    "C1vzq1utQEr_04_t05.00.png": "nave-interior-contrapiso.png",
    "C1vzq1utQEr_05_t06.27.png": "nave-interior-porcelanato-colocacion.png",
    "C1vzq1utQEr_06_t07.20.png": "nave-interior-porcelanato.png",
    "C1vzq1utQEr_07_t08.23.png": "nave-interior-terminada.png",
    "C1vzq1utQEr_08_t09.27.png": "nave-fachada-vidriada-ejecucion.png",
    "C1vzq1utQEr_09_t10.00.png": "nave-fachada-vidriada-lateral.png",
    "C1vzq1utQEr_10_t11.40.png": "nave-noche-galeria-iluminada.png",
    "C1vzq1utQEr_12_t14.60.png": "nave-noche-local-con-cartel.png",
    "Dc17UwSN-Zx_14_t17.00.png": "nave-noche-aerea.png",
    "Dc17UwSN-Zx_05_t05.31.png": "bano-vanitory-madera.png",
    "Dc17UwSN-Zx_07_t08.75.png": "bano-ducha-porcelanato.png",
    "Dc17UwSN-Zx_09_t10.31.png": "institucional-pasillo-espera.png",
}

# motivo de cada descarte (queda en el resumen)
DROP = {
    "Dc17UwSN-Zx_02_t03.12.png": "duplicado de nave-noche-aerea (más chico)",
    "Dc17UwSN-Zx_04_t04.31.png": "duplicado de nave-estructura-andamios (reescalado, más blando)",
    "Dc17UwSN-Zx_06_t07.69.png": "transición: barrido con franja de la foto siguiente",
    "Dc17UwSN-Zx_08_t09.75.png": "transición: fundido entre baño y pasillo",
    "Dc17UwSN-Zx_11_t11.69.png": "duplicado de nave-fachada-vidriada-lateral (reescalado, más blando)",
    "Dc17UwSN-Zx_12_t15.31.png": "zoom de la placa del logo",
    "Dc17UwSN-Zx_15_t17.44.png": "duplicado de nave-noche-aerea (zoom, movido)",
}


def main():
    DESC.mkdir(exist_ok=True)
    for src, dst in KEEP.items():
        p = FRAMES / src
        if p.exists():
            p.rename(FRAMES / dst)
    for f in FRAMES.glob("*_t*.png"):
        shutil.move(str(f), DESC / f.name)
        print(f"descartado {f.name}: {DROP.get(f.name, 'sin motivo cargado')}")


if __name__ == "__main__":
    main()
