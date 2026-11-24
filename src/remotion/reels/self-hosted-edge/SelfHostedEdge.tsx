import { AbsoluteFill, Html5Audio, Sequence, staticFile } from 'remotion';
import { Beat } from '../../components/Beat';
import { Sfx } from '../../components/Sfx';
import { Deploy, Visit } from './Deploy';
import { Certbot, Hook, Proxy, Sync } from './Routes';
import { edgeDefaults, seconds, shotStarts } from './props';

export function SelfHostedEdge(props: typeof edgeDefaults) {
    const shots = [
        <Hook />,
        <Certbot />,
        <Proxy />,
        <Sync host={props.hostname} />,
        <Deploy {...props} />,
        <Visit hostname={props.hostname} />,
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
            <Beat volume={0.2} />
            <Html5Audio src={staticFile('audio/self-hosted-edge-vo.mp3')} />
            <Sfx
                cues={[
                    [0.6, 'swish_r', 0.25],
                    [11.5, 'whoosh', 0.22],
                    [15.6, 'snap', 0.23],
                    [17.8, 'fixed', 0.21],
                    [30.5, 'success', 0.23],
                ]}
            />
        </AbsoluteFill>
    );
}
