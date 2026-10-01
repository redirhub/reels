/* One keystroke sound per typed character, in sync with the text appearing.
   The strokes are cut from a typing recording (scripts/audio/slice_keystrokes.py) into
   public/audio/free-coffee/key-N.wav; source in docs/audio-licenses.md. */
import { Html5Audio, Sequence, staticFile, useVideoConfig } from 'remotion';

const KEYS = 8;
const LEN = 0.12;

/** `times` in absolute seconds. Strokes rotate through the bank, with small level changes so
    a run of keys doesn't sound like a machine gun. */
export function Keystrokes({ times, volume = 0.6 }: { times: readonly number[]; volume?: number }) {
    const { fps } = useVideoConfig();
    const order = [3, 1, 6, 2, 8, 4, 7, 5, 2, 6, 1, 8];
    const level = [1, 0.85, 0.95, 0.8, 1, 0.9, 0.85, 0.95];
    return (
        <>
            {times.map((at, i) => (
                <Sequence key={i} name={`key ${i + 1}`} from={Math.round(at * fps)} durationInFrames={Math.ceil(LEN * fps)} layout="none">
                    <Html5Audio src={staticFile(`audio/free-coffee/key-${order[i % order.length] > KEYS ? 1 : order[i % order.length]}.wav`)} volume={volume * level[i % level.length]} />
                </Sequence>
            ))}
        </>
    );
}
