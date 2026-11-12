/* Scene plumbing for W46: an approved key frame (frames.gen.tsx) in its room, with each layer's motion and the
   hook variables (data-draw / data-o / data-clip in the frame markup) set from time. A layer with no move sits
   exactly as approved. */
import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { useTime } from '../../lib/anim';
import { F, ROOM, type Layer } from './frames.gen';
import { SceneFade, ease, smooth, type Room } from './kit';

export type FrameKey = keyof typeof F;

/** One frame's layers. `moves[i]` styles layer i (opacity/transform); `vars` sets hook variables on the whole frame;
    `hide` drops layers a scene replaces with its own. */
export function Layers({ k, moves = {}, vars = {}, hide = [], extra }: {
    k: FrameKey; moves?: Record<number, CSSProperties>; vars?: Record<string, number | string>; hide?: readonly number[]; extra?: ReactNode;
}) {
    const ls: readonly Layer[] = F[k];
    return (
        <AbsoluteFill style={vars as CSSProperties}>
            {ls.map((L, i) => (hide.includes(i) ? null : <AbsoluteFill key={i} style={moves[i]}>{L()}</AbsoluteFill>))}
            {extra}
        </AbsoluteFill>
    );
}

/** A whole scene: the frame's room laid down over the lap, then its layers. */
export function FrameScene({ k, room, moves, vars, hide, extra, blend, children }: {
    k: FrameKey; room?: Room; moves?: Record<number, CSSProperties>; vars?: Record<string, number | string>; hide?: readonly number[];
    extra?: ReactNode; blend?: { room: Room; k: number }; children?: ReactNode;
}) {
    const t = useTime();
    return (
        <SceneFade t={t} room={room ?? ROOM[k]} blend={blend}>
            <Layers k={k} moves={moves} vars={vars} hide={hide} extra={extra} />
            {children}
        </SceneFade>
    );
}

/** A `data-o` hook arriving: --o-<name> fades in and --y-<name> lifts by `dy` px over [a, a + d]. */
export function hookIn(t: number, name: string, a: number, d = 0.5, dy = 14): Record<string, number | string> {
    const k = ease(t, a, d);
    return { [`--o-${name}`]: smooth(k * 1.4), [`--y-${name}`]: `${((1 - k) * dy).toFixed(2)}px` };
}
