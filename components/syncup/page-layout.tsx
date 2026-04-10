"use client";

interface PageLayoutProps {
  children: React.ReactNode;
}

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {children}
    </div>
  );
}

export function PageTitle({ icon, title, subtitle }: PageHeaderProps) {
  return (
    <div style={{
      padding: '24px 32px 20px',
      borderBottom: '1px solid #EDE8E0',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
    }}>
      <div style={{ marginTop: '3px', flexShrink: 0 }}>{icon}</div>
      <div>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#1C1C1E', lineHeight: 1.1 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '14px', color: '#8A847C', marginTop: '4px' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export function PageContent({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      flex: 1,
      padding: '24px 32px 40px',
    }}>
      {children}
    </div>
  );
}
