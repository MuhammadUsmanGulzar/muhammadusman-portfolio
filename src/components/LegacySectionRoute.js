"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Keep existing project bookmarks working after the move to a single page.
export default function LegacySectionRoute({ section }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/${window.location.hash || `#${section}`}`, { scroll: false });
  }, [router, section]);
  return <p className="container"><a href={`/#${section}`}>Go to {section}</a></p>;
}
