export const metadata = { title: 'AWAKEN', description: 'Your Real-Life System' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0b0f14', color: '#eaecef', fontFamily: 'ui-sans-serif, system-ui' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
