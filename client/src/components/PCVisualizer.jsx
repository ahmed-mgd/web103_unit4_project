import React from 'react'

const PCVisualizer = ({ selectedCase, selectedGpu, selectedRam }) => {
  const specs = selectedCase?.specs || {}
  const size = specs.size || 'mid'
  const hasWindow = specs.window !== undefined ? specs.window : false
  const hasRgb = specs.rgb !== undefined ? specs.rgb : false

  const caseConfig = {
    compact: { h: 220, viewH: 265 },
    mid:     { h: 300, viewH: 345 },
    full:    { h: 390, viewH: 435 }
  }
  const { h, viewH } = caseConfig[size] || caseConfig.mid

  const W = 190
  const fpW = 42
  const accentColor = hasRgb ? '#c084fc' : '#3b82f6'
  const glowId = `glow-${size}`

  const ramStickCount = selectedRam?.specs?.sticks || 2

  return (
    <div className="pc-visualizer-wrap">
      <svg
        viewBox={`0 0 ${W + 40} ${viewH}`}
        className="pc-visualizer-svg"
        aria-label={`PC Case: ${selectedCase?.name || 'Select a case'}`}
      >
        <defs>
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {hasRgb && (
            <linearGradient id="rgbStrip" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff0080">
                <animate attributeName="stopColor"
                  values="#ff0080;#a855f7;#3b82f6;#06b6d4;#10b981;#f59e0b;#ff0080"
                  dur="4s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#a855f7">
                <animate attributeName="stopColor"
                  values="#a855f7;#3b82f6;#06b6d4;#10b981;#f59e0b;#ff0080;#a855f7"
                  dur="4s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          )}
          <linearGradient id="caseGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e2035" />
            <stop offset="100%" stopColor="#12131f" />
          </linearGradient>
          <linearGradient id="frontGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0d0e1a" />
            <stop offset="100%" stopColor="#141525" />
          </linearGradient>
        </defs>

        {/* Drop shadow */}
        <rect x="26" y="26" width={W} height={h} rx="8" fill="rgba(0,0,0,0.5)" />

        {/* Case body */}
        <rect x="20" y="20" width={W} height={h} rx="8" fill="url(#caseGrad)" stroke="#2a2b45" strokeWidth="1.5" />

        {/* Front panel */}
        <rect x="20" y="20" width={fpW} height={h} rx="8" fill="url(#frontGrad)" />
        <rect x={20 + fpW - 1} y="20" width="1.5" height={h} fill="#0a0b15" />

        {/* Power button */}
        <circle cx={20 + fpW / 2} cy="52" r="9"
          fill="#13141f" stroke={accentColor} strokeWidth="1.5"
          filter={`url(#${glowId})`} />
        <circle cx={20 + fpW / 2} cy="52" r="5" fill={accentColor} opacity="0.85">
          {hasRgb && (
            <animate attributeName="fill"
              values="#ff0080;#a855f7;#3b82f6;#06b6d4;#ff0080"
              dur="3s" repeatCount="indefinite" />
          )}
        </circle>

        {/* USB ports */}
        <rect x={20 + fpW / 2 - 8} y="70" width="16" height="5" rx="1.5" fill="#0a0b18" stroke="#2a2b40" strokeWidth="0.5" />
        <rect x={20 + fpW / 2 - 8} y="79" width="16" height="5" rx="1.5" fill="#0a0b18" stroke="#2a2b40" strokeWidth="0.5" />
        <rect x={20 + fpW / 2 - 5} y="90" width="10" height="4" rx="1" fill="#0a0b18" stroke="#2a2b40" strokeWidth="0.5" />

        {/* Front LED strip */}
        <rect
          x="20" y={20 + h * 0.25}
          width="5" height={h * 0.5}
          fill={hasRgb ? 'url(#rgbStrip)' : accentColor}
          opacity={hasRgb ? 1 : 0.5}
          rx="2"
        />

        {/* Front ventilation grills (bottom) */}
        {[0, 1, 2, 3, 4].map(i => (
          <rect key={i}
            x={24} y={20 + h - 36 + i * 6}
            width={fpW - 8} height="2.5" rx="1"
            fill="#0d0e1a" />
        ))}

        {/* Side window (glass or closed panel) */}
        {hasWindow ? (
          <>
            {/* Glass panel */}
            <rect x={20 + fpW + 6} y="28" width={W - fpW - 14} height={h - 16} rx="5"
              fill="rgba(59,130,246,0.03)" stroke="rgba(59,130,246,0.18)" strokeWidth="1.5" />

            {/* Inner board background */}
            <rect x={20 + fpW + 11} y="36" width={W - fpW - 24} height={h - 30} rx="3"
              fill="#0b0c17" />

            {/* CPU Cooler */}
            <g>
              <circle cx={20 + fpW + 36} cy={20 + h * 0.22} r="22"
                fill="#14172a" stroke="#1e2238" strokeWidth="1" />
              {[...Array(8)].map((_, i) => {
                const angle = (i / 8) * Math.PI * 2
                const r1 = 8, r2 = 18
                const x1 = (20 + fpW + 36) + Math.cos(angle) * r1
                const y1 = (20 + h * 0.22) + Math.sin(angle) * r1
                const x2 = (20 + fpW + 36) + Math.cos(angle) * r2
                const y2 = (20 + h * 0.22) + Math.sin(angle) * r2
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a1e32" strokeWidth="2" />
              })}
              <circle cx={20 + fpW + 36} cy={20 + h * 0.22} r="7"
                fill={accentColor} opacity="0.25" filter={`url(#${glowId})`} />
              <circle cx={20 + fpW + 36} cy={20 + h * 0.22} r="4"
                fill={accentColor} opacity="0.6" />
            </g>

            {/* RAM sticks */}
            {[...Array(Math.min(ramStickCount, 4))].map((_, i) => (
              <g key={i}>
                <rect x={20 + fpW + 65 + i * 15} y="40" width="10" height={Math.min(h * 0.28, 70)} rx="2"
                  fill="#12152a" stroke="#1e2240" strokeWidth="0.8" />
                <rect x={20 + fpW + 67 + i * 15} y="43" width="6" height="6" rx="1"
                  fill={hasRgb ? 'url(#rgbStrip)' : accentColor}
                  opacity={hasRgb ? 0.9 : 0.6}
                  filter={hasRgb ? `url(#${glowId})` : undefined} />
                {hasRgb && (
                  <rect x={20 + fpW + 67 + i * 15} y="51" width="6" height={Math.min(h * 0.24, 55)} rx="1"
                    fill="url(#rgbStrip)" opacity="0.4" />
                )}
              </g>
            ))}

            {/* GPU */}
            <rect x={20 + fpW + 11} y={20 + h - 105} width={W - fpW - 24} height="38" rx="4"
              fill="#10121f" stroke="#1a1d30" strokeWidth="1" />
            <rect x={20 + fpW + 14} y={20 + h - 101} width={W - fpW - 50} height="30" rx="2"
              fill="#0c0e1a" />
            {/* GPU fans */}
            {[0, 1].map(i => (
              <g key={i}>
                <circle cx={20 + fpW + 30 + i * 35} cy={20 + h - 86} r="12"
                  fill="#0e1020" stroke="#1a1d2e" strokeWidth="1" />
                <circle cx={20 + fpW + 30 + i * 35} cy={20 + h - 86} r="5"
                  fill="#13162a" stroke="#20243a" strokeWidth="0.8" />
                {[0, 1, 2, 3].map(j => {
                  const a = (j / 4) * Math.PI * 2
                  return <line key={j}
                    x1={20 + fpW + 30 + i * 35} y1={20 + h - 86}
                    x2={(20 + fpW + 30 + i * 35) + Math.cos(a) * 10}
                    y2={(20 + h - 86) + Math.sin(a) * 10}
                    stroke="#1e2238" strokeWidth="1.5" />
                })}
              </g>
            ))}
            {/* GPU RGB strip */}
            <rect x={W + 20 - 35} y={20 + h - 100} width="5" height="28" rx="2"
              fill={hasRgb ? 'url(#rgbStrip)' : accentColor}
              opacity={hasRgb ? 0.9 : 0.35}
              filter={hasRgb ? `url(#${glowId})` : undefined} />

            {/* PSU */}
            <rect x={20 + fpW + 11} y={20 + h - 60} width={W - fpW - 24} height="28" rx="3"
              fill="#0d0f1c" stroke="#181a2e" strokeWidth="1" />
            <rect x={20 + fpW + 14} y={20 + h - 57} width="20" height="22" rx="2" fill="#12141f" />

          </>
        ) : (
          <>
            {/* Solid side panel */}
            <rect x={20 + fpW + 6} y="28" width={W - fpW - 14} height={h - 16} rx="5"
              fill="#111220" stroke="#1a1b2e" strokeWidth="1" />
            {/* Panel screws */}
            {[[15, 18], [W - fpW - 22, 18], [15, h - 22], [W - fpW - 22, h - 22]].map(([dx, dy], i) => (
              <circle key={i}
                cx={20 + fpW + 6 + dx} cy={28 + dy} r="3"
                fill="#0d0e1a" stroke="#1e1f30" strokeWidth="0.8" />
            ))}
            {/* Brand emblem */}
            <rect x={20 + fpW + (W - fpW) / 2 - 22} y={20 + h / 2 - 12}
              width="44" height="24" rx="3"
              fill="#0d0e1a" stroke="#1a1b30" strokeWidth="1" />
            <text
              x={20 + fpW + (W - fpW) / 2} y={20 + h / 2 + 5}
              textAnchor="middle" fill={accentColor}
              fontSize="10" fontFamily="monospace" opacity="0.6">
              PC BUILD
            </text>
          </>
        )}

        {/* Top panel edge */}
        <rect x="20" y="20" width={W} height="7" rx="8" fill="#252640" />

        {/* Bottom feet */}
        <rect x="30" y={20 + h - 2} width="18" height="7" rx="2" fill="#0c0d18" />
        <rect x={20 + W - 26} y={20 + h - 2} width="18" height="7" rx="2" fill="#0c0d18" />

        {/* Top ventilation */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <rect key={i}
            x={40 + i * 18} y="22"
            width="10" height="3" rx="1"
            fill="#1a1b2e" />
        ))}
      </svg>

      <p className="pc-case-label">
        {selectedCase ? selectedCase.name : 'Select a case to preview'}
      </p>
    </div>
  )
}

export default PCVisualizer
