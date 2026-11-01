import React from 'react';

// Inline SVG keeps icons usable when external font services are unavailable.
export default function Icon({ children, style = {}, ...props }) {
  const name = String(children).trim();
  const paths = {
    person: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21v-2a8 6 0 0 1 16 0v2',
    business: 'M5 21V3h14v18M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1M10 21v-3h4v3',
    call: 'M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4c0 5-18-2-18-14z',
    check: 'm5 12 4 4L19 6',
    download: 'M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4',
    play_circle: 'M9 6v12l10-6z',
    casino: 'M4 3h16v18H4zM8 7h.01M16 7h.01M12 12h.01M8 17h.01M16 17h.01',
  };
  return <svg {...props} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ ...style, width: style.fontSize || '1em', height: style.fontSize || '1em', flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}><path d={paths[name] || 'M12 3 3 8v5c0 5 9 8 9 8s9-3 9-8V8zM8 12l3 3 5-6'} /></svg>;
}
