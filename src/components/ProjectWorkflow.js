'use client';

import { AnimatePresence, LayoutGroup, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cameraAt, createWorkflow, edgeProgress, executionAt, INTRO_LENGTH, pointOnEdge } from './project-camera.mjs';
import styles from './ProjectWorkflow.module.css';

const colors = ['#ef799c', '#a79aff', '#72cdbb', '#78b7e8', '#d7a6e7', '#f2b86a', '#aa9bec', '#6fc9cb', '#8aca9d', '#e0ac75'];

function Icon({ name, ...props }) {
  const paths = {
    RE: <><path d="m4 11 8-7 8 7v9H4Z"/><path d="M9 20v-7h6v7M9 8h6"/></>,
    TS: <><path d="M4 18v-5m5 5V9m5 9V5m5 13V2M3 22h19"/></>,
    DC: <><path d="M20 11.5a8 8 0 0 1-8 8H5l-3 3v-11a9 9 0 0 1 18 0Z"/><path d="M7 11h8m-4-4v8"/></>,
    AV: <><rect x="2" y="5" width="20" height="15" rx="3"/><path d="m3 7 9 7 9-7"/></>,
    VB: <><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/></>,
    LI: <><path d="M13 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8M9 15l1-5L19 1l4 4-9 9Z"/></>,
    RA: <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/></>,
    FL: <><rect x="2" y="3" width="20" height="18" rx="3"/><path d="M2 9h20M9 9v12m4-8h5m-5 4h3"/></>,
    BP: <><path d="m1 20 8-14 5 8 3-5 6 11ZM6 11l3 2 3-2"/><circle cx="18" cy="4" r="2"/></>,
    CV: <><path d="M3 7V3h4m10 0h4v4M3 17v4h4m10 0h4v-4M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2"/></>,
    bolt: <path d="m14 2-9 12h6l-1 8 9-12h-6Z"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
    close: <path d="m6 6 12 12M6 18 18 6"/>,
    map: <><rect x="2" y="8" width="5" height="7" rx="1"/><rect x="17" y="3" width="5" height="7" rx="1"/><rect x="17" y="16" width="5" height="6" rx="1"/><path d="M7 11h5V6h5m-5 5v8h5"/></>,
    tool: <><path d="M8 5 3 12l5 7m8-14 5 7-5 7m-3-17-2 20"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.tool}</svg>;
}

