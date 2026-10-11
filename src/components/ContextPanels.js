'use client';

import { useState } from 'react';
import styles from './ContextPanels.module.css';

export function ExperienceSnapshot() {
  return <aside className={`${styles.panel} ${styles.experience}`} aria-label="Experience at a glance" data-depth-reveal>
    <div className={styles.panelHeading}><span>Experience at a glance</span><span className={styles.smallMark}>MU / 02</span></div>
    <div className={styles.currentRole}><span className={styles.statusDot}/>Current role<span>Aug 2026 — present</span></div>
    <h3>AI Engineer</h3><p className={styles.company}>Azm Al Safwa <span>Contract · Remote</span></p>
    <div className={styles.focusList}><span>Company website</span><span>Document AI</span><span>Business dashboards</span></div>
    <div className={styles.experienceRows}><a href="#career-path"><span>Client delivery</span><strong>Jepsii & freelance projects</strong><span aria-hidden="true">↗</span></a><a href="#certifications"><span>Continued learning</span><strong>3 professional certifications</strong><span aria-hidden="true">↗</span></a><a href="#education"><span>Education</span><strong>B.S. Artificial Intelligence</strong><span aria-hidden="true">↗</span></a></div>
    <p className={styles.footnote}>Direct conversations. Hands-on development. Client handoff.</p>
  </aside>;
}

const steps = [
  {title:'Understand',label:'Start with the problem.',copy:'Talk with the client, map the current workflow, and agree on what the software needs to do.',items:['Business context','People & workflow','Clear requirements']},
  {title:'Build',label:'Connect the right pieces.',copy:'Bring together models, tools, data, and an interface that fits the work.',items:['Models & agents','Tools & APIs','Data & interface']},
  {title:'Deliver',label:'Make it useful in practice.',copy:'Test the system, deploy it, monitor how it behaves, and prepare a clear client handoff.',items:['Test & validate','Deploy & monitor','Client handoff']},
];
export function AboutProcess() {
  const [selected,setSelected]=useState(0);
  const step=steps[selected];
  return <aside className={`${styles.panel} ${styles.about}`} aria-label="My development process" data-depth-reveal>
    <div className={styles.panelHeading}><span>How I work</span><span className={styles.smallMark}>FROM BRIEF TO BUILD</span></div>
    <div className={styles.processTrack} role="group" aria-label="Explore my process">{steps.map((item,index)=><button type="button" key={item.title} aria-pressed={selected===index} onClick={()=>setSelected(index)}><span>{String(index+1).padStart(2,'0')}</span>{item.title}</button>)}</div>
    <div className={styles.processDetail} key={selected} aria-live="polite" aria-atomic="true"><p className={styles.processLabel}>0{selected+1} / {step.title}</p><h3>{step.label}</h3><p>{step.copy}</p><div className={styles.processNodes}>{step.items.map((item,index)=><span key={item}><i aria-hidden="true">{index+1}</i>{item}</span>)}</div></div>
    <div className={styles.clientLoop}><span aria-hidden="true">↳</span>The client stays part of the conversation.<span aria-hidden="true">↵</span></div>
  </aside>;
}

export function ContactGuide() {
  return <aside className={`${styles.panel} ${styles.contact}`} aria-label="What to include in your project brief" data-depth-reveal>
    <div className={styles.panelHeading}><span>A good place to start</span><svg width="30" height="25" viewBox="0 0 30 25" fill="none" aria-hidden="true"><rect x="2" y="4" width="26" height="18" rx="3" stroke="currentColor"/><path d="m3 6 12 9L27 6M3 21l8-8m16 8-8-8" stroke="currentColor"/></svg></div>
    <h3>A few details are enough.</h3><p className={styles.guideIntro}>You don’t need a finished specification. Start with the problem you want to solve.</p>
    <ol className={styles.briefList}><li><span>01</span><div><h4>What would you like to build?</h4><p>An AI assistant, an automation, a dashboard, or something else.</p></div></li><li><span>02</span><div><h4>What does the work look like today?</h4><p>The people, tools, and steps already involved.</p></div></li><li><span>03</span><div><h4>What would a useful result look like?</h4><p>The change you want this project to make.</p></div></li></ol>
    <p className={styles.footnote}>Project enquiries and work opportunities are both welcome.</p>
  </aside>;
}
