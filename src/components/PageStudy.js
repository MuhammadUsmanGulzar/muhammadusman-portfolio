'use client';

import { useEffect, useRef, useState } from 'react';
import { createSystemRenderer } from './system-renderer';
import { createPageArtwork, pageStudies, studyLayouts } from './page-artwork';
import styles from './PageStudy.module.css';

export default function PageStudy({ theme }) {
  const study = pageStudies[theme];
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);
  const canvasRef = useRef(null), rendererRef = useRef(null), pointerRef = useRef(null), stageRef = useRef(0);
  stageRef.current = stage;

  useEffect(() => {
    const canvas = canvasRef.current;
    const view = canvas.closest('[data-portfolio-view]');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let intersects = false, lost = false, releaseTimer;
    const isActive = () => !view?.hidden && view?.parentElement?.dataset.activeView === view?.id;
    function release() { rendererRef.current?.destroy(); rendererRef.current = null; setReady(false); }
    function update() {
      if (!isActive()) {
        rendererRef.current?.setVisible(false);
        clearTimeout(releaseTimer);
        // Preserve the outgoing scene until the view camera transition has finished.
        releaseTimer = setTimeout(() => { if (!isActive()) release(); }, 720);
        return;
      }
      clearTimeout(releaseTimer);
      if (intersects && !document.hidden && !lost && !rendererRef.current) {
        const renderer = createSystemRenderer(canvas, study, { artwork: createPageArtwork, layouts: studyLayouts(theme), lightFrames: study.light, grid: !study.light, distance: 7.6, fit: 11.5, shadowStrength: study.light ? .15 : .21 });
        if (renderer) {
          rendererRef.current = renderer;
          renderer.setReduced(preference.matches);
          renderer.setStage(stageRef.current);
          const bounds = canvas.getBoundingClientRect(); renderer.resize(bounds.width, bounds.height);
          setReady(true);
        }
      }
      rendererRef.current?.setVisible(intersects && !document.hidden && !view?.hidden);
    }
    const observer = new IntersectionObserver(([entry]) => { intersects = entry.isIntersecting; update(); });
    const resize = new ResizeObserver(([entry]) => rendererRef.current?.resize(entry.contentRect.width, entry.contentRect.height));
    const motion = () => rendererRef.current?.setReduced(preference.matches);
    const contextLost = event => { event.preventDefault(); lost = true; release(); };
    const restored = () => { lost = false; update(); };
    observer.observe(canvas); resize.observe(canvas);
    preference.addEventListener('change', motion);
    document.addEventListener('visibilitychange', update);
    window.addEventListener('portfolio:viewchange', update);
    canvas.addEventListener('webglcontextlost', contextLost);
    canvas.addEventListener('webglcontextrestored', restored);
    return () => {
      clearTimeout(releaseTimer); observer.disconnect(); resize.disconnect(); rendererRef.current?.destroy(); rendererRef.current = null;
      preference.removeEventListener('change', motion); document.removeEventListener('visibilitychange', update);
      window.removeEventListener('portfolio:viewchange', update);
      canvas.removeEventListener('webglcontextlost', contextLost); canvas.removeEventListener('webglcontextrestored', restored);
    };
  }, [theme, study]);

  function select(index) { setStage(index); rendererRef.current?.setStage(index); }
  function pointerDown(event) { if (!ready || event.button !== 0) return; pointerRef.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); }
  function pointerMove(event) {
    const previous = pointerRef.current;
    if (!previous) return;
    rendererRef.current?.rotate((event.clientX-previous.x)*.003, event.pointerType==='touch'?0:(event.clientY-previous.y)*.002);
    pointerRef.current={x:event.clientX,y:event.clientY};
  }
  function keyDown(event) {
    const turns={ArrowLeft:[-.1,0],ArrowRight:[.1,0],ArrowUp:[0,-.06],ArrowDown:[0,.06]};
    if(turns[event.key]){event.preventDefault();rendererRef.current?.rotate(...turns[event.key]);}
    if(event.key==='Home'){event.preventDefault();rendererRef.current?.setStage(stage);}
  }

  return <div className={styles.study} data-study={theme} data-study-ready={ready} style={{'--study-accent':study.accent}}>
    <div className={styles.label}><span>{study.label}</span><span aria-hidden="true">0{stage+1} / 03</span></div>
    <div className={styles.scene}>
      {!ready && <div className={styles.fallback}><span>{study.cards[stage][0]}</span><strong>{study.cards[stage][1]}</strong><p>{study.cards[stage][2]}</p></div>}
      <canvas ref={canvasRef} tabIndex={ready?0:-1} role="img" aria-label={`${study.label}. Drag or use arrow keys to rotate. Home resets the camera.`} onKeyDown={keyDown} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={()=>{pointerRef.current=null;}} onPointerCancel={()=>{pointerRef.current=null;}} onLostPointerCapture={()=>{pointerRef.current=null;}}/>
      <span className={styles.hint}>{ready?'Drag to explore ↔':'Content overview'}</span>
      {ready&&<button className={styles.reset} type="button" onClick={()=>rendererRef.current?.setStage(stage)}>Reset view</button>}
    </div>
    <div className={styles.controls} role="group" aria-label={`${theme} scene views`}>
      {study.tabs.map((label,index)=><button key={label} type="button" aria-pressed={stage===index} onClick={()=>select(index)}><span>0{index+1}</span>{label}</button>)}
    </div>
    <p className={styles.note} aria-live="polite" aria-atomic="true">{study.notes[stage]}</p>
  </div>;
}
