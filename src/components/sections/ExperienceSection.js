const cardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '1.5rem',
  flexWrap: 'wrap',
  gap: '1rem',
};

const titleStyle = { fontSize: '1.5rem', fontWeight: '700' };
const metaStyle = { color: 'var(--accent-1)', fontSize: '1rem', fontWeight: '500' };
const dateStyle = {
  padding: '0.4rem 1rem',
  background: 'rgba(255,255,255,0.05)',
  borderRadius: '50px',
  fontSize: '0.9rem',
  color: 'var(--text-muted)',
};
const listStyle = {
  listStyleType: 'disc',
  listStylePosition: 'outside',
  marginLeft: '1.5rem',
  color: 'var(--text-muted)',
  lineHeight: '1.8',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};
const strongStyle = { color: 'var(--text-main)' };

function ResumeCard({ title, meta, date, children }) {
  return (
    <div className="bento-box col-span-12">
      <div style={cardHeaderStyle}>
        <div>
          <h3 style={titleStyle}>{title}</h3>
          <p style={metaStyle}>{meta}</p>
        </div>
        <div style={dateStyle}>{date}</div>
      </div>
      {children}
    </div>
  );
}

export default function ExperienceSection() {
  return (
    <div className="container">
      <section className="page-header">
        <h2 className="page-title">Experience & <span>Certifications</span></h2>
        <p className="page-desc">
          Client-facing AI development, project experience, certifications, and education.
        </p>
      </section>

      <div className="bento-grid">
        <ResumeCard
          title="Artificial Intelligence Engineer"
          meta="Azm Al Safwa (Contract) - Saudi Arabia (Remote)"
          date="AUG 2026 - PRESENT"
        >
          <ul style={listStyle}>
            <li>Migrating the company website to Next.js to make it faster and easier to maintain.</li>
            <li>Building an AI assistant that answers questions using company documents.</li>
            <li>Preparing documents for search and connecting the results to AI-generated answers.</li>
            <li>Automating data workflows and building a dashboard to track business metrics.</li>
          </ul>
        </ResumeCard>

        <ResumeCard
          title="Full-Stack Dashboard Developer"
          meta="Jepsii - Aviation Fuel Operations"
          date="2026 - PROJECT"
        >
          <ul style={listStyle}>
            <li>Worked directly with Jepsii on its aviation operations projects.</li>
            <li>Built an admin dashboard for aviation fuel operations, covering fuel inquiries, jobs, invoices, ledgers, banks, payments, fuel tickets, operators, vendors, clients, and fuel prices.</li>
            <li>Created operating views for flight count, fuel uplifts, generated revenue, gross margin, accounts receivable, accounts payable, invoice activity, and vendor/client balances.</li>
            <li>Added filters, PDF export, and analytics charts for revenue flow, margin profit, operational velocity, and fuel pricing trends.</li>
            <li>Built Jepsii aviation email automation to classify enquiries, extract key details, check missing information, and route cases to the right team.</li>
          </ul>
        </ResumeCard>

        <ResumeCard
          title="Agentic AI and Automation Developer"
          meta="Freelance - Client-Facing Delivery"
          date="2025 - PRESENT"
        >
          <ul style={listStyle}>
            <li>Build AI assistants that use tools and complete multi-step tasks.</li>
            <li>Create document search tools, MCP servers, voice assistants, and dashboards for clients in logistics, aviation, real estate, and healthcare.</li>
            <li>Worked directly with clients on Techmen sales automation, Jepsii, an AI dental clinic assistant, a real estate agent, PostPilot, and a car wash voice agent.</li>
            <li>Handle project design, development, deployment, monitoring, and client handoff.</li>
          </ul>
        </ResumeCard>

        <ResumeCard
          title="Certifications"
          meta="Google, Coursera, and n8n"
          date="2025 - 2026"
        >
          <ul style={listStyle}>
            <li><strong style={strongStyle}>n8n Program Completion - Professional Certificate:</strong> issued by n8n Education in August 2026. Credential ID: aaab880fa7c94726a9546e1fdae8cef7.</li>
            <li><strong style={strongStyle}>Google AI Essentials:</strong> authorized by Google and offered through Coursera. Completed Sep 8, 2025. Verification ID: 9SR2M380KPW0.</li>
            <li><strong style={strongStyle}>Foundations: Data, Data, Everywhere:</strong> authorized by Google and offered through Coursera. Completed Sep 13, 2025. Verification ID: 08E2SL44YMWW.</li>
          </ul>
        </ResumeCard>

        <ResumeCard
          title="Training & Specializations"
          meta="AI Agents & Workflow Automation"
          date="2023 - 2025"
        >
          <ul style={listStyle}>
            <li><strong style={strongStyle}>Workflow Automation (2 Years):</strong> Building n8n workflows that connect APIs, databases, and AI models.</li>
            <li><strong style={strongStyle}>Multi-Agent Orchestration (6 Months):</strong> Hands-on training in building AI agents with LangGraph and CrewAI.</li>
          </ul>
        </ResumeCard>

        <ResumeCard
          title="Bachelor of Science in Artificial Intelligence"
          meta="IQRA University, Karachi"
          date="2022 - 2026"
        >
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
            <strong style={strongStyle}>Final Year Project:</strong> PI-MF Autoencoder: a computer vision model that detects unusual activity in crowded CCTV footage using body pose, movement, and appearance. Achieved 30+ FPS on an RTX 3060 using a 150 GB dataset.
          </p>
        </ResumeCard>
      </div>
    </div>
  );
}