function ProjectDetail({ project, onClose, mobile, reduced, returnFocus }) {
  const panelRef = useRef(null), closeRef = useRef(null), titleId = useId();
  useEffect(() => {
    const scrollY = window.scrollY, root = document.documentElement;
    const oldOverflow = root.style.overflow, oldBodyOverflow = document.body.style.overflow;
    const app = document.querySelector('.app-container'), oldInert = app?.inert;
    if (app) app.inert = true;
    root.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key !== 'Tab') return;
      const elements = [...panelRef.current.querySelectorAll('button:not([disabled]), a[href], [tabindex="0"]')];
      const first = elements[0], last = elements.at(-1);
      if (event.shiftKey && (document.activeElement === first || !panelRef.current.contains(document.activeElement))) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !panelRef.current.contains(document.activeElement))) {
        event.preventDefault(); first?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (app) app.inert = oldInert;
      root.style.overflow = oldOverflow;
      document.body.style.overflow = oldBodyOverflow;
      window.scrollTo({ top: scrollY, behavior: 'instant' });
      returnFocus?.focus({ preventScroll: true });
    };
  }, [onClose, returnFocus]);
  const morph = !mobile && !reduced;
  return <motion.div className={styles.takeover} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.2 }}>
    <div className={styles.backdrop} onClick={onClose} />
    <motion.article ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className={styles.editor}
      layoutId={morph ? `project-node-${project.id}` : undefined} layoutScroll
      style={{ '--project-accent': project.color, borderRadius: mobile ? '20px 20px 0 0' : 22 }}
      initial={morph ? false : { y: reduced ? 0 : 60 }} animate={{ y: 0 }} exit={morph ? undefined : { y: reduced ? 0 : 60 }}
      transition={{ duration: reduced ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}>
      <header className={styles.editorHeader}>
        <span className={styles.editorIcon}><Icon name={project.icon} /></span>
        <div><small>{project.type}</small><h2 id={titleId}>{project.title}</h2></div>
        <span className={styles.editorTag}>Project details</span>
        <button ref={closeRef} className={styles.close} onClick={onClose} aria-label="Close project details"><Icon name="close" /></button>
      </header>
      <div className={styles.editorBody}>
        <section className={styles.overviewCopy}><p className={styles.eyebrow}>The project</p><h3>{project.headline || project.summary || project.title}</h3><p>{project.description || project.summary}</p>
          <div className={styles.facts}>{[['Role', project.role], ['Domain', project.domain]].filter(([, value]) => value).map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
          {!!project.links?.length && <div className={styles.projectLinks}>{project.links.map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}<Icon name="arrow" /></a>)}</div>}
        </section>
        <aside className={styles.stack}><p className={styles.eyebrow}>Built with</p><div>{project.stack?.map(tool => <span key={tool}>{tool}</span>)}</div>{project.outcome && <><p className={styles.eyebrow}>The outcome</p><p>{project.outcome}</p></>}</aside>
        {!!project.flow?.length && <section className={styles.architecture}><p className={styles.eyebrow}>How it works</p><ol>{project.flow.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong>{index < project.flow.length - 1 && <Icon name="arrow" />}</li>)}</ol></section>}
        {/* eslint-disable-next-line @next/next/no-img-element -- Optional screenshots have no guaranteed intrinsic dimensions. */}
        {!!project.images?.length && <section className={styles.screenshots}>{project.images.map(img => <figure key={img.src}><img src={img.src} alt={img.alt || project.title} />{img.caption && <figcaption>{img.caption}</figcaption>}</figure>)}</section>}
      </div>
    </motion.article>
  </motion.div>;
}

function Connection({ edge, index, count, progress, markerId }) {
  const draw = useTransform(progress, value => edgeProgress(value, index, count));
  const offset = useTransform(draw, value => 1 - value);
  const cx = useTransform(draw, value => pointOnEdge(edge, value).x), cy = useTransform(draw, value => pointOnEdge(edge, value).y);
  const pulseOpacity = useTransform(draw, value => value > 0 && value < 1 ? 1 : 0);
  const labelOpacity = useTransform(draw, value => value > 0.98 ? 1 : 0);
  const center = pointOnEdge(edge, 0.5);
  return <g>
    <path className={styles.wireBase} d={edge.d} markerEnd={`url(#${markerId})`} />
    <motion.path className={styles.wireLive} d={edge.d} pathLength="1" strokeDasharray="1" style={{ strokeDashoffset: offset }} />
    <motion.circle className={styles.packetHalo} r="11" style={{ cx, cy, opacity: pulseOpacity }} />
    <motion.circle className={styles.packet} r="4" style={{ cx, cy, opacity: pulseOpacity }} />
    <motion.text className={styles.wireLabel} x={center.x} y={center.y - 16} textAnchor="middle" style={{ opacity: labelOpacity }}>1 project</motion.text>
  </g>;
}

