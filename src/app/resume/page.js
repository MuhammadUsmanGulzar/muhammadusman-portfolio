export default function Resume() {
  return (
    <div className="container">
      <section className="page-header">
        <h1 className="page-title">Experience & <span>Education</span></h1>
        <p className="page-desc">
          My work, training, and education.
        </p>
      </section>

      <div className="bento-grid">
        <div className="bento-box col-span-12">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Artificial Intelligence Engineer</h2>
              <p style={{ color: 'var(--accent-1)', fontSize: '1rem', fontWeight: '500' }}>Azm Al Safwa (Contract) &bull; Saudi Arabia (Remote)</p>
            </div>
            <div style={{ padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              AUG 2026 - PRESENT
            </div>
          </div>
          
          <ul style={{ listStyleType: 'disc', listStylePosition: 'outside', marginLeft: '1.5rem', color: 'var(--text-muted)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li>Migrating the company website to Next.js to make it faster and easier to maintain.</li>
            <li>Building an AI assistant that answers questions using company documents.</li>
            <li>Preparing documents for search and connecting the results to AI-generated answers.</li>
            <li>Automating data workflows and building a dashboard to track business metrics.</li>
          </ul>
        </div>
        <div className="bento-box col-span-12">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Agentic AI and Automation Developer</h2>
              <p style={{ color: 'var(--accent-1)', fontSize: '1rem', fontWeight: '500' }}>Freelance - Client-Facing Delivery</p>
            </div>
            <div style={{ padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              2025 - PRESENT
            </div>
          </div>
          
          <ul style={{ listStyleType: 'disc', listStylePosition: 'outside', marginLeft: '1.5rem', color: 'var(--text-muted)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li>Build AI assistants that use tools and complete multi-step tasks.</li>
            <li>Create document search tools, MCP servers, voice assistants, and dashboards for clients in logistics, aviation, real estate, and healthcare.</li>
            <li>Saved over 1,200 hours of manual work across client workflows through targeted agentic process automation.</li>
            <li>Handle project design, development, deployment, monitoring, and client handoff.</li>
          </ul>
        </div>

        <div className="bento-box col-span-12">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Training & Specializations</h2>
              <p style={{ color: 'var(--accent-1)', fontSize: '1rem', fontWeight: '500' }}>AI Agents & Workflow Automation</p>
            </div>
            <div style={{ padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              2023 - 2025
            </div>
          </div>
          
          <ul style={{ listStyleType: 'disc', listStylePosition: 'outside', marginLeft: '1.5rem', color: 'var(--text-muted)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><strong style={{ color: 'var(--text-main)' }}>Workflow Automation (2 Years):</strong> Building n8n workflows that connect APIs, databases, and AI models.</li>
            <li><strong style={{ color: 'var(--text-main)' }}>Multi-Agent Orchestration (6 Months):</strong> Hands-on training in building AI agents with LangGraph and CrewAI.</li>
          </ul>
        </div>

        <div className="bento-box col-span-12">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Bachelor of Science in Artificial Intelligence</h2>
              <p style={{ color: 'var(--accent-2)', fontSize: '1rem', fontWeight: '500' }}>IQRA University, Karachi</p>
            </div>
            <div style={{ padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              2022 - 2026
            </div>
          </div>
          
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
            <strong style={{ color: 'var(--text-main)' }}>Final Year Project:</strong> PI-MF Autoencoder: a computer vision model that detects unusual activity in crowded CCTV footage using body pose, movement, and appearance. Achieved 30+ FPS on an RTX 3060 using a 150 GB dataset.
          </p>
        </div>
      </div>
    </div>
  );
}

