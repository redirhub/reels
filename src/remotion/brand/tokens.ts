/* RedirHub brand tokens, mirrored from redirhub/marketing
   (src/app/[locale]/globals.css and the /brand page). Keep in sync by hand. */
export const color = {
    blue: '#1C6DB6',
    blueBg: '#E8F0F8',
    blueLight: '#D1E9FF',
    teal: '#20A795',
    amber: '#E59426',
    charcoal: '#181D27',
    dark: '#101828',
    g700: '#344054',
    g600: '#475467',
    g500: '#667085',
    g400: '#98A2B3',
    g300: '#D0D5DD',
    g200: '#EAECF0',
    g100: '#F2F4F7',
    g50: '#F9FAFB',
    red: '#D92D20',
    redSoft: '#FEF3F2',
    redLine: '#FECDCA',
    redText: '#B42318',
    okSoft: '#ECFDF3',
    okLine: '#ABEFC6',
    okText: '#067647',
} as const;

/* YouTube channel tokens (Youtube Content Engine rule.md §6). Signal Red and Night are
   pending Kris's approval (2026-10-06); list them in every video's final report until then. */
export const yt = {
    /** Canvas. */
    night: '#0B1426',
    /** Broken / failing. */
    signalRed: '#E5484D',
    /** Fixed / passing. */
    teal: color.teal,
    /** Warning / pending. At most once per scene. */
    amber: color.amber,
    /** Product (links, buttons in the dashboard). */
    blue: color.blue,
    /** Text on Night. */
    ink: '#FFFFFF',
    inkSoft: '#B9C6D8',
    inkMute: '#6B7A90',
    /** Glass surfaces on Night. */
    glass: 'rgba(255,255,255,0.07)',
    glassLine: 'rgba(255,255,255,0.14)',
} as const;

export const font = {
    sans: '"Inter", system-ui, sans-serif',
    /** Channel display face (Plus Jakarta Sans is the brand's primary typeface; Inter stays for recreated product UI). */
    display: '"Plus Jakarta Sans", "Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
    /** Bundled color emoji (subset; add glyphs with pyftsubset when a reel needs more). */
    emoji: '"Reel Emoji", "Noto Color Emoji", "Apple Color Emoji", sans-serif',
} as const;

/** Standard vertical social format (Reels, Shorts, TikTok). */
export const VERTICAL = { width: 1080, height: 1920, fps: 30 } as const;
/** Landscape 16:9 (website embeds, YouTube). */
export const LANDSCAPE = { width: 1920, height: 1080, fps: 30 } as const;
