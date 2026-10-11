import { ExperienceSnapshot } from '../ContextPanels';
import PageMotion from '../PageMotion';

const roles = [
  { company:'Azm Al Safwa', role:'Artificial Intelligence Engineer', meta:'Contract · Saudi Arabia · Remote', date:'Aug 2026 — present', tag:'Current role',
    points:['Migrating the company website to Next.js to make it faster and easier to maintain.','Building an AI assistant that answers questions using company documents.','Preparing documents for search and connecting the results to AI-generated answers.','Automating data workflows and building a dashboard to track business metrics.'] },
  { company:'Jepsii', role:'Full-Stack Dashboard Developer', meta:'Aviation fuel operations · Direct client collaboration', date:'2026 · Project',
    points:['Worked directly with Jepsii on its aviation operations projects.','Built a dashboard for fuel enquiries, jobs, invoices, ledgers, banks, payments, fuel tickets, operators, vendors, clients, and fuel prices.','Created views for flight count, fuel uplifts, revenue, gross margin, receivables, payables, invoice activity, and client/vendor balances.','Added filters, PDF export, and charts for revenue, margin, flight activity, and fuel pricing.','Built aviation email automation to classify enquiries, extract details, check missing information, and route cases.'], link:'#logistics-dashboard', linkText:'Explore the Jepsii project' },
  { company:'Freelance', role:'Agentic AI & Automation Developer', meta:'Client-facing design and delivery', date:'2025 — present',
    points:['Build AI assistants that use tools and complete multi-step tasks.','Create document search tools, MCP servers, voice assistants, and dashboards across logistics, aviation, real estate, and healthcare.','Worked directly with clients on Techmen, Jepsii, an AI dental clinic assistant, a real estate agent, PostPilot, and a car wash voice agent.','Handle project design, development, deployment, monitoring, and client handoff.'], link:'#work', linkText:'Explore client work' },
];
const certificates = [
  { issuer:'n8n Education', name:'n8n Program Completion', subtitle:'Professional Certificate', date:'August 2026', id:'aaab880fa7c94726a9546e1fdae8cef7', mark:'n8n' },
  { issuer:'Google · Coursera', name:'Google AI Essentials', subtitle:'Authorized by Google', date:'September 8, 2025', id:'9SR2M380KPW0', mark:'G' },
  { issuer:'Google · Coursera', name:'Foundations: Data, Data, Everywhere', subtitle:'Authorized by Google', date:'September 13, 2025', id:'08E2SL44YMWW', mark:'G' },
];

export default function ExperienceSection() {
  return <PageMotion className="container editorial-page experience-page">
    <header className="editorial-intro">
      <div className="editorial-intro-copy" data-depth-reveal>
        <p className="editorial-kicker">02 / Experience</p><h2 className="editorial-title">Built with clients.<br/>Backed by practice.</h2>
        <p className="editorial-lede">AI development, full-stack delivery, and workflow automation — from the first conversation to the working system.</p>
        <nav className="editorial-jumps" aria-label="Experience sections"><a href="#career-path">Experience ↗</a><a href="#certifications">Certifications ↗</a><a href="#education">Education ↗</a></nav>
      </div>
      <ExperienceSnapshot/>
    </header>
    <section className="career-section" id="career-path" aria-labelledby="career-title">
      <div className="editorial-section-heading"><h3 id="career-title">Experience</h3><span>Client-facing engineering</span></div>
      <div className="career-timeline">{roles.map((item,index)=><article className="career-entry" key={item.company} data-depth-reveal>
        <div className="career-date"><span className="career-number">0{index+1}</span><p>{item.date}</p>{item.tag&&<span className="editorial-tag">{item.tag}</span>}</div>
        <div className="career-card"><p className="career-company">{item.company}</p><h4>{item.role}</h4><p className="career-meta">{item.meta}</p><ul>{item.points.map(point=><li key={point}>{point}</li>)}</ul>{item.link&&<a className="editorial-link" href={item.link}>{item.linkText} <span aria-hidden="true">↗</span></a>}</div>
      </article>)}</div>
    </section>
    <section className="credential-section" id="certifications" aria-labelledby="credential-title">
      <div className="editorial-section-heading"><h3 id="credential-title">Certifications</h3><span>03 credentials</span></div>
      <div className="credential-grid">{certificates.map(cert=><article className="credential-card" key={cert.id} data-depth-reveal><div className="credential-top"><span className="credential-mark">{cert.mark}</span><span>{cert.issuer}</span></div><h4>{cert.name}</h4><p>{cert.subtitle}</p><time>{cert.date}</time><details><summary>Credential details</summary><p>Credential ID: <span className="credential-id">{cert.id}</span></p></details></article>)}</div>
    </section>
    <section id="education" className="education-grid" aria-label="Education and training">
      <article className="editorial-card" data-depth-reveal><p className="editorial-kicker">Education / 2022–2026</p><h3>B.S. Artificial Intelligence</h3><p className="education-school">IQRA University, Karachi</p><p><strong>Final year project:</strong> PI-MF Autoencoder, a computer vision model for unusual activity in crowded CCTV footage using body pose, movement, and appearance. Achieved 30+ FPS on an RTX 3060 using a 150 GB dataset.</p><a className="editorial-link" href="#autoencoder">View the research project ↗</a></article>
      <article className="editorial-card" data-depth-reveal><p className="editorial-kicker">Training / 2023–2025</p><h3>Applied learning</h3><dl className="training-list"><div><dt>Workflow automation · 2 years</dt><dd>Building n8n workflows that connect APIs, databases, and AI models.</dd></div><div><dt>Multi-agent orchestration · 6 months</dt><dd>Hands-on training with LangGraph and CrewAI.</dd></div></dl></article>
    </section>
  </PageMotion>;
}
