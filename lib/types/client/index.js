/** Standalone Minecraft Launcher pixel skin client plugin. */
import * as React from 'react';
import { MINECRAFT_THEME } from "./theme.js";
const GRASS_TOP = '#7CBD4B';
const GRASS_DARK = '#5B8731';
const DIRT_TOP = '#79553D';
const DIRT_DARK = '#5B3E24';
const PIXEL_ROWS = [
    'GgGGgGGG', 'gGGgGGgG', 'GgGgDDgD', 'DDdDDDdD',
    'dDDDdDDD', 'DDdDDdDD', 'DdDDDDDd', 'dDDdDDdD',
];
const PIXEL_COLORS = { G: GRASS_TOP, g: GRASS_DARK, D: DIRT_TOP, d: DIRT_DARK };
const PIXEL_SHADOWS = [];
for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
        if (x === 0 && y === 0)
            continue;
        const row = PIXEL_ROWS[y] ?? '';
        const pixel = row[x] ?? 'G';
        PIXEL_SHADOWS.push(`${x * 3}px ${y * 3}px 0 0 ${PIXEL_COLORS[pixel] ?? GRASS_TOP}`);
    }
}
const BLOCK_STYLE = {
    width: 3,
    height: 3,
    flex: 'none',
    background: GRASS_TOP,
    boxShadow: PIXEL_SHADOWS.join(', '),
    imageRendering: 'pixelated',
};
function MinecraftFooterAction(props) {
    const theme = props.theme;
    const fallback = props.fallback;
    const toggle = () => {
        theme.setTheme(theme.getTheme().preference === 'minecraft' ? fallback : 'minecraft');
    };
    const children = [
        React.createElement('div', { key: 'block', className: 'dsh-mc-pixel-block', style: BLOCK_STYLE }),
    ];
    if (props.wide) {
        children.push(React.createElement('span', {
            key: 'label',
            className: 'dsh-mc-pixel',
            style: { color: '#83d34b', fontSize: 10, lineHeight: '16px' },
        }, 'Minecraft'));
    }
    return React.createElement('button', {
        className: 'dsh-mc-skin-toggle',
        onClick: toggle,
        title: '切换 Minecraft Launcher 皮肤',
        'aria-label': '切换 Minecraft Launcher 皮肤',
        style: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            height: 32,
            padding: '4px 8px',
            margin: 0,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'var(--dsw-alias-label-secondary)',
            fontSize: 12,
            fontWeight: 600,
            lineHeight: '16px',
            borderRadius: 0,
        },
    }, children);
}
export function apply(ctx) {
    const theme = ctx.get('theme');
    const slots = ctx.get('slots');
    if (theme === undefined || slots === undefined)
        return;
    const initial = theme.getTheme().preference;
    const fallback = initial === 'minecraft' ? 'light' : initial;
    ctx.effect(() => theme.register(MINECRAFT_THEME), 'minecraft-pixel: theme registration');
    theme.setTheme('minecraft');
    slots.inject('sidebar.footer.action', () => slots.register({ name: 'sidebar.footer.action', id: 'minecraft-skin-toggle', order: -100, label: 'Minecraft 皮肤' }, (props) => React.createElement(MinecraftFooterAction, { ...props, theme: theme, fallback })));
}
//# sourceMappingURL=index.js.map