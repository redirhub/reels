import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'RedirHub Reels',
    description: 'Preview and download RedirHub social videos.',
    robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
