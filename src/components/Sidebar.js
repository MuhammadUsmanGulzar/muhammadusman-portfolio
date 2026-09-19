"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const links = [['Work', 'work'], ['Experience', 'experience'], ['About', 'about'], ['Contact', 'contact']];

export default function Sidebar() {
  const pathname = usePathname();
  const [active, setActive] = useState('home');
  useEffect(() => {
    const update = event => setActive(event.detail);
    setActive(document.querySelector('.portfolio-viewport')?.dataset.activeView || 'home');
    window.addEventListener('portfolio:viewchange', update);
    return () => window.removeEventListener('portfolio:viewchange', update);
  }, [pathname]);
  const hrefFor = id => pathname === '/' ? `#${id}` : `/#${id}`;
  return <header className="site-header">
    <a href={hrefFor('home')} className="brand" aria-label="Muhammad Usman, home" aria-current={active === 'home' ? 'page' : undefined}><span className="brand-mark">MU</span><span className="brand-name">Muhammad Usman</span></a>
    <nav className="site-nav" aria-label="Primary navigation">{links.map(([name, id]) => <a key={id} href={hrefFor(id)} className={active === id ? 'active' : ''} aria-current={active === id ? 'page' : undefined}>{name}</a>)}</nav>
    <a className="header-cta" href={hrefFor('contact')}>Get in touch</a>
  </header>;
}
