'use client'

/**
 * Coordina el preloader con el hero, Lenis y el botón flotante.
 *
 * El preloader no anida la timeline del hero (si lo hiciera, al desmontarse
 * revertiría también el título). En cambio llama a los "cues" del hero en el
 * momento exacto de su propia timeline: open() cuando se abren las mitades y
 * reveal() con el solapamiento que encadena el título.
 */
type HeroCues = { open: () => void; reveal: () => void }

let hero: HeroCues | null = null
let finished = false
const listeners = new Set<() => void>()

export const intro = {
  /** ¿El preloader va a correr / está corriendo? (lo decide el script del <head>) */
  isRunning() {
    return typeof document !== 'undefined' && document.documentElement.dataset.pl === 'run'
  },
  setHero(cues: HeroCues | null) {
    hero = cues
  },
  getHero() {
    return hero
  },
  finish() {
    if (finished) return
    finished = true
    document.documentElement.dataset.pl = 'done'
    listeners.forEach((fn) => fn())
    listeners.clear()
  },
  /** Ejecuta cb cuando termina el preloader (o enseguida si no hay preloader). */
  onDone(cb: () => void) {
    if (finished || !this.isRunning()) {
      cb()
      return () => {}
    }
    listeners.add(cb)
    return () => {
      listeners.delete(cb)
    }
  },
}
