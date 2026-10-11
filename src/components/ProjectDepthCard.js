'use client';

import { useEffect, useRef, useState } from 'react';
import { createSystemRenderer } from './system-renderer';
import { cardLayouts, createCardArtwork, projectColors } from './project-card-artwork';
import styles from './ProjectDepthCard.module.css';

function RenderedPreview({ project, rendererRef }) {
  const ref=useRef(null);
  const [ready,setReady]=useState(false);
  const [contextVersion,setContextVersion]=useState(0);
  useEffect(()=>{
    const canvas=ref.current;
    const renderer=createSystemRenderer(canvas,project,{artwork:createCardArtwork,layouts:cardLayouts,grid:false,distance:6.9,fit:10,shadowStrength:.14});
    if(!renderer)return;
    rendererRef.current=renderer;
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const motion=()=>renderer.setReduced(media.matches);
    const visibility=()=>renderer.setVisible(!document.hidden);
    const resize=new ResizeObserver(([entry])=>renderer.resize(entry.contentRect.width,entry.contentRect.height));
    const lost=event=>{event.preventDefault();renderer.setVisible(false);setReady(false);};
    const restored=()=>{setReady(false);setContextVersion(value=>value+1);};
    resize.observe(canvas);motion();visibility();setReady(true);
    media.addEventListener('change',motion);document.addEventListener('visibilitychange',visibility);
    canvas.addEventListener('webglcontextlost',lost);canvas.addEventListener('webglcontextrestored',restored);
    return ()=>{
      resize.disconnect();media.removeEventListener('change',motion);document.removeEventListener('visibilitychange',visibility);
      canvas.removeEventListener('webglcontextlost',lost);canvas.removeEventListener('webglcontextrestored',restored);
      renderer.destroy();if(rendererRef.current===renderer)rendererRef.current=null;
      // A removed preview releases its context as well as its textures, keeping the collection light.
      if (!canvas.isConnected) canvas.getContext('webgl')?.getExtension('WEBGL_lose_context')?.loseContext();
    };
  },[project,rendererRef,contextVersion]);
  return <><canvas key={contextVersion} ref={ref} data-project-rendered={ready} aria-hidden="true"/>{!ready&&<div className={styles.previewFallback}><span>{project.icon}</span><i>→</i><span>{project.flow[project.flow.length-1]}</span></div>}</>;
}

export default function ProjectDepthCard({project,index,total,onOpen}) {
  const shellRef=useRef(null),cardRef=useRef(null),rendererRef=useRef(null),frameRef=useRef(0),motionRef=useRef(null),previousRef=useRef({x:0,y:0});
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    const shell=shellRef.current,view=shell.closest('[data-portfolio-view]');let intersects=false;
    motionRef.current=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setVisible(intersects&&!view?.hidden&&view?.parentElement?.dataset.activeView==='work');
    const observer=new IntersectionObserver(([entry])=>{intersects=entry.isIntersecting;update();},{root:view,rootMargin:'60px 0px'});
    observer.observe(shell);window.addEventListener('portfolio:viewchange',update);
    return ()=>{observer.disconnect();window.removeEventListener('portfolio:viewchange',update);cancelAnimationFrame(frameRef.current);};
  },[]);
  function reset(){cancelAnimationFrame(frameRef.current);frameRef.current=0;previousRef.current={x:0,y:0};cardRef.current?.style.setProperty('--card-x','0deg');cardRef.current?.style.setProperty('--card-y','0deg');cardRef.current?.style.setProperty('--shine-x','50%');cardRef.current?.style.setProperty('--shine-y','0%');rendererRef.current?.setStage(0);}
  function move(event){
    if(event.pointerType!=='mouse'||motionRef.current?.matches)return;
    const bounds=shellRef.current.getBoundingClientRect(),x=(event.clientX-bounds.left)/bounds.width-.5,y=(event.clientY-bounds.top)/bounds.height-.5;
    cancelAnimationFrame(frameRef.current);
    frameRef.current=requestAnimationFrame(()=>{cardRef.current.style.setProperty('--card-x',`${-y*5}deg`);cardRef.current.style.setProperty('--card-y',`${x*6}deg`);cardRef.current.style.setProperty('--shine-x',`${(x+.5)*100}%`);cardRef.current.style.setProperty('--shine-y',`${(y+.5)*100}%`);rendererRef.current?.rotate((x-previousRef.current.x)*.24,(y-previousRef.current.y)*.10);previousRef.current={x,y};frameRef.current=0;});
  }
  return <div className={styles.shell} ref={shellRef} data-depth-reveal onPointerMove={move} onPointerLeave={reset} style={{'--project-accent':projectColors[project.icon]||'#9586cb'}}>
    <article className={`work-card project-depth-card ${styles.card}`} id={project.id} ref={cardRef}>
      <div className={styles.preview} data-project-preview={project.id}><div className={styles.previewLabel}><span>{project.domain}</span><span>{String(index+1).padStart(2,'0')} / {total}</span></div>{visible?<RenderedPreview project={project} rendererRef={rendererRef}/>:<div className={styles.previewFallback}><span>{project.icon}</span><i>→</i><span>{project.flow[project.flow.length-1]}</span></div>}</div>
      <div className={styles.body}>
        <div className="work-card-labels"><p>{project.type}</p>{project.status&&<span className="work-status">{project.status}</span>}</div>
        <h3>{project.title}</h3><p className="work-card-description">{project.description}</p>
        {project.client&&<p className="work-client-note">Direct client collaboration</p>}
        <p className="work-card-tools" aria-label="Tools used">{project.stack.join(' · ')}</p>
        <button type="button" className="project-detail-button" aria-haspopup="dialog" aria-label={`Project details: ${project.title}`} onClick={()=>{reset();onOpen(project);}}>Project details <span aria-hidden="true">↗</span></button>
      </div>
    </article>
  </div>;
}
