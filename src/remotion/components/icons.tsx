/* Small stroke icons used across reels (24×24 grid, Feather/Untitled-UI style). */
import type { ReactNode } from 'react';

type P = { size?: number; color?: string; width?: number };

function Svg({ size = 32, color = 'currentColor', width = 2, children, fill = 'none' }: P & { children: ReactNode; fill?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={fill === 'none' ? color : 'none'}
            strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flex: 'none' }}>
            {children}
        </svg>
    );
}

export const IconCheck = (p: P) => <Svg width={3} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Svg>;
export const IconX = (p: P) => <Svg width={3} {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>;
export const IconLock = (p: P) => <Svg width={2.4} {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>;
export const IconSearch = (p: P) => <Svg width={2.2} {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Svg>;
export const IconBell = (p: P) => <Svg width={2.2} {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" /></Svg>;
export const IconQr = (p: P) => <Svg {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3" /></Svg>;
export const IconGlobe = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></Svg>;
export const IconLink = (p: P) => <Svg {...p}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></Svg>;
export const IconCopy = (p: P) => <Svg {...p}><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></Svg>;
export const IconDots = ({ size = 32, color = 'currentColor' }: P) => <Svg size={size} fill={color}><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></Svg>;
export const IconPulse = (p: P) => <Svg width={2.2} {...p}><path d="M3 12h4l3-8 4 16 3-8h4" /></Svg>;
export const IconDownCircle = (p: P) => <Svg width={2.6} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8.5 12.5 12 16l3.5-3.5" /></Svg>;
export const IconArrowRight = (p: P) => <Svg width={2.6} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
export const IconHome = (p: P) => <Svg {...p}><path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" /></Svg>;
export const IconRedirect = (p: P) => <Svg {...p}><path d="M4 7h11a4 4 0 0 1 0 8H8" /><path d="M11 12l-3 3 3 3" /></Svg>;
export const IconUpload = (p: P) => <Svg width={2.2} {...p}><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></Svg>;
export const IconFile = (p: P) => <Svg {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></Svg>;
export const IconMail = (p: P) => <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></Svg>;
export const IconUser = (p: P) => <Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></Svg>;
