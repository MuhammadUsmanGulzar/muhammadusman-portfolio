'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const links = [['Work','/portfolio'],['Experience','/resume'],['About','/about'],['Contact','/contact']];
export default function Sidebar(){const pathname=usePathname();return <header className="site-header"><Link href="/" className="brand" aria-label="Muhammad Usman, home"><span className="brand-mark">MU</span><span className="brand-name">Muhammad Usman</span></Link><nav className="site-nav" aria-label="Primary navigation">{links.map(([name,path])=><Link key={path} href={path} className={pathname===path?'active':''}>{name}</Link>)}</nav><a className="header-cta" href="mailto:usmangulzar005@gmail.com">Get in touch</a></header>}

