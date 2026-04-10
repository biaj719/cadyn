export const CadynLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <svg width="32" height="32" viewBox="0 0 38 38">
      <rect width="38" height="38" rx="10" fill="#E8EDEA"/>
      <path
        d="M8 20 Q13 9, 19 20 Q25 31, 31 20"
        fill="none"
        stroke="#2F6F5A"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M8 16 Q13 27, 19 16 Q25 5, 31 16"
        fill="none"
        stroke="#2F6F5A"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
    <span style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '0.08em', color: '#2C4A3E' }}>
      CADYN
    </span>
  </div>
);
