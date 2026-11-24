import { RedirHubLogo } from '../../brand/Logo';
import { color, font } from '../../brand/tokens';
import { AbsoluteFill } from 'remotion';
import { useTime, prog } from '../../lib/anim';
import { at, headline, ink, label, mono, paper, reveal, Shop, Stage } from './Visuals';
import { edgeDefaults } from './props';

export function Deploy({ hostname, addresses }: typeof edgeDefaults) {
    const t = useTime();
    const rows = [
        'docker run -d --network host',
        '  --restart unless-stopped',
        '  -v redirhub-edge:/data',
        '  -e REDIRHUB_TOKEN',
        '  redirhub/edge',
    ];
    const command = rows.join(' ' + String.fromCharCode(92, 10));
    return (
        <Stage light name="Docker + DNS">
            <div style={{ ...at(90, 170), ...headline }}>Put Edge on each host.</div>
            <div
                style={{
                    ...at(92, 356),
                    width: 1020,
                    height: 577,
                    borderRadius: 26,
                    background: ink,
                    color: paper,
                    boxShadow: '0 24px 54px #142a251a',
                }}
            >
                <div
                    style={{
                        ...mono,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20,
                        padding: '28px 37px',
                        borderBottom: `1px solid ${color.g700}`,
                    }}
                >
                    <span style={{ color: color.teal }}>●</span> Server shell
                </div>
                <div style={{ ...mono, color: color.g300, fontSize: 24, padding: '30px 39px 0' }}>
                    # Workspace token already exported
                </div>
                <pre
                    style={{
                        ...mono,
                        fontSize: 35,
                        lineHeight: 1.53,
                        padding: '10px 39px',
                        margin: 0,
                        color: paper,
                    }}
                >
                    {command.slice(0, Math.round(command.length * prog(t, 0.15, 2.05)))}
                    <span style={{ color: color.teal }}>▍</span>
                </pre>
            </div>
            <div style={{ ...at(1188, 388), width: 625, ...reveal(t, 1.15) }}>
                <div style={{ fontSize: 54, letterSpacing: -2, fontWeight: 730, lineHeight: 1.12 }}>
                    Point DNS to
                    <br />
                    your servers.
                </div>
                <div style={{ ...label, marginTop: 36, fontSize: 27 }}>{hostname}</div>
                {addresses.map((a, i) => (
                    <div
                        key={a}
                        style={{
                            ...label,
                            display: 'flex',
                            gap: 38,
                            padding: '18px 0',
                            borderBottom: `1px solid ${color.g300}`,
                            ...reveal(t, 2.1 + i * 0.23),
                        }}
                    >
                        <strong>A</strong>
                        {a}
                    </div>
                ))}
            </div>
        </Stage>
    );
}
export function Visit({ hostname }: { hostname: string }) {
    const t = useTime();
    if (t >= 6.6) {
        return <AbsoluteFill style={{background: paper, color: ink, alignItems: 'center', justifyContent: 'center', fontFamily: font.sans}}>
            <RedirHubLogo style={{width: 416}} />
            <div style={{fontSize: 82, fontWeight: 700, letterSpacing: -3, marginTop: 66}}>Self-Hosted Edge</div>
            <div style={{fontSize: 36, color: color.blue, marginTop: 26}}>redirhub.com/managed-ssl-certificates</div>
        </AbsoluteFill>;
    }
    return (
        <Stage name="HTTPS · direct to origin">
            <div style={{ ...at(90, 177), ...headline, fontSize: 96, lineHeight: 1.02 }}>
                Visitors connect
                <br />
                <span style={{ color: color.teal }}>directly to you.</span>
            </div>
            <div style={{ ...at(99, 494), ...label, color: color.g300 }}>On your server</div>
            <div style={{ ...at(99, 563), fontSize: 48, letterSpacing: -2, lineHeight: 1.28 }}>
                Edge accepts TLS on <b>443</b>.<br />
                Your app serves on <b>80</b>.
            </div>
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    transform: 'translateY(' + Math.max(0, 1 - t * 2) * 24 + 'px)',
                }}
            >
                <Shop x={902} y={259} w={898} host={hostname} />
            </div>
        </Stage>
    );
}
