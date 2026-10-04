'use client'

/**
 * Único punto de registro de GSAP. Solo se importan los plugins que se usan
 * y solo desde Client Components.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin)

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP }

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
