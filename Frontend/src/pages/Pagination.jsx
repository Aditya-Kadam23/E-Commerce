import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, setPage, allPages }) => {
  if (allPages <= 1) return null;

  const pages = [];
  const delta = 2;
  for (let i = Math.max(1, page - delta); i <= Math.min(allPages, page + delta); i++) {
    pages.push(i);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
      <button
        onClick={() => setPage(p => Math.max(1, p - 1))}
        disabled={page === 1}
        style={{
          width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)',
          background: 'var(--color-surface)', cursor: page === 1 ? 'not-allowed' : 'pointer',
          opacity: page === 1 ? 0.5 : 1, color: 'var(--color-text)', transition: 'all 0.2s'
        }}
      >
        <ChevronLeft size={16} />
      </button>

      {pages[0] > 1 && (
        <>
          <button onClick={() => setPage(1)} style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', background: 'var(--color-surface)', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>1</button>
          {pages[0] > 2 && <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>…</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p} onClick={() => setPage(p)}
          style={{
            width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
            border: `1.5px solid ${p === page ? 'var(--color-primary)' : 'var(--color-border)'}`,
            background: p === page ? 'var(--color-primary)' : 'var(--color-surface)',
            color: p === page ? '#fff' : 'var(--color-text)',
            cursor: 'pointer', fontSize: '14px', fontWeight: p === page ? '700' : '500',
            transition: 'all 0.2s'
          }}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < allPages && (
        <>
          {pages[pages.length - 1] < allPages - 1 && <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>…</span>}
          <button onClick={() => setPage(allPages)} style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', background: 'var(--color-surface)', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>{allPages}</button>
        </>
      )}

      <button
        onClick={() => setPage(p => Math.min(allPages, p + 1))}
        disabled={page === allPages}
        style={{
          width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)',
          background: 'var(--color-surface)', cursor: page === allPages ? 'not-allowed' : 'pointer',
          opacity: page === allPages ? 0.5 : 1, color: 'var(--color-text)', transition: 'all 0.2s'
        }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
