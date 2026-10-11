import { AboutProcess } from '../ContextPanels';
import PageMotion from '../PageMotion';

const groups = [
  {number:'01',title:'Frameworks & agents',description:'Connecting reasoning with tools and workflows.',items:['n8n','LangGraph','CrewAI','LangChain','AutoGen','MCP Servers']},
  {number:'02',title:'AI & ML models',description:'Language, voice, vision, and local inference.',items:['OpenAI GPT-4o','Google Gemini','Claude','Ollama','Vapi','YOLOv8']},
  {number:'03',title:'Backend & infrastructure',description:'The data and application layer behind the experience.',items:['Python','FastAPI','FAISS','Pinecone','Next.js','React','REST APIs','SQL']},
];
const clients = [['Jepsii','logistics-dashboard'],['Techmen','techmen-sales'],['AI Dental Clinic','dental-assistant'],['Real Estate Agent','real-estate-agent'],['PostPilot','postpilot-autoposting'],['Car Wash Voice Agent','voice-bot']];
export default function AboutSection() {
  return <PageMotion className="container editorial-page about-page">
    <header className="editorial-intro">
      <div className="editorial-intro-copy" data-depth-reveal><p className="editorial-kicker">03 / About</p><h2 className="editorial-title">Close to the problem.<br/>Hands-on with the build.</h2><p className="editorial-lede">I’m Muhammad Usman, an AI and automation engineer based in Karachi. I work directly with clients to turn business needs into useful software.</p><a className="editorial-link" href="#contact">Let’s discuss your project <span aria-hidden="true">↗</span></a></div>
      <AboutProcess/>
    </header>
    <section className="about-story editorial-card" data-depth-reveal aria-labelledby="background-title"><div><p className="editorial-kicker">My background</p><h3 id="background-title">Engineering with the client in the loop.</h3></div><div><p>My focus is forward deployed AI engineering: understanding the business context, working closely with the people involved, and building around their needs.</p><p>My projects span operations dashboards, sales workflows, conversational AI, and content automation. I have two years of experience with n8n, including one year of freelance client work, and use LangGraph and CrewAI for assistants that connect to tools and follow multi-step workflows.</p></div></section>
    <section className="about-client-section" aria-labelledby="client-title"><div className="editorial-section-heading"><h3 id="client-title">Direct client collaboration</h3><span>Across industries</span></div><div className="client-chips">{clients.map(([name,id])=><a href={`#${id}`} key={id}>{name}<span aria-hidden="true">↗</span></a>)}</div></section>
    <section aria-labelledby="toolkit-title"><div className="editorial-section-heading"><h3 id="toolkit-title">The tools I work with</h3><span>Selected for the problem</span></div><div className="toolkit-grid">{groups.map(group=><article key={group.number} className="toolkit-card" data-depth-reveal><span className="toolkit-number">{group.number}</span><h4>{group.title}</h4><p>{group.description}</p><ul>{group.items.map(item=><li key={item}>{item}</li>)}</ul></article>)}</div></section>
  </PageMotion>;
}
