import Link from 'next/link';

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
  {icon:'house', title:'Real estate assistant', description:'Handles property enquiries, finds listings, and books viewings through voice and WhatsApp.', tools:['n8n','OpenAI','Vapi'], id:'real-estate-agent'},
  {icon:'automation', title:'PostPilot marketing system', description:'Agentic social media marketing workspace that creates posts and images, shows the output, and lets users choose where to publish.', tools:['Next.js','Supabase','n8n'], id:'postpilot-autoposting'},
  {icon:'chart', title:'Jepsii fuel operations dashboard', description:'Built for Jepsii to manage fuel inquiries, jobs, invoices, ledgers, vendor and client balances, and financial reporting.', tools:['Next.js','React','REST APIs'], id:'logistics-dashboard'},
];
export default function Home() {
  return <div className="dashboard container">
    <div className="dashboard-overview">
      <section className="dashboard-panel profile-panel" aria-labelledby="intro-title">
        <div className="profile-summary"><img src="/muhammad-usman-portrait.jpeg" alt="Muhammad Usman" width="128" height="144"/><p className="profile-name">Muhammad Usman</p><p className="small-copy">Karachi, Pakistan</p></div>
        <div className="profile-intro"><p className="eyebrow">Hi, I’m Muhammad Usman</p><h1 id="intro-title">AI & automation developer</h1><p>I build AI assistants, automate routine work, and create useful websites and dashboards.</p><Link className="primary-action" href="/contact">Get in touch <span aria-hidden="true">→</span></Link></div>
      </section>
      <section className="dashboard-panel skills-panel" aria-labelledby="skills-title"><h2 id="skills-title">Skills</h2><ul className="dashboard-skills">{skills.map(([icon,title,tools])=><li key={title}><span className="icon-disc"><Icon name={icon}/></span><div><h3>{title}</h3><p>{tools}</p></div></li>)}</ul></section>
      <section className="dashboard-panel role-panel" aria-labelledby="role-title"><h2 id="role-title">Current role</h2><span className="icon-disc role-icon"><Icon name="work"/></span><h3>AI Engineer</h3><p className="role-company">Azm Al Safwa · Contract</p><p className="role-description">Building a company website, document assistant, and business dashboards.</p><p className="small-copy">Remote · Saudi Arabia</p><p className="small-copy">August 2026 – present</p><Link href="/resume" className="text-link">View experience <span aria-hidden="true">→</span></Link></section>
    </div>
    <section className="dashboard-panel featured-panel" aria-labelledby="featured-title"><div className="section-heading"><h2 id="featured-title">Featured work</h2><Link href="/portfolio">All projects <span aria-hidden="true">→</span></Link></div><div className="dashboard-projects">{projects.map(project=><article className="dashboard-project" key={project.id}><div className="project-card-heading"><span className="icon-disc"><Icon name={project.icon}/></span><h3>{project.title}</h3></div><p>{project.description}</p><div className="project-tools">{project.tools.map(tool=><span key={tool}>{tool}</span>)}</div><Link className="text-link" href={`/portfolio#${project.id}`} aria-label={`View project: ${project.title}`}>View project <span aria-hidden="true">→</span></Link></article>)}</div></section>
  </div>;
}


