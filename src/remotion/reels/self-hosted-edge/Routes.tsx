import { Img } from 'remotion';
import { color } from '../../brand/tokens';
import { prog, useTime } from '../../lib/anim';
import { at, Packet, Stage, Status, surface } from './Visuals';
import serverImage from './server.webp';

function Server({ left, top, width }: { left: number; top: number; width: number }) {
    const file: string | { src: string } = serverImage;
    return <Img src={typeof file === 'string' ? file : file.src} style={{ ...at(left, top), width }} />;
}
export function Traffic({ host }: { host: string }) {
    const t = useTime();
    return (
        <Stage title="Visitors connect" focus="directly to your server.">
            <svg width="1920" height="1080" style={at(0, 0)}>
                <Packet d="M 687 621 H 1260" progress={prog(t, 0.4, 2.1)} />
            </svg>
            <div style={{ ...surface, ...at(180, 475), width: 535, overflow: 'hidden' }}>
                <div
                    style={{
                        background: color.g50,
                        borderBottom: `2px solid ${color.g200}`,
                        padding: '18px 34px',
                        fontSize: 28,
                        color: color.g600,
                    }}
                >
                    Browser
                </div>
                <div style={{ padding: '48px 34px', fontSize: 35, fontWeight: 600 }}>https://{host}</div>
            </div>
            <div style={{ ...at(885, 537), fontSize: 40, color: color.blue, fontWeight: 650 }}>HTTPS →</div>
            <Server left={1190} top={404} width={500} />
            <div style={{ ...at(1140, 766), width: 600, textAlign: 'center', fontSize: 44, fontWeight: 650 }}>
                Your server
            </div>
        </Stage>
    );
}
export function Certificates({ host }: { host: string }) {
    const t = useTime();
    return (
        <Stage title="RedirHub renews." focus="Each server syncs.">
            <svg width="1920" height="1080" style={at(0, 0)}>
                {[450, 632, 814].map((y, i) => (
                    <Packet
                        key={y}
                        d={`M 782 632 H 954 C 1060 632 1010 ${y} 1132 ${y} H 1280`}
                        progress={prog(t, 0.55 + i * 0.38, 2.15 + i * 0.38)}
                    />
                ))}
            </svg>
            <div
                style={{
                    ...surface,
                    ...at(189, 492),
                    width: 612,
                    padding: '40px 48px',
                    borderTop: `8px solid ${color.blue}`,
                }}
            >
                <div style={{ fontSize: 31, color: color.g600 }}>TLS certificate</div>
                <div style={{ fontSize: 47, fontWeight: 700, margin: '17px 0 26px' }}>{host}</div>
                <div style={{ fontSize: 30 }}>
                    <Status>Renewed by RedirHub</Status>
                </div>
            </div>
            {[0, 1, 2].map((i) => (
                <div key={i}>
                    <Server left={1228} top={360 + i * 182} width={248} />
                    <div style={{ ...at(1490, 422 + i * 182), fontSize: 34, fontWeight: 600 }}>Server {i + 1}</div>
                    <div
                        style={{
                            ...at(1490, 469 + i * 182),
                            fontSize: 26,
                            opacity: prog(t, 2.1 + i * 0.38, 2.32 + i * 0.38),
                        }}
                    >
                        <Status>Synced</Status>
                    </div>
                </div>
            ))}
        </Stage>
    );
}
export function Compare() {
    const t = useTime();
    const rows = [
        ['Cloudflare proxy', 'Via Cloudflare', 'At the Cloudflare edge'],
        ['Certbot + direct DNS', 'Direct to origin', 'Your team deploys certificates'],
        ['RedirHub Edge', 'Direct to origin', 'RedirHub syncs certificates'],
    ];
    return (
        <Stage title="Three ways to" focus="serve HTTPS.">
            <div style={{ ...at(141, 374), width: 1638, fontSize: 34 }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '420px 410px 1fr',
                        padding: '0 32px 22px',
                        color: color.g600,
                        fontSize: 28,
                    }}
                >
                    <span>Setup</span>
                    <span>Visitor traffic</span>
                    <span>Certificate deployment</span>
                </div>
                {rows.map((row, i) => (
                    <div
                        key={row[0]}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '420px 410px 1fr',
                            alignItems: 'center',
                            height: 125,
                            padding: '0 32px',
                            borderTop: `2px solid ${color.g200}`,
                            background: i === 2 ? color.blueBg : 'white',
                            color: i === 2 ? color.blue : color.charcoal,
                            opacity: 0.65 + 0.35 * prog(t, i * 0.75, i * 0.75 + 0.3),
                        }}
                    >
                        <strong>{row[0]}</strong>
                        <span>{row[1]}</span>
                        <span>{row[2]}</span>
                    </div>
                ))}
            </div>
        </Stage>
    );
}
