"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { empresa, nav } from "@/content/textos";
import { IconoWhatsApp } from "@/components/ui/IconosMarca";

/**
 * Transparente sobre el hero de la home; sólida con blur al hacer scroll
 * (y desde el arranque en el resto de las páginas).
 */
export default function Navbar({ whatsappHref }: { whatsappHref: string }) {
  const pathname = usePathname();
  const sobreHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // cerrar el menú al navegar (ajuste de estado en el render, no en un efecto)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === "Tab" && panel.current) {
        // foco atrapado dentro del menú (incluye el botón de cerrar)
        const f = [
          toggle.current!,
          ...panel.current.querySelectorAll<HTMLElement>("a"),
        ];
        const i = f.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && i === f.length - 1) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solida = scrolled || !sobreHero || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          open
            ? "border-b border-white/10 bg-ink"
            : solida
              ? "border-b border-white/10 bg-ink/80 backdrop-blur-xl"
              : "border-b border-transparent bg-transparent"
        }`}
      >
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-[60] focus:bg-bone focus:px-4 focus:py-2 focus:text-ink"
        >
          Saltar al contenido
        </a>
        <div className="container-x flex h-[72px] items-center justify-between gap-6">
          <Link
            href="/"
            className="relative z-[51] block shrink-0"
            aria-label={`${empresa.nombre}, ir al inicio`}
          >
            <Image
              src="/brand/logo.webp"
              alt=""
              width={1642}
              height={767}
              className="h-10 w-auto md:h-11"
              loading="eager"
            />
          </Link>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {nav.map((item) => {
                const active =
                  item.href === pathname ||
                  (item.href === "/obras" && pathname.startsWith("/obras"));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="group relative py-2 text-[0.92rem] text-warm-200 transition-colors hover:text-white aria-[current=page]:text-white"
                    >
                      {item.label}
                      <span
                        className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-brick-300 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-x-100 group-aria-[current=page]:scale-x-100"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-11 items-center gap-2.5 bg-brick px-5 text-[0.9rem] font-medium text-white transition-colors hover:bg-brick-600 md:inline-flex"
            >
              <IconoWhatsApp className="size-4" />
              Hablemos
              <span className="sr-only">
                {" "}
                por WhatsApp (se abre en una pestaña nueva)
              </span>
            </a>
            <button
              ref={toggle}
              type="button"
              className="relative z-[51] grid size-11 place-items-center text-white lg:hidden"
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X strokeWidth={1.5} /> : <Menu strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* Fuera del <header>: su backdrop-filter convierte al header en el contenedor
          de los hijos fixed y el panel quedaba atrapado en sus 72 px (transparente). */}
      <div
        id="menu-movil"
        ref={panel}
        className={`fixed inset-0 z-[45] flex flex-col bg-ink px-4 pt-28 pb-10 transition-[opacity,visibility] duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        aria-hidden={!open}
      >
        <nav aria-label="Menú móvil" className="flex-1">
          <ul className="border-t border-white/10">
            {nav.map((item, i) => (
              <li
                key={item.href}
                className={`border-b border-white/10 transition-[opacity,translate] duration-500 ease-[var(--ease-expo)] ${
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
              >
                <Link
                  href={item.href}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-5 font-display text-3xl tracking-tight text-white"
                >
                  <span className="eyebrow tabular text-brick-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={open ? 0 : -1}
          className="flex h-14 items-center justify-center gap-3 bg-brick font-medium text-white"
        >
          <IconoWhatsApp className="size-5" /> Escribinos por WhatsApp
        </a>
      </div>
    </>
  );
}
