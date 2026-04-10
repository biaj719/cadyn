export const CadynLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <svg width="32" height="32" viewBox="0 0 680 680" style={{ borderRadius: '8px' }}>
      <rect width="680" height="680" fill="#F5F2EC" rx="152"/>
      <path d="M 100 310 C 180 210, 290 210, 340 310 C 390 410, 500 410, 580 310"
        fill="none" stroke="#4F7A67" strokeWidth="18" strokeLinecap="round" opacity="0.25"/>
      <path d="M 120 345 C 200 245, 290 245, 340 345 C 390 445, 480 445, 560 345"
        fill="none" stroke="#4F7A67" strokeWidth="24" strokeLinecap="round" opacity="0.6"/>
      <path d="M 140 380 C 210 285, 295 285, 340 375 C 385 465, 470 470, 545 385"
        fill="none" stroke="#4F7A67" strokeWidth="18" strokeLinecap="round" opacity="0.25"/>
    </svg>
    <span style={{ fontSize: '18px', fontWeight: 500, letterSpacing: '0.05em', color: '#2C4A3E' }}>
      CADYN
    </span>
  </div>
);
