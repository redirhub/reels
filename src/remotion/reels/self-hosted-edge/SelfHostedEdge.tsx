import { AbsoluteFill, Html5Audio, Sequence, staticFile } from 'remotion';
import { Beat } from '../../components/Beat';
import { Sfx } from '../../components/Sfx';
import { Deploy } from './Deploy';
import { Certificates, Compare, Traffic } from './Routes';
import { edgeDefaults, seconds, shotStarts } from './props';

export function SelfHostedEdge(props: typeof edgeDefaults) {
    const shots = [
        <Traffic host={props.hostname} />,
        <Certificates host={props.hostname} />,
        <Compare />,
        <Deploy {...props} />,
    ];
    return (
        <AbsoluteFill>
            {shots.map((shot, i) => (
                <Sequence
                    key={shotStarts[i]}
                    from={Math.round(shotStarts[i] * 30)}
                    durationInFrames={Math.round(((shotStarts[i + 1] ?? seconds) - shotStarts[i]) * 30)}
                >
                    {shot}
                </Sequence>
            ))}
            <Beat volume={0.14} />
            <Html5Audio src={staticFile('audio/self-hosted-edge-vo.mp3')} />
            <Sfx
                cues={[
                    [6.8, 'fixed', 0.18],
                    [22.2, 'success', 0.2],
                ]}
            />
        </AbsoluteFill>
    );
}
