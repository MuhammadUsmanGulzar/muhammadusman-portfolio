import Image from 'next/image';

function Icon({ name }) {
  const paths = {
    assistant: <><rect x="5" y="7" width="14" height="12" rx="3"/><path d="M12 3v4M2 12h3m14 0h3M9 12h.01M15 12h.01M9 16h6"/></>,
    automation: <><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h6a3 3 0 0 1 3 3v6M6 9v6a3 3 0 0 0 3 3h6"/></>,
    document: <><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M8 12h8M8 16h6"/></>,
    code: <path d="m7 7-5 5 5 5m10-10 5 5-5 5M14 4l-4 16"/>,
    work: <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12a25 25 0 0 0 18 0M12 11v4"/></>,
    house: <><path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8"/></>,
    chart: <><path d="M4 3v18h17M8 16v-4m5 4V8m5 8V5"/></>,
  };
  return <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
const skills = [
  ['assistant', 'AI assistants', 'LangGraph, CrewAI, OpenAI'],
  ['automation', 'Workflow automation', 'n8n, Python, REST APIs'],
  ['document', 'Document search', 'Ollama, FAISS, LangChain'],
  ['code', 'Web development', 'Next.js, React, FastAPI'],
];
const projects = [
  {icon:'chart', title:'Jepsii fuel operations', description:'A dashboard for fuel enquiries, jobs, invoices, balances, and financial reporting.', tools:['Next.js','React','REST APIs'], id:'logistics-dashboard'},
  {icon:'automation', title:'Techmen sales automation', description:'A sales workflow that sorts enquiries, captures lead details, and routes important cases to the team.', tools:['n8n','OpenAI','Google Sheets'], id:'techmen-sales'},
  {icon:'assistant', title:'PostPilot', description:'An AI marketing workspace for creating posts and images, reviewing the output, and choosing where to publish. In development.', tools:['Next.js','Supabase','n8n'], id:'postpilot-autoposting'},
];
const clientWork = [
  ['Jepsii', 'logistics-dashboard'],
  ['Techmen', 'techmen-sales'],
  ['AI Dental Clinic', 'dental-assistant'],
  ['Real Estate Agent', 'real-estate-agent'],
  ['PostPilot', 'postpilot-autoposting'],
  ['Car Wash Voice Agent', 'voice-bot'],
];

function WorkflowSculpture() {
  return <div className="workflow-sculpture" aria-hidden="true">
    <div className="workflow-stack">
      <div className="workflow-layer workflow-layer-back"><span className="workflow-node"/><span className="workflow-connector"/><span className="workflow-node"/></div>
      <div className="workflow-layer workflow-layer-middle"><Icon name="automation"/><span className="workflow-lines"><i/><i/></span></div>
      <div className="workflow-layer workflow-layer-front"><span className="workflow-check"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m5 12 4 4L19 6"/></svg></span><span className="workflow-lines"><i/><i/></span></div>
    </div>
  </div>;
}

export default function HomeSection() {
  return <div className="dashboard container">
    <div className="dashboard-overview">
      <section className="dashboard-panel profile-panel" aria-labelledby="intro-title">
        <div className="profile-summary"><Image src="/muhammad-usman-portrait.jpeg" alt="Muhammad Usman" width="128" height="144"/><p className="profile-name">Muhammad Usman</p><p className="small-copy">Karachi, Pakistan</p></div>
        <div className="profile-intro"><p className="eyebrow">Client-facing development</p><h1 id="intro-title">AI & automation engineer</h1><p>I work directly with clients to build AI assistants, business automations, and web applications.</p><a className="primary-action" href="#contact">Get in touch <span aria-hidden="true">→</span></a></div>
      </section>
      <section className="dashboard-panel skills-panel" aria-labelledby="skills-title"><h2 id="skills-title">Skills</h2><ul className="dashboard-skills">{skills.map(([icon,title,tools])=><li key={title}><span className="icon-disc"><Icon name={icon}/></span><div><h3>{title}</h3><p>{tools}</p></div></li>)}</ul></section>
      <section className="dashboard-panel role-panel" aria-labelledby="role-title"><h2 id="role-title">Current role</h2><span className="icon-disc role-icon"><Icon name="work"/></span><h3>AI Engineer</h3><p className="role-company">Azm Al Safwa · Contract</p><p className="role-description">Building a company website, document assistant, and business dashboards.</p><p className="small-copy">Remote · Saudi Arabia</p><p className="small-copy">August 2026 – present</p><a href="#experience" className="text-link">View experience <span aria-hidden="true">→</span></a></section>
    </div>
    <section className="client-work-panel" aria-labelledby="client-work-title">
      <div className="client-work-copy">
        <p className="client-work-eyebrow">Direct client collaboration</p>
        <h2 id="client-work-title">Practical tools for real business needs.</h2>
        <p>I work with clients across aviation, sales, healthcare, real estate, marketing, and local services.</p>
        <ul className="client-work-links">{clientWork.map(([name, id]) => <li key={id}><a href={`#${id}`}>{name}<span aria-hidden="true"> ↗</span></a></li>)}</ul>
      </div>
      <WorkflowSculpture/>
    </section>
    <section className="dashboard-panel featured-panel" aria-labelledby="featured-title"><div className="section-heading"><h2 id="featured-title">Featured work</h2><a href="#work">All projects <span aria-hidden="true">→</span></a></div><div className="dashboard-projects">{projects.map(project=><article className="dashboard-project" key={project.id}><div className="project-card-heading"><span className="icon-disc"><Icon name={project.icon}/></span><h3>{project.title}</h3></div><p>{project.description}</p><div className="project-tools">{project.tools.map(tool=><span key={tool}>{tool}</span>)}</div><a className="text-link" href={`#${project.id}`} aria-label={`View project: ${project.title}`}>View project <span aria-hidden="true">→</span></a></article>)}</div></section>
  </div>;
}


