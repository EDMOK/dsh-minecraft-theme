/** Standalone Minecraft Launcher pixel skin client plugin. */
import * as React from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type {} from '@deepseek-ai/dsh-client-ui-theme/client'
import { MINECRAFT_THEME } from './theme.ts'
import { MINECRAFT_PIXEL_CSS } from './minecraft-pixel.css.ts'

type ThemeService = {
  register: (definition: typeof MINECRAFT_THEME) => () => void
  getTheme: () => { preference: string }
  setTheme: (id: string) => void
}

const GRASS_TOP = '#7CBD4B'
const GRASS_DARK = '#5B8731'
const DIRT_TOP = '#79553D'
const DIRT_DARK = '#5B3E24'
const PIXEL_ROWS = [
  'GgGGgGGG', 'gGGgGGgG', 'GgGgDDgD', 'DDdDDDdD',
  'dDDDdDDD', 'DDdDDdDD', 'DdDDDDDd', 'dDDdDDdD',
]
const PIXEL_COLORS: Record<string, string> = { G: GRASS_TOP, g: GRASS_DARK, D: DIRT_TOP, d: DIRT_DARK }
const STYLE_ID = 'dsh-minecraft-pixel-skin-style'

const PIXEL_RECTS: React.ReactElement[] = []
for (let y = 0; y < 8; y += 1) {
  for (let x = 0; x < 8; x += 1) {
    const row = PIXEL_ROWS[y] ?? ''
    const pixel = row[x] ?? 'G'
    PIXEL_RECTS.push(React.createElement('rect', {
      key: `${x}-${y}`,
      x: x * 3,
      y: y * 3,
      width: 3,
      height: 3,
      fill: PIXEL_COLORS[pixel] ?? GRASS_TOP,
    }))
  }
}

const BLOCK_STYLE: React.CSSProperties = {
  width: 24,
  height: 24,
  flex: 'none',
  imageRendering: 'pixelated',
  shapeRendering: 'crispEdges',
}

function MinecraftFooterAction(): React.ReactElement {
  return React.createElement('div', {
    className: 'dsh-mc-skin-art',
    'aria-hidden': 'true',
  }, React.createElement('svg', {
    className: 'dsh-mc-pixel-block',
    viewBox: '0 0 24 24',
    width: 24,
    height: 24,
    role: 'presentation',
    style: BLOCK_STYLE,
  }, PIXEL_RECTS))
}

function installStyles(): () => void {
  if (typeof document === 'undefined') return () => {}
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  let owned = false
  if (style === null) {
    style = document.createElement('style')
    style.id = STYLE_ID
    style.dataset.plugin = '@deepseek-ai/dsh-client-ui-minecraft-pixel'
    style.textContent = MINECRAFT_PIXEL_CSS
    document.head.append(style)
    owned = true
  }
  return () => {
    if (owned) style?.remove()
  }
}

export function apply(ctx: ClientContext): void {
  const theme = ctx.get('theme') as ThemeService | undefined
  const slots = ctx.get('slots')
  if (theme === undefined || slots === undefined) return

  ctx.effect(() => installStyles(), 'minecraft-pixel: css injection')
  ctx.effect(() => {
    const disposeTheme = theme.register(MINECRAFT_THEME)
    const previousTheme = theme.getTheme().preference
    theme.setTheme('minecraft')
    return () => {
      disposeTheme()
      if (previousTheme !== 'minecraft') theme.setTheme(previousTheme)
    }
  }, 'minecraft-pixel: theme registration')

  slots.inject('sidebar.footer.action', () => slots.register(
    { name: 'sidebar.footer.action', id: 'minecraft-skin-art', order: -100, label: 'Minecraft 装饰' },
    () => React.createElement(MinecraftFooterAction),
  ))
}