function WorkflowNode({ project, index, state, onOpen, reduced, mobile }) {
  const done = !state.overview && (index < state.index || (index === state.index && state.completed));
  const running = !state.overview && index === state.index && !state.completed;
  const focused = !state.overview && index === state.index;
  const tools = (project.stack || []).slice(0, 3);
  return <div className={`${styles.nodePosition} ${done ? styles.done : ''} ${running ? styles.running : ''} ${focused ? styles.focused : ''}`}
    style={{ left: project.x, top: project.y, '--project-accent': project.color }} data-project={project.id} data-state={done ? 'completed' : running ? 'running' : 'waiting'}>
    <span className={styles.nodeNumber}>{String(index + 1).padStart(2, '0')}</span>
    {index === 0 && <span className={styles.triggerBolt}><Icon name="bolt" /></span>}
    <motion.button className={`${styles.node} ${index === 0 ? styles.triggerNode : ''}`} type="button"
      layoutId={!mobile && !reduced ? `project-node-${project.id}` : undefined}
      style={{ borderRadius: index === 0 ? '46px 14px 14px 46px' : 14 }}
      onClick={event => onOpen(project, event.currentTarget)} tabIndex={state.overview || focused ? 0 : -1}
      aria-label={`Open ${project.title} project`}>
      <span className={`${styles.port} ${styles.input}`} /><Icon name={project.icon} />
      <span className={`${styles.port} ${styles.output}`} />
      {done && <span className={styles.check}><Icon name="check" /></span>}
      {running && <span className={styles.spinner} />}
    </motion.button>
    <div className={styles.nodeLabel}><h3>{project.title}</h3><p>{project.type}</p></div>
    <div className={styles.tools} aria-hidden="true">
      <svg viewBox="0 0 360 130" className={styles.toolWires}>{tools.map((tool, i) => <path key={tool} d={`M180 0 C180 64 ${60 + i * 120} 54 ${60 + i * 120} 130`} />)}</svg>
      <div className={styles.toolRow}>{tools.map((tool, i) => <div key={tool}><span><Icon name={i === 0 ? 'map' : i === 1 ? 'RA' : 'tool'} /></span><small>{tool}</small></div>)}</div>
    </div>
  </div>;
}

