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

export const font = {
    sans: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
} as const;

/** Standard vertical social format (Reels, Shorts, TikTok). */
export const VERTICAL = { width: 1080, height: 1920, fps: 30 } as const;
