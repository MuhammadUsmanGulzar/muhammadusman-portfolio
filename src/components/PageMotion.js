'use client';

import { useEffect, useRef } from 'react';

// Content is visible without JS. The reveal is a progressive enhancement on the active view.
export default function PageMotion({ className, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current, view = root.closest('[data-portfolio-view]');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || preference.matches || view?.hidden) continue;
        observer.unobserve(entry.target);
        const animation = entry.target.animate([
          {opacity:0,transform:'perspective(1100px) translate3d(0,16px,-18px) rotateX(1.5deg)'},
          {opacity:1,transform:'perspective(1100px) translate3d(0,0,0) rotateX(0)'},
        ],{duration:520,delay:Number(entry.target.dataset.revealOrder||0)%3*55,easing:'cubic-bezier(.2,.65,.25,1)'});
        animations.add(animation);animation.finished.then(()=>animations.delete(animation)).catch(()=>{});
      }
    },{root:view,threshold:.08});
    root.querySelectorAll('[data-depth-reveal]').forEach((node,index)=>{node.dataset.revealOrder=String(index);observer.observe(node);});
    const stop = () => {if(preference.matches||view?.hidden){animations.forEach(animation=>animation.cancel());animations.clear();}};
    preference.addEventListener('change',stop);window.addEventListener('portfolio:viewchange',stop);
    return ()=>{observer.disconnect();animations.forEach(animation=>animation.cancel());preference.removeEventListener('change',stop);window.removeEventListener('portfolio:viewchange',stop);};
  },[]);
  return <div ref={ref} className={className}>{children}</div>;
}
