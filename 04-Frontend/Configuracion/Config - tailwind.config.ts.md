---
tipo: "configuracion"
fuente: "apps/web/tailwind.config.ts"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `apps/web/tailwind.config.ts`

Tailwind CSS: modo oscuro por clase, colores como tokens HSL en variables CSS (los de shadcn/ui: primary, secondary, muted, accent, card…), radios derivados de `--radius` y el plugin `tailwindcss-animate`. Los valores de la marca viven en `src/index.css` (ver Dirección de diseño).

## Contenido

```ts
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const token = (name: string): string => `hsl(var(--${name}))`;

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: token('border'),
        input: token('input'),
        ring: token('ring'),
        background: token('background'),
        foreground: token('foreground'),
        primary: { DEFAULT: token('primary'), foreground: token('primary-foreground') },
        secondary: { DEFAULT: token('secondary'), foreground: token('secondary-foreground') },
        destructive: { DEFAULT: token('destructive'), foreground: token('destructive-foreground') },
        muted: { DEFAULT: token('muted'), foreground: token('muted-foreground') },
        accent: { DEFAULT: token('accent'), foreground: token('accent-foreground') },
        popover: { DEFAULT: token('popover'), foreground: token('popover-foreground') },
        card: { DEFAULT: token('card'), foreground: token('card-foreground') },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [animate],
};

export default config;
```
