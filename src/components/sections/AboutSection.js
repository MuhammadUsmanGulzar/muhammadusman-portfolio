export default function AboutSection() {
  return (
    <div className="container">
      <section className="page-header">
        <h2 className="page-title">About <span>Me</span></h2>
        <p className="page-desc">
          I work directly with clients to build AI assistants, automations, and web applications.
        </p>
      </section>

      <div className="bento-grid">
        <div className="bento-box col-span-12">
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>My Background</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
            I am an AI and automation engineer based in Karachi. My focus is forward deployed AI engineering: working closely with clients and building software around their business needs.
            <br/><br/>
            My direct client work includes Jepsii, Techmen, an AI dental clinic assistant, a real estate agent, PostPilot, and a car wash voice agent. These projects span operations dashboards, sales workflows, conversational AI, and content automation.
            <br/><br/>
            I have two years of experience with n8n, including one year of freelance client work. I also work with LangGraph and CrewAI to build AI assistants that connect to tools and follow multi-step workflows.
          </p>
        </div>

        <div className="bento-box col-span-6">
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--accent-1)' }}>Frameworks & Agents</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {['n8n', 'LangGraph', 'CrewAI', 'LangChain', 'AutoGen', 'MCP Servers'].map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="bento-box col-span-6">
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--accent-2)' }}>AI & ML Models</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {['OpenAI GPT-4o', 'Google Gemini', 'Claude', 'Ollama', 'Vapi', 'YOLOv8'].map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="bento-box col-span-12">
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem' }}>Backend & Infrastructure</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {['Python', 'FastAPI', 'FAISS', 'Pinecone', 'Next.js', 'React', 'REST APIs', 'SQL'].map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

