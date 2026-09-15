'use client';
import { useEffect, useRef, useState } from 'react';

const nodes=[
{key:'n8n',label:'n8n',role:'Trigger & automate',x:14,y:24,depth:1.15},
{key:'langgraph',label:'LangGraph',role:'State & reasoning',x:50,y:48,depth:.7},
{key:'crewai',label:'CrewAI',role:'Agent collaboration',x:78,y:22,depth:1.35},
{key:'tools',label:'Tools',role:'Act in the world',x:80,y:72,depth:.9},
{key:'rag',label:'RAG',role:'Grounded context',x:23,y:76,depth:1.25}];

export default function AgentWorkflow(){
 const sectionRef=useRef(null);const [progress,setProgress]=useState(0);
 useEffect(()=>{const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduce){setProgress(1);return}let frame=0;const update=()=>{frame=0;const el=sectionRef.current;if(!el)return;const rect=el.getBoundingClientRect();const travel=el.offsetHeight-window.innerHeight;setProgress(Math.max(0,Math.min(1,-rect.top/Math.max(travel,1))))};const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update)};update();window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);return()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);if(frame)cancelAnimationFrame(frame)}},[]);
 const activeCount=Math.min(nodes.length,Math.floor(progress*(nodes.length+1)));
 return <section className="workflow-scroll" ref={sectionRef} aria-labelledby="workflow-title"><div className="workflow-sticky"><div className="workflow-copy"><p>My orchestration stack</p><h2 id="workflow-title">Ideas enter.<br/><em>Agents get to work.</em></h2><p className="workflow-lede">I connect triggers, memory, reasoning and tools into one observable system. Scroll to run the workflow.</p><div className="workflow-progress"><span style={{width:`${progress*100}%`}}/></div><small>{String(activeCount).padStart(2,'0')} / 05 nodes active</small></div><div className="workflow-stage" style={{'--flow':progress}}><svg className="workflow-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M14 24 C30 20 34 45 50 48 S68 28 78 22" style={{'--draw':Math.min(1,progress*2)}}/><path pathLength="1" d="M50 48 C66 50 70 68 80 72" style={{'--draw':Math.max(0,Math.min(1,progress*2-.45))}}/><path pathLength="1" d="M23 76 C31 62 38 55 50 48" style={{'--draw':Math.max(0,Math.min(1,progress*2-.8))}}/></svg>{nodes.map((node,index)=>{const active=index<activeCount;const shift=(progress-.5)*34*node.depth;return <div key={node.key} className={`workflow-node node-${node.key}${active?' active':''}`} style={{left:`${node.x}%`,top:`${node.y}%`,transform:`translate(-50%,calc(-50% + ${shift}px))`}}><span className="node-light"/><strong>{node.label}</strong><small>{node.role}</small>{active&&<i>OK</i>}</div>})}<div className="stage-caption"><span>Live orchestration</span><b>{progress>.82?'Complete':progress>.08?'Running':'Waiting'}</b></div></div></div></section>
}
