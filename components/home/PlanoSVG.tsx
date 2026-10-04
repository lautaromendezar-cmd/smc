/**
 * Plano tipo de la fachada de una nave comercial con frente vidriado.
 * Fijo en el código (no editable). Las medidas son ILUSTRATIVAS, aunque
 * consistentes entre sí: 3 módulos de 5,00 m (escala 18,67 u/m).
 *
 * [data-draw] -> se dibuja con DrawSVGPlugin al scrollear.
 * .plano-txt   -> textos y ejes punteados que aparecen con fade.
 */

const X = [60, 153.33, 246.67, 340] // ejes de columnas
const MID = [106.67, 200, 293.33] // parantes intermedios
const GROUND = 330
const TOP = 190 // borde superior del cartel/parapeto
const GLASS_TOP = 215

export default function PlanoSVG({ className = '', decorativo = false }: { className?: string; decorativo?: boolean }) {
  const s = { fill: 'none', stroke: 'currentColor', vectorEffect: 'none' as const }
  const txt = { fill: 'currentColor', fontFamily: 'var(--font-sans)', stroke: 'none' }
  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      {...(decorativo ? { 'aria-hidden': true } : { role: 'img', 'aria-label': 'Plano ilustrativo de la fachada de una nave comercial, con ejes y cotas' })}
    >

      {/* lámina y rótulo */}
      <g {...s} strokeWidth={0.8}>
        <rect data-draw x="10" y="10" width="380" height="480" />
        <rect data-draw x="10" y="420" width="380" height="70" />
        <line data-draw x1="250" y1="420" x2="250" y2="490" />
        <line data-draw x1="250" y1="452" x2="390" y2="452" />
        <line data-draw x1="320" y1="452" x2="320" y2="490" />
      </g>
      <g {...txt} className="plano-txt">
        <text x="22" y="440" fontSize="8.5" letterSpacing="1.2" fontWeight="600">SMC ARQUITECTURA + CONSTRUCCIÓN</text>
        <text x="22" y="456" fontSize="7" letterSpacing="1">NAVE COMERCIAL · FACHADA PRINCIPAL</text>
        <text x="22" y="478" fontSize="6" letterSpacing="0.8" opacity="0.6">MEDIDAS ILUSTRATIVAS</text>
        <text x="260" y="440" fontSize="7" letterSpacing="1">ESCALA 1:100</text>
        <text x="260" y="466" fontSize="5.5" letterSpacing="0.8" opacity="0.6">ETAPA</text>
        <text x="260" y="481" fontSize="8" letterSpacing="1">PLANO</text>
        <text x="330" y="466" fontSize="5.5" letterSpacing="0.8" opacity="0.6">LÁMINA</text>
        <text x="330" y="481" fontSize="8" letterSpacing="1">01/04</text>
        <text x="200" y="44" fontSize="9" letterSpacing="2.4" textAnchor="middle" fontWeight="600">FACHADA PRINCIPAL</text>
      </g>
      <line data-draw x1="150" y1="51" x2="250" y2="51" {...s} strokeWidth={0.8} />

      {/* ejes */}
      <g className="plano-txt">
        {X.map((x, i) => (
          <g key={x}>
            <line x1={x} y1="112" x2={x} y2={TOP} {...s} strokeWidth={0.5} strokeDasharray="4 3" opacity="0.6" />
            <circle cx={x} cy="102" r="9" {...s} strokeWidth={0.8} />
            <text x={x} y="105" fontSize="8" textAnchor="middle" {...txt}>
              {i + 1}
            </text>
          </g>
        ))}
      </g>

      {/* fachada */}
      <g {...s}>
        {/* cartel / parapeto con vuelo */}
        <rect data-draw x="50" y={TOP} width="300" height={GLASS_TOP - TOP} strokeWidth={1.4} />
        {/* línea de terreno */}
        <line data-draw x1="22" y1={GROUND} x2="378" y2={GROUND} strokeWidth={1.8} />
        {/* columnas */}
        {X.map((x) => (
          <line data-draw key={x} x1={x} y1={GLASS_TOP} x2={x} y2={GROUND} strokeWidth={1.6} />
        ))}
        {/* parantes */}
        {MID.map((x) => (
          <line data-draw key={x} x1={x} y1={GLASS_TOP} x2={x} y2={GROUND} strokeWidth={0.7} />
        ))}
        {/* travesaño */}
        <line data-draw x1={X[0]} y1="255" x2={X[3]} y2="255" strokeWidth={0.7} />
        {/* puerta doble en el módulo central */}
        <rect data-draw x="180" y="270" width="40" height="60" strokeWidth={0.9} />
        <line data-draw x1="200" y1="270" x2="200" y2={GROUND} strokeWidth={0.6} />
        {/* reflejos del vidrio */}
        {[
          [72, 245, 88, 229],
          [78, 249, 94, 233],
          [258, 245, 274, 229],
          [264, 249, 280, 233],
          [118, 316, 136, 298],
          [305, 316, 323, 298],
        ].map(([x1, y1, x2, y2], i) => (
          <line data-draw key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={0.5} opacity="0.7" />
        ))}
        {/* rayado de terreno */}
        {Array.from({ length: 29 }, (_, i) => 30 + i * 12).map((x) => (
          <line data-draw key={x} x1={x} y1={GROUND + 1} x2={x - 8} y2={GROUND + 9} strokeWidth={0.5} opacity="0.55" />
        ))}
      </g>

      {/* cotas */}
      <g {...s} strokeWidth={0.6}>
        {/* total horizontal */}
        <line data-draw x1={X[0]} y1="352" x2={X[3]} y2="352" />
        <line data-draw x1={X[0]} y1="340" x2={X[0]} y2="376" />
        <line data-draw x1={X[3]} y1="340" x2={X[3]} y2="376" />
        {/* parcial por módulo */}
        <line data-draw x1={X[0]} y1="370" x2={X[3]} y2="370" />
        {X.slice(1, 3).map((x) => (
          <line data-draw key={x} x1={x} y1="364" x2={x} y2="376" />
        ))}
        {/* trazos oblicuos */}
        {[...X.map((x) => [x, 370]), [X[0], 352], [X[3], 352]].map(([x, y], i) => (
          <line data-draw key={i} x1={x - 4} y1={y + 4} x2={x + 4} y2={y - 4} strokeWidth={1} />
        ))}
        {/* altura total, izquierda */}
        <line data-draw x1="32" y1={TOP} x2="32" y2={GROUND} />
        <line data-draw x1="26" y1={TOP} x2="48" y2={TOP} />
        <line data-draw x1="28" y1={TOP + 4} x2="36" y2={TOP - 4} strokeWidth={1} />
        <line data-draw x1="28" y1={GROUND + 4} x2="36" y2={GROUND - 4} strokeWidth={1} />
        {/* altura libre, derecha */}
        <line data-draw x1="368" y1={GLASS_TOP} x2="368" y2={GROUND} />
        <line data-draw x1="344" y1={GLASS_TOP} x2="374" y2={GLASS_TOP} />
        <line data-draw x1="364" y1={GLASS_TOP + 4} x2="372" y2={GLASS_TOP - 4} strokeWidth={1} />
        <line data-draw x1="364" y1={GROUND + 4} x2="372" y2={GROUND - 4} strokeWidth={1} />
      </g>
      <g {...txt} className="plano-txt" fontSize="7.5" letterSpacing="0.6" textAnchor="middle">
        <text x="200" y="348">15,00</text>
        {[0, 1, 2].map((i) => (
          <text key={i} x={(X[i] + X[i + 1]) / 2} y="366">
            5,00
          </text>
        ))}
        <text x="0" y="0" transform={`translate(27 ${(TOP + GROUND) / 2}) rotate(-90)`}>
          7,50
        </text>
        <text x="0" y="0" transform={`translate(363 ${(GLASS_TOP + GROUND) / 2}) rotate(-90)`}>
          6,15
        </text>
        <text x="58" y="398" textAnchor="start" fontSize="6.5">
          ±0,00 NIVEL DE VEREDA
        </text>
      </g>
      <path data-draw d="M44 392 L52 384 L60 392 Z" {...s} strokeWidth={0.7} />
    </svg>
  )
}
