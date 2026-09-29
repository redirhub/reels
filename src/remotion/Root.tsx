import { Composition } from 'remotion';
import { reels } from '../reels';
import { loadBrandFonts } from './brand/fonts';

loadBrandFonts();

export function RemotionRoot() {
    return (
        <>
            {reels.map((r) => (
                <Composition
                    key={r.id}
                    id={r.id}
                    component={r.component}
                    defaultProps={r.defaultProps}
                    durationInFrames={Math.round(r.durationInSeconds * r.fps)}
                    fps={r.fps}
                    width={r.width}
                    height={r.height}
                />
            ))}
        </>
    );
}
