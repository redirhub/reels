/* Act D · The way out (beats 13–15): the motif is born (a door that opens, a knock), one honest aside for a
   handful of domains, then the bridge: two hundred domains in three accounts, written down once, in one file. Motion notes: keyframes.md (w46-Door,
   w46-Honest, w46-Once). The knock is a sound cue (BulkRedirects.tsx) at timeline.ts knockAt(1). */
import type { CSSProperties } from 'react';
import { AbsoluteFill } from 'remotion';
import { prog, useTime } from '../../lib/anim';
import { X } from './frames.gen';
import { FrameScene, fillDown } from './scene';
import { ease, slideIn, smooth } from './kit';
import { knockAt, local } from './timeline';

/** Where the retired product's domain sat alone at the end of the Silence (w46-Silence), and the door's centre. */
const SLOT = { x: 960, y: 470 }, DOOR = { x: 405, y: 487 };
/** The open door's light, top to bottom: its glow (w46_props.door: cy 0.55 dh, ry 0.72 dh) and the label under it. */
const DOOR_BOX = { top: 150, bottom: 880 };
/** The knock's three raps, seconds after its cue (public/audio/bulk-redirects/knock.wav). */
const RAPS = [0, 0.101, 0.203];

/** Beat 13. The retired product's domain, alone at the end of the Silence, grows into a closed door (shared element). On "a door that
    opens properly" teal light fills it from the top down and the padlock turns solid; the two lines land with
    their words; on "someone knocks" the knock sounds and its three arcs leave the door's edge, one per rap. */
export function DoorScene() {
    const t = useTime(); const L = local('door');
    const grow = ease(t, 0.0, 1.0);
    // translate + scale about the door's own centre, with kit.tsx SMOOTH's invisible turn (no pixel steps)
    const born: CSSProperties = {
        transform: `translate3d(${((1 - grow) * (SLOT.x - DOOR.x)).toFixed(2)}px, ${((1 - grow) * (SLOT.y - DOOR.y)).toFixed(2)}px, 0) scale(${0.4 + 0.6 * grow}) rotate(0.02deg)`,
        transformOrigin: `${DOOR.x}px ${DOOR.y}px`, willChange: 'transform',
    };
    const light = ease(t, L.word(13, 'opens') - 0.15, 0.95);
    const item = (k: number, a: number) => {
        const q = ease(t, a, 0.55);
        return { [`--o-item${k}`]: smooth(q * 1.4), [`--y-item${k}`]: `${((1 - q) * 18).toFixed(2)}px` };
    };
    const knock = knockAt(1) - L.start;
    const arcs: Record<string, number> = {};
    RAPS.forEach((r, k) => { arcs[`--o-knock${k}`] = smooth(prog(t, knock + r - 0.01, knock + r + 0.14)); });
    return (
        <FrameScene k="Door" moves={{
            // the open door, revealed top-down over the closed one: the light fills it
            0: { ...born, ...fillDown(DOOR_BOX.top, DOOR_BOX.bottom, light) },
            1: slideIn(t, L.word(13, 'every') - 0.2, 0.6, 0, 22),
        }} vars={{ ...item(1, L.word(13, 'door') - 0.2), ...item(2, L.readBy(L.word(13, 'and') - 0.15, 7)), ...arcs }}
            extra={<AbsoluteFill style={{ ...born, opacity: 1 - smooth(prog(t, L.word(13, 'opens') + 0.6, L.word(13, 'opens') + 1.0)) }}>{X.DoorClosed()}</AbsoluteFill>}
        />
    );
}

/** Beat 14, an aside. The room lightens and the note slides in on "One honest note"; the checker comes in on
    "Check one" and runs: its two hops appear in order (the 301, then the 200 on Northway's page). */
export function HonestScene() {
    const t = useTime(); const L = local('honest');
    const check = L.word(14, 'check');
    const hop = (k: number, a: number) => {
        const q = ease(t, a, 0.45);
        return { [`--o-hop${k}`]: smooth(q * 1.5), [`--y-hop${k}`]: `${((1 - q) * 10).toFixed(2)}px` };
    };
    return (
        <FrameScene k="Honest" moves={{
            0: slideIn(t, L.word(14, 'one') - 0.25, 0.6, -40, 0),
            1: slideIn(t, check - 0.3, 0.55, 30, 0),
        }} vars={{ ...hop(1, check + 0.35), ...hop(2, check + 0.8) }} />
    );
}

/** Beat 15, the bridge. The three registrar forms stack on "in three accounts, one form at a time"; on "So instead"
    the empty file arrives, and on "you write down once" three lines draw from the forms into it (the decision); the
    line lands on "once" and holds. */
export function OnceScene() {
    const t = useTime(); const L = local('once');
    // the forms are there from the cut ("two hundred domains, in three accounts"): the room was empty for 2 s
    const sat = 0.1, fixed = L.word(15, 'write');
    const moves: Record<number, CSSProperties> = {};
    [0, 1, 2].forEach((i) => { moves[i] = slideIn(t, sat + i * 0.22, 0.55, -36, 0); });
    moves[4] = slideIn(t, L.word(15, 'so') - 0.2, 0.6, 36, 0);
    moves[5] = slideIn(t, L.word(15, 'once') - 0.1, 0.6, 0, 20);
    const draw = (k: number) => 1 - ease(t, fixed - 0.1 + k * 0.08, 0.75);
    const head = smooth(prog(t, fixed + 0.55, fixed + 0.8));
    return <FrameScene k="Once" moves={moves} vars={{ '--draw-l1': draw(0), '--draw-l2': draw(1), '--draw-l3': draw(2), '--o-head': head }} />;
}
