import { color, font } from '../../brand/tokens';
import { prog, useTime } from '../../lib/anim';
import { at, Stage, Status, surface } from './Visuals';
import { edgeDefaults } from './props';

export function Deploy({ hostname, addresses }: typeof edgeDefaults) {
    const t = useTime();
    const command = [
        'docker run -d --network host',
        '  --restart unless-stopped',
        '  -v redirhub-edge:/data',
        '  -e REDIRHUB_TOKEN',
        '  redirhub/edge',
    ].join(' ' + String.fromCharCode(92, 10));
    return (
        <Stage title="Run Edge." focus="Point your DNS.">
            <div style={{ ...at(137, 360), fontSize: 38, fontWeight: 650 }}>1. Run on each server</div>
            <div
                style={{
                    ...at(137, 438),
                    width: 874,
                    height: 393,
                    background: '#0B1220',
                    color: '#E5E7EB',
                    borderRadius: 20,
                    overflow: 'hidden',
                }}
            >
                <div style={{ padding: '18px 35px', borderBottom: '1px solid #ffffff28', fontSize: 25 }}>
                    Shell · workspace token exported
                </div>
                <pre style={{ fontFamily: font.mono, fontSize: 31, lineHeight: 1.46, margin: '28px 34px' }}>
                    {command.slice(0, Math.ceil(command.length * prog(t, 0, 1.05)))}
                </pre>
            </div>
            <div style={{ ...at(1115, 360), fontSize: 38, fontWeight: 650 }}>2. Point to your servers</div>
            <div style={{ ...at(1115, 438), ...surface, width: 664, padding: '30px 38px' }}>
                <div style={{ fontSize: 37, fontWeight: 650, marginBottom: 20 }}>{hostname}</div>
                {addresses.map((ip, i) => (
                    <div
                        key={ip}
                        style={{
                            display: 'flex',
                            gap: 42,
                            borderTop: `1px solid ${color.g200}`,
                            padding: '12px 0',
                            fontSize: 29,
                            opacity: prog(t, 1.25 + i * 0.16, 1.6 + i * 0.16),
                        }}
                    >
                        <b>A</b>
                        {ip}
                    </div>
                ))}
            </div>
            <div style={{ ...at(1115, 814), fontSize: 32, opacity: prog(t, 3.55, 4.05) }}>
                <Status>Serving over HTTPS</Status>
            </div>
            <div style={{ ...at(137, 943), fontSize: 27, color: color.blue }}>
                redirhub.com/managed-ssl-certificates
            </div>
        </Stage>
    );
}
