"use client";

import { useEffect, useRef } from 'react';

const order = ['home', 'work', 'experience', 'about', 'contact'];
const titles = { home: 'Home', work: 'Work', experience: 'Experience', about: 'About', contact: 'Contact' };

export default function ViewDeck({ children }) {
  const viewportRef = useRef(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const panels = Array.from(viewport.querySelectorAll('[data-portfolio-view]'));
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let active = 'home';
    let animations = [];
    let generation = 0;
    let lastHash = location.hash;
    const oldRestoration = history.scrollRestoration;
    const oldTitle = document.title;
    history.scrollRestoration = 'manual';

    const revealOnly = id => {
      for (const panel of panels) {
        const selected = panel.id === id;
        panel.hidden = !selected;
        panel.inert = !selected;
        panel.setAttribute('aria-hidden', String(!selected));
      }
      viewport.dataset.activeView = id;
    };
    const stopAnimation = () => {
      generation += 1;
      animations.forEach(animation => animation.cancel());
      animations = [];
      delete viewport.dataset.transitioning;
      revealOnly(active);
    };
    const publishView = () => {
      document.title = active === 'home' ? oldTitle : `${titles[active]} | Muhammad Usman`;
      window.dispatchEvent(new CustomEvent('portfolio:viewchange', { detail: active }));
    };
    const resolveTarget = hash => {
      try {
        const target = document.getElementById(decodeURIComponent(hash.slice(1) || 'home'));
        const panel = target?.closest('[data-portfolio-view]');
        return panel && viewport.contains(panel) ? { target, panel } : null;
      } catch { return null; }
    };
    const placeTarget = ({ target, panel }) => {
      const top = target === panel ? 0 : target.getBoundingClientRect().top - panel.getBoundingClientRect().top + panel.scrollTop - 24;
      panel.scrollTo({ top: Math.max(0, top), left: 0, behavior: 'instant' });
    };
    const focusTarget = ({ target }) => {
      const heading = target.querySelector('h1, h2, h3') || target;
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    };

    const navigate = (resolved, animate = true, focus = true) => {
      stopAnimation();
      const previous = active;
      const next = resolved.panel.id;
      active = next;
      const direction = Math.sign(order.indexOf(next) - order.indexOf(previous));
      viewport.dataset.direction = direction > 0 ? 'right' : direction < 0 ? 'left' : 'none';
      revealOnly(next);
      placeTarget(resolved);
      publishView();
      if (!animate || motion.matches || direction === 0) {
        if (focus) focusTarget(resolved);
        return;
      }

      const outgoing = panels.find(panel => panel.id === previous);
      const incoming = resolved.panel;
      // Only the departing and selected views participate in the transition.
      // All other panels remain hidden and cannot be reached by scrolling or Tab.
      outgoing.hidden = false;
      outgoing.inert = true;
      incoming.inert = true;
      viewport.dataset.transitioning = 'true';
      const token = generation;
      const timing = { duration: 640, easing: 'cubic-bezier(.22,.7,.2,1)', fill: 'both' };
      animations = [
        outgoing.animate([
          { transform: 'translateX(0) translateZ(0) rotateY(0)', opacity: 1 },
          { transform: `translateX(${-direction * 55}%) translateZ(-110px) rotateY(${direction * 3}deg)`, opacity: 0 }
        ], timing),
        incoming.animate([
          { transform: `translateX(${direction * 80}%) translateZ(-110px) rotateY(${-direction * 3}deg)`, opacity: 0 },
          { transform: 'translateX(0) translateZ(0) rotateY(0)', opacity: 1 }
        ], timing)
      ];
      Promise.all(animations.map(animation => animation.finished)).then(() => {
        if (generation !== token) return;
        stopAnimation();
        if (focus) focusTarget(resolved);
      }).catch(() => { /* A newer navigation cancels the old transition. */ });
    };

    const onClick = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const link = event.target.closest?.('a[href]');
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname !== '/' || url.search || !url.hash) return;
      const resolved = resolveTarget(url.hash);
      if (!resolved) return;
      event.preventDefault();
      lastHash = url.hash;
      if (location.hash !== url.hash) history.pushState(history.state, '', url.hash);
      navigate(resolved);
    };
    const onHistory = () => {
      if (location.hash === lastHash) return;
      lastHash = location.hash;
      const resolved = resolveTarget(location.hash);
      if (resolved) navigate(resolved);
    };
    const onMotionChange = () => { if (motion.matches) stopAnimation(); };
    const initial = resolveTarget(location.hash) || resolveTarget('#home');
    if (initial) navigate(initial, false, false);
    viewport.dataset.ready = 'true';
    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onHistory);
    window.addEventListener('hashchange', onHistory);
    motion.addEventListener('change', onMotionChange);
    return () => {
      stopAnimation();
      delete viewport.dataset.ready;
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onHistory);
      window.removeEventListener('hashchange', onHistory);
      motion.removeEventListener('change', onMotionChange);
      history.scrollRestoration = oldRestoration;
      document.title = oldTitle;
    };
  }, []);

  return <div ref={viewportRef} className="portfolio-viewport" data-active-view="home">{children}</div>;
}
