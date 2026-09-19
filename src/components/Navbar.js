'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="top-navbar">
      <nav className="nav-links">
        <Link href="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
        <Link href="/portfolio" className={pathname === '/portfolio' ? 'active' : ''}>Work</Link>
        <Link href="/resume" className={pathname === '/resume' ? 'active' : ''}>Experience</Link>
        <Link href="/about" className={pathname === '/about' ? 'active' : ''}>About</Link>
      </nav>
    </header>
  );
}
