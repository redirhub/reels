/* Fine static film grain. Put it over large dark gradients: it dithers the few shades a
   navy gradient has, so frame compression (and Instagram's) can't turn them into visible
   bands. Static, so it costs almost no bitrate. */
export function Grain({ opacity = 0.1 }: { opacity?: number }) {
    return (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity, mixBlendMode: 'normal', pointerEvents: 'none' }}>
            <filter id="rh-grain">
                <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#rh-grain)" />
        </svg>
    );
}
