'use client';

import { useEffect, useRef, useState } from 'react';
import { systems } from './system-artwork';
import { createSystemRenderer } from './system-renderer';
import styles from './SystemShowcase.module.css';

const stages = ['Overview', 'Workflow', 'Output'];

export default function SystemShowcase() {
  const [projectIndex, setProjectIndex] = useState(0);
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);
  const [contextVersion, setContextVersion] = useState(0);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const pointerRef = useRef(null);
  const selectedRef = useRef({ projectIndex, stage });
  selectedRef.current = { projectIndex, stage };
  const project = systems[projectIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = createSystemRenderer(canvas, systems[selectedRef.current.projectIndex]);
    if (!renderer) return;
    rendererRef.current = renderer;
    renderer.setStage(selectedRef.current.stage);
    setReady(true);
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => renderer.setReduced(preference.matches);
    updatePreference();
    preference.addEventListener('change', updatePreference);
    let intersects = false;
    const updateVisibility = () => renderer.setVisible(intersects && !document.hidden && !canvas.closest('[hidden]'));
    const intersection = new IntersectionObserver(([entry]) => { intersects = entry.isIntersecting; updateVisibility(); });
    const resize = new ResizeObserver(([entry]) => renderer.resize(entry.contentRect.width, entry.contentRect.height));
    intersection.observe(canvas);
    resize.observe(canvas);
    document.addEventListener('visibilitychange', updateVisibility);
    window.addEventListener('portfolio:viewchange', updateVisibility);
    const lost = event => { event.preventDefault(); renderer.setVisible(false); setReady(false); };
    const restored = () => setContextVersion(value => value + 1);
    canvas.addEventListener('webglcontextlost', lost);
    canvas.addEventListener('webglcontextrestored', restored);
    return () => {
      renderer.destroy(); rendererRef.current = null;
      intersection.disconnect(); resize.disconnect();
      preference.removeEventListener('change', updatePreference);
      document.removeEventListener('visibilitychange', updateVisibility);
      window.removeEventListener('portfolio:viewchange', updateVisibility);
      canvas.removeEventListener('webglcontextlost', lost);
      canvas.removeEventListener('webglcontextrestored', restored);
    };
  }, [contextVersion]);

  useEffect(() => { rendererRef.current?.setProject(project); }, [project]);
  useEffect(() => { rendererRef.current?.setStage(stage); }, [stage]);

  function selectProject(index) { setProjectIndex(index); setStage(0); rendererRef.current?.setStage(0); }
  function pointerDown(event) {
    if (!ready || event.button !== 0) return;
    pointerRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function pointerMove(event) {
    if (!pointerRef.current) return;
    rendererRef.current?.rotate((event.clientX-pointerRef.current.x)*.003, event.pointerType === 'touch' ? 0 : (event.clientY-pointerRef.current.y)*.002);
    pointerRef.current = { x: event.clientX, y: event.clientY };
  }
  function keyDown(event) {
    const directions = { ArrowLeft: [-.1,0], ArrowRight: [.1,0], ArrowUp: [0,-.06], ArrowDown: [0,.06] };
    if (directions[event.key]) { event.preventDefault(); rendererRef.current?.rotate(...directions[event.key]); }
    if (event.key === 'Home') { event.preventDefault(); rendererRef.current?.setStage(stage); }
  }

  return <section id="system-studio" className={styles.showcase} aria-labelledby="systems-title" style={{ '--system-accent': project.accent }}>
    <div className={styles.heading}>
      <div><p className={styles.eyebrow}>Selected systems</p><h2 id="systems-title">A closer look at the work.</h2></div>
      <a href="#work" className={styles.allWork}>All projects <span aria-hidden="true">↗</span></a>
    </div>
    <div className={styles.gallery}>
      <div className={styles.projectNav} role="group" aria-label="Choose a project">
        {systems.map((system, index) => <button type="button" key={system.name} onClick={() => selectProject(index)} aria-pressed={projectIndex === index}>
          <span className={styles.projectNumber}>0{index+1}</span>{system.name}<span className={styles.projectKind}>{system.kind}</span>
        </button>)}
      </div>
      <div className={styles.presentation}>
        <div className={styles.copy}>
          <div className={styles.projectMeta}><span className={styles.accentDot}/>{project.kind}</div>
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
          <span className={styles.status}>{project.status}</span>
          <a className={styles.projectLink} href={`#${project.id}`}>Read the project <span aria-hidden="true">↗</span></a>
          <span className={styles.stack}>{project.stack}</span>
        </div>
        <div className={styles.viewport} data-system-ready={ready}>
          <div className={styles.stageLabel} aria-hidden="true"><span>INTERACTIVE SYSTEM STUDY</span><span>0{stage+1} / 03</span></div>
          {!ready && <div className={styles.fallback}>
            <span>{project.name}</span><h4>From input to outcome</h4>
            <ol>{project.steps.map(step => <li key={step}>{step}</li>)}</ol>
            <p>{project.output}</p>
          </div>}
          <canvas ref={canvasRef} className={styles.canvas} role="img" tabIndex={ready ? 0 : -1}
            aria-label={`3D illustration of ${project.name}: product screen, workflow, and output. Drag or use arrow keys to adjust the camera. Home resets the view.`}
            onKeyDown={keyDown} onPointerDown={pointerDown} onPointerMove={pointerMove}
            onPointerUp={() => { pointerRef.current = null; }} onPointerCancel={() => { pointerRef.current = null; }} onLostPointerCapture={() => { pointerRef.current = null; }}/>
          <div className={styles.sceneFooter}><span>{ready ? 'Drag to explore the depth' : 'System overview'} <span aria-hidden="true">↔</span></span>
            {ready && <button type="button" onClick={() => rendererRef.current?.setStage(stage)}>Reset camera</button>}
          </div>
        </div>
      </div>
      <div className={styles.explore}>
        <div className={styles.stageNav} role="group" aria-label="Explore system layers">
          {stages.map((label, index) => <button key={label} type="button" aria-pressed={stage === index} onClick={() => setStage(index)}><span>0{index+1}</span>{label}</button>)}
        </div>
        <p aria-live="polite" aria-atomic="true">{project.stageCopy[stage]}</p>
      </div>
      <div className={styles.caption}><span>Product → workflow → output</span><span>Illustrative screens · no live client data</span></div>
    </div>
  </section>;
}
