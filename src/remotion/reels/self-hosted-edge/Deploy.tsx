import { useTime, prog } from '../../lib/anim';
import { at, headline, mint, mono, orange, paper, reveal, Shop, Stage } from './Visuals';
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
                    background: '#102425',
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
                        borderBottom: '1px solid #46605e',
                    }}
                >
                    <span style={{ color: mint }}>●</span> Server shell
                </div>
                <div style={{ ...mono, color: '#abcdc5', fontSize: 24, padding: '30px 39px 0' }}>
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
                    <span style={{ color: mint }}>▍</span>
                </pre>
            </div>
            <div style={{ ...at(1188, 388), width: 625, ...reveal(t, 1.15) }}>
                <div style={{ fontSize: 54, letterSpacing: -2, fontWeight: 730, lineHeight: 1.12 }}>
                    Point DNS to
                    <br />
                    your servers.
                </div>
                <div style={{ ...mono, marginTop: 36, fontSize: 27 }}>{hostname}</div>
                {addresses.map((a, i) => (
                    <div
                        key={a}
                        style={{
                            ...mono,
                            display: 'flex',
                            gap: 38,
                            padding: '18px 0',
                            borderBottom: '1px solid #adbbb1',
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
    const close = prog(t, 5.65, 6.15);
    return (
        <Stage name="HTTPS · direct to origin">
            <div style={{ ...at(90, 177), ...headline, fontSize: 96, lineHeight: 1.02 }}>
                Visitors connect
                <br />
                <span style={{ color: mint }}>directly to you.</span>
            </div>
            <div style={{ ...at(99, 494), ...mono, color: orange }}>ON YOUR SERVER</div>
            <div style={{ ...at(99, 563), fontSize: 48, letterSpacing: -2, lineHeight: 1.28 }}>
                Edge accepts TLS on <b>443</b>.<br />
                Your app serves on <b>80</b>.
            </div>
            <div style={{ ...at(100, 802), ...mono, color: mint, opacity: close }}>redirhub.com</div>
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
