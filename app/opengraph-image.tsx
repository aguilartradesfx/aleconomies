import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Alejandro Araya — Asesor Financiero Independiente en Costa Rica'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: 'radial-gradient(ellipse at 70% 30%, #1A1F2A 0%, #0E1218 60%, #090C11 100%)',
          fontFamily: 'sans-serif',
          color: '#ECECEF',
        }}
      >
        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '10px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '10px',
              height: '10px',
              background: '#8B5CF6',
              borderRadius: '50%',
              boxShadow: '0 0 12px rgba(139,92,246,0.6)',
            }} />
          </div>
          <span style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.5px' }}>
            alejandro araya
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            fontSize: '72px',
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: '-3px',
            maxWidth: '900px',
            display: 'flex',
            flexWrap: 'wrap',
          }}>
            Su plata, su plan,&nbsp;
            <span style={{ fontStyle: 'italic', color: '#A78BFA' }}>su ritmo.</span>
          </div>
          <div style={{ fontSize: '24px', color: 'rgba(236,236,239,0.72)', maxWidth: '800px' }}>
            Asesoría financiera 1 a 1 en Costa Rica.
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '18px',
          color: 'rgba(236,236,239,0.48)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '24px',
        }}>
          <span>aleconomies.com</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '6px',
              height: '6px',
              background: '#8B5CF6',
              borderRadius: '50%',
              boxShadow: '0 0 8px rgba(139,92,246,0.6)',
              display: 'inline-block',
            }} />
            Asesor financiero independiente
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