export default function ProjectWorkflow({ projects = [] }) {
  const sectionRef = useRef(null), viewportRef = useRef(null), returnFocus = useRef(null);
  const reduced = useReducedMotion();
  const [viewport, setViewport] = useState({ width: 1180, height: 650 });
  const [selected, setSelected] = useState(null), [manualIndex, setManualIndex] = useState(0);
  const graph = useMemo(() => createWorkflow(projects.map((project, index) => ({ ...project, color: project.color || colors[index % colors.length] }))), [projects]);
  const count = graph.nodes.length;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 96px', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 170, damping: 32, mass: 0.5 });
  const [state, setState] = useState(() => executionAt(0, count));
  const selectedRef = useRef(null), stateKey = useRef('');
  selectedRef.current = selected;
  useMotionValueEvent(progress, 'change', value => {
    if (selectedRef.current) return;
    const next = executionAt(value, count);
    const key = `${next.index}-${next.overview}-${next.completed}-${next.traveling}`;
    if (key !== stateKey.current) { stateKey.current = key; setState(next); }
  });
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setViewport({ width: entry.contentRect.width, height: entry.contentRect.height }));
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, []);
  const camera = useTransform(progress, value => {
    const { x, y, scale } = cameraAt(value, graph, viewport);
    return `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  });
  const dotSize = useTransform(progress, value => `${24 * cameraAt(value, graph, viewport).scale}px`);
  const dotPosition = useTransform(progress, value => { const view = cameraAt(value, graph, viewport); return `${view.x}px ${view.y}px`; });
  const reducedState = { index: manualIndex, phase: 0.5, overview: false, completed: true, traveling: false };
  const viewState = reduced ? reducedState : state, active = graph.nodes[viewState.index];
  const mobile = viewport.width < 700, markerId = `arrow-${useId().replace(/:/g, '')}`;
  const close = useCallback(() => setSelected(null), []);
  const open = (project, trigger) => { returnFocus.current = trigger; setSelected(project); };
  const goTo = (index) => {
    if (reduced) { setManualIndex(Math.max(0, Math.min(count - 1, index))); return; }
    const targetProgress = index < 0 ? 0 : (INTRO_LENGTH + index + 0.12) / (count + INTRO_LENGTH);
    const start = sectionRef.current.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: start + targetProgress * (sectionRef.current.offsetHeight - window.innerHeight + 96), behavior: 'smooth' });
  };
  if (!count) return null;
  const reducedCamera = cameraAt((INTRO_LENGTH + manualIndex + 0.4) / (count + INTRO_LENGTH), graph, viewport);
  return <LayoutGroup id={markerId}>
    <section ref={sectionRef} className={`${styles.journey} ${reduced ? styles.reduced : ''}`} style={{ '--journey-height': `${(count * 0.95 + 1.9) * 100}svh` }} aria-label="Connected project workflow">
      <div className={styles.sticky}><div className={styles.shell}>
        <header className={styles.toolbar}><div className={styles.workflowName}><Icon name="map" /><span>Selected work <b>/</b> <strong>Project workflow</strong></span></div>
          <div className={styles.toolbarRight}><span className={styles.projectCount}>{count} connected projects</span><button type="button" onClick={() => goTo(-1)} aria-label="Show workflow overview"><Icon name="map" /><span>Overview</span></button></div>
        </header>
        <div ref={viewportRef} className={styles.viewport} tabIndex={0} role="region" aria-label="Scroll to zoom into the workflow. Use left and right arrows to move between projects."
          onKeyDown={event => { if (event.target !== event.currentTarget) return; if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); goTo(event.key === 'ArrowRight' ? (viewState.overview ? 0 : Math.min(count - 1, viewState.index + 1)) : viewState.index - 1); } }}>
          <motion.div className={styles.dotGrid} style={reduced ? undefined : { backgroundSize: dotSize, backgroundPosition: dotPosition }} />
          <div className={styles.canvasHeading}><span className={styles.eyebrow}>{viewState.overview ? 'The whole picture' : `Project ${String(viewState.index + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`}</span>
            <span className={`${styles.runState} ${viewState.completed || viewState.traveling ? styles.success : ''}`}><i />{viewState.overview ? 'Ready to explore' : viewState.traveling ? 'Moving to next node' : viewState.completed ? 'Execution complete' : 'Executing node'}</span></div>
          <motion.div className={styles.world} style={{ width: graph.width, height: graph.height, transform: reduced ? `translate3d(${reducedCamera.x}px, ${reducedCamera.y}px, 0) scale(${reducedCamera.scale})` : camera }}>
            <svg className={styles.connections} width={graph.width} height={graph.height} viewBox={`0 0 ${graph.width} ${graph.height}`} aria-hidden="true">
              <defs><marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="m1 1 8 4-8 4Z" fill="#626977" /></marker></defs>
              {graph.edges.map((edge, index) => <Connection key={edge.id} edge={edge} index={index} count={count} progress={progress} markerId={markerId} />)}
            </svg>
            {graph.nodes.map((project, index) => <WorkflowNode key={project.id} project={project} index={index} state={viewState} onOpen={open} reduced={reduced} mobile={mobile} />)}
          </motion.div>
          <div className={styles.canvasFooter}>
            <div className={styles.caption} aria-live="polite" aria-atomic="true"><span>{viewState.overview ? 'A connected body of work.' : active.headline || active.summary}</span><p>{viewState.overview ? 'Scroll to zoom in. Follow the connections.' : 'Select the node to explore the project.'}</p></div>
            <div className={styles.controls}><button aria-label="Previous project" disabled={viewState.overview || (reduced && viewState.index === 0)} onClick={() => goTo(viewState.index - 1)}><Icon name="arrow" className={styles.previous} /></button><span>{viewState.overview ? '00' : String(viewState.index + 1).padStart(2, '0')}<b> / {String(count).padStart(2, '0')}</b></span><button aria-label={viewState.overview ? 'Explore first project' : 'Next project'} disabled={!viewState.overview && viewState.index === count - 1} onClick={() => goTo(viewState.overview ? 0 : viewState.index + 1)}><Icon name="arrow" /></button></div>
          </div>
          <nav className={styles.progressRail} aria-label="Jump to project">{graph.nodes.map((project, index) => <button key={project.id} className={!viewState.overview && index <= viewState.index ? styles.visited : ''} onClick={() => goTo(index)} aria-label={`Go to ${project.title}`} aria-current={!viewState.overview && index === viewState.index ? 'step' : undefined}><span /></button>)}</nav>
        </div>
      </div><p className={styles.scrollNote}><span /><span>{reduced ? 'Use the arrows to explore at your own pace' : 'Scroll to follow the workflow'}</span><span /></p></div>
    </section>
    {typeof document !== 'undefined' && createPortal(<AnimatePresence>{selected && <ProjectDetail key={selected.id} project={selected} onClose={close} mobile={mobile} reduced={reduced} returnFocus={returnFocus.current} />}</AnimatePresence>, document.body)}
  </LayoutGroup>;
}
