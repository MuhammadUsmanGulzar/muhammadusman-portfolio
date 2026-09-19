"use client";

import { useEffect, useRef, useState } from "react";

const projects = [
  {
    id: "real-estate-agent",
    client: "Real Estate Agent",
    icon: "RE",
    title: "Real Estate Agent",
    type: "n8n automation",
    headline: "From first enquiry to a booked property viewing.",
    description:
      "A multi-channel agent handling property enquiries across voice and WhatsApp.",
    details: [
      "The agent talks with property buyers or renters, asks the right follow-up questions, and understands what kind of listing they need.",
      "It checks matching listings, answers simple questions, and helps move a qualified lead toward a viewing without manual back-and-forth.",
      "When the request is unusual or needs a person, the workflow can pass it to a human with the key details already collected.",
    ],
    role: "AI architecture and automation",
    domain: "Real estate",
    outcome: "Zero-touch qualification and booking across two customer channels.",
    stack: ["n8n", "OpenAI", "Vapi", "Pinecone", "LangChain"],
    flow: [
      "Inbound lead",
      "Intent and qualification",
      "Listing retrieval",
      "Viewing booked",
    ],
  },
  {
    id: "techmen-sales",
    client: "Techmen",
    icon: "TS",
    title: "Techmen Sales Automation",
    type: "sales AI",
    headline: "Six enquiry types, one dependable sales workflow.",
    description:
      "An autonomous sales system that understands intent and captures CRM-ready lead data.",
    details: [
      "The workflow reads new sales enquiries, identifies what the customer is asking for, and extracts the contact and request details in a clean format.",
      "It scores the lead, stores useful information, and sends important cases to the right person so the team can respond faster.",
      "The goal was to reduce manual triage and keep every enquiry moving through the same reliable process.",
    ],
    role: "Workflow engineering",
    domain: "B2B sales",
    outcome: "Faster response and consistent lead capture without manual triage.",
    stack: ["n8n", "OpenAI", "Telegram", "Google Sheets"],
    flow: ["New enquiry", "Intent routing", "Lead scoring", "CRM capture"],
  },
  {
    id: "dental-assistant",
    client: "AI Dental Clinic",
    icon: "DC",
    title: "AI Dental Clinic Assistant",
    type: "voice and messaging AI",
    headline: "A patient conversation that ends with a confirmed appointment.",
    description:
      "A WhatsApp-based assistant that answers clinic questions and books appointments.",
    details: [
      "The assistant handles patient messages, understands the appointment request, and answers common clinic questions in a simple way.",
      "It checks available time slots, keeps the patient context in the workflow, and completes the booking when the patient confirms.",
      "This helps the clinic reply faster while keeping the conversation clear and personal.",
    ],
    role: "Conversational AI",
    domain: "Healthcare",
    outcome: "Reduced front-desk workload while keeping the booking experience personal.",
    stack: ["n8n", "WhatsApp API", "OpenAI", "Calendar"],
    flow: [
      "Patient message",
      "History lookup",
      "Availability check",
      "Appointment booked",
    ],
  },
  {
    id: "aviation-email",
    client: "Jepsii",
    icon: "AV",
    title: "Jepsii Aviation Email Automation",
    type: "data extraction",
    headline: "High-volume aviation enquiries, structured and routed automatically.",
    description:
      "Built for Jepsii to sort aviation enquiries, extract key details, and route emails.",
    details: [
      "This automation reads aviation enquiry emails and turns unstructured email text into clear case information.",
      "It extracts important details such as request type, route, timing, and missing fields, then sends the case to the right team.",
      "It was built to save time on repetitive email handling and make each request easier to act on.",
    ],
    role: "Pipeline architecture",
    domain: "Aviation",
    outcome: "Cleaner case data and dramatically less manual email handling.",
    stack: ["Python", "n8n", "OpenAI", "Email APIs"],
    flow: ["Email received", "Classify and extract", "Validate fields", "Route case"],
  },
  {
    id: "voice-bot",
    client: "Car Wash Voice Agent",
    icon: "VB",
    title: "Car Wash Voice Agent",
    type: "voice AI",
    headline: "A voice agent that explains, qualifies and books.",
    description:
      "An inbound and outbound calling agent for service explanation and appointment booking.",
    details: [
      "The voice agent can answer calls, explain service packages, ask the customer what they need, and collect booking details.",
      "It logs the conversation result into the CRM so the business has a clear record after every call.",
      "The flow was designed for simple service businesses that need phone coverage without hiring extra staff.",
    ],
    role: "Voice automation",
    domain: "Local services",
    outcome: "Always-on phone coverage with structured CRM records.",
    stack: ["Vapi", "n8n", "OpenAI", "CRM"],
    flow: ["Call connected", "Intent detected", "Package selected", "Booking logged"],
  },
  {
    id: "linkedin-profile-scraper",
    icon: "LS",
    title: "LinkedIn Profile Scraper",
    type: "lead research automation",
    headline: "A profile search workflow based on user requirements.",
    description:
      "An n8n workflow that uses SerpAPI to collect LinkedIn profiles matching a user request.",
    details: [
      "The user enters the kind of profiles they want, such as role, location, industry, or keywords.",
      "The n8n workflow sends that requirement to SerpAPI, searches matching LinkedIn profile results, and collects useful profile information.",
      "The output is organized so the user can review matching leads without manually searching one profile at a time.",
    ],
    role: "Workflow development",
    domain: "Data extraction",
    outcome: "Faster lead research from a clear set of user requirements.",
    stack: ["n8n", "SerpAPI"],
    flow: [
      "User enters requirements",
      "Search profiles with SerpAPI",
      "Filter matching profiles",
      "Collect profile information",
    ],
  },
  {
    id: "postpilot-autoposting",
    client: "PostPilot",
    icon: "PP",
    title: "PostPilot",
    status: "In progress",
    type: "agentic marketing automation",
    headline: "An agentic social media marketing workspace.",
    description:
      "PostPilot generates platform-ready posts and images, shows the final output, and lets the user choose where to publish.",
    details: [
      "I am building PostPilot as an agentic social media marketing system for creators, founders, and small teams.",
      "The current version takes a topic, target audience, tone, visual preference, and key angle, then sends the brief to an n8n production workflow.",
      "The agent workflow researches the idea, writes the post, creates a supporting image, stores generation history in Supabase, and shows the finished output before anything is posted.",
      "The user stays in control: PostPilot prepares the content for LinkedIn, Instagram, Facebook, X/Twitter, or TikTok, then the user chooses the platform and publishes it there.",
    ],
    role: "Full-stack automation and agent workflow development",
    domain: "Agentic social media marketing",
    outcome: "A controlled marketing workflow that produces ready-to-post content with history, media assets, and clear review before publishing.",
    stack: ["Next.js", "React", "Supabase", "n8n", "OpenAI", "Image generation"],
    flow: [
      "User enters topic and audience",
      "Agent workflow researches and writes",
      "Post and image are generated",
      "History and media are saved in Supabase",
      "User reviews and posts on the chosen platform",
    ],
    roadmap: [
      "Generate short videos from the same campaign brief.",
      "Run paid ads and track campaign spend.",
      "Reply to customer comments and messages with approval controls.",
      "Show analytics for each post, including budget used, progress gained, and return on every rupee or dollar spent.",
    ],
  },
  {
    id: "rag-assistant",
    icon: "RA",
    title: "Private RAG Assistant",
    type: "knowledge intelligence",
    headline: "Useful answers without private data leaving the organization.",
    description:
      "A locally hosted knowledge agent for grounded answers from internal documents.",
    details: [
      "The assistant indexes private documents and lets people ask questions in normal language.",
      "It retrieves the most relevant context, builds an answer from that context, and keeps the response tied to the source material.",
      "The setup is designed for teams that want searchable internal knowledge while keeping sensitive files controlled.",
    ],
    role: "RAG engineering",
    domain: "Enterprise knowledge",
    outcome: "Secure natural-language access to private organizational knowledge.",
    stack: ["Ollama", "FastAPI", "FAISS", "LangChain"],
    flow: ["Ingest documents", "Create embeddings", "Retrieve context", "Grounded answer"],
  },
  {
    id: "logistics-dashboard",
    client: "Jepsii",
    icon: "JE",
    title: "Jepsii Fuel Operations Dashboard",
    type: "web application",
    headline: "A command center for aviation fuel operations and finance.",
    description:
      "Built for Jepsii to manage fuel inquiries, jobs, invoices, ledgers, vendors, clients, and financial reporting.",
    details: [
      "I built this admin dashboard for Jepsii to manage day-to-day aviation fueling operations from one place.",
      "The system covers fuel inquiries, fueling jobs, invoices, financial ledgers, banks, payments, fuel tickets, operators, vendors, clients, and fuel price records.",
      "The dashboard gives the team a real-time view of flight count, fuel uplifts, generated revenue, gross margin, accounts receivable, accounts payable, invoice activity, and vendor/client balances.",
      "It also includes filters, PDF export, and monthly analytics charts for revenue flow, margin profit, operational velocity, and fuel pricing trends.",
    ],
    role: "Full-stack dashboard development",
    domain: "Aviation fuel operations",
    outcome: "One operating view for fuel operations, billing, balances, and performance tracking.",
    stack: ["Next.js", "React", "Tailwind CSS", "REST APIs"],
    flow: [
      "Fuel inquiry created",
      "Job and fuel ticket tracked",
      "Invoice and payment recorded",
      "Ledger and dashboard updated",
    ],
  },
  {
    id: "broad-peak",
    icon: "BP",
    title: "Broad Peak Adventures",
    type: "web experience",
    headline: "Adventure travel presented with a sense of place.",
    description:
      "An immersive tourism website for Northern Pakistan with destination storytelling.",
    details: [
      "The website presents trips, destinations, and travel information in a clean visual flow.",
      "It uses mountain-focused imagery and simple content sections so visitors can understand the offer without feeling overloaded.",
      "The enquiry path was made clear so a visitor can move from discovery to contacting the business.",
    ],
    role: "Frontend development",
    domain: "Travel",
    outcome: "A stronger visual identity and clearer path from discovery to enquiry.",
    stack: ["React", "Tailwind CSS", "Vercel"],
    flow: ["Discover region", "Explore journeys", "Review details", "Send enquiry"],
  },
  {
    id: "autoencoder",
    icon: "CV",
    title: "PI-MF Autoencoder",
    type: "computer vision",
    headline: "Crowd-robust anomaly detection at edge speed.",
    description:
      "A physics-informed multi-modal fusion autoencoder for live CCTV anomaly detection.",
    details: [
      "The system combines pose, optical flow, and appearance signals to understand activity in CCTV footage.",
      "It uses a multi-modal autoencoder to learn normal behavior and flag unusual motion or events.",
      "The model was built for live inference so detection can run close to real time on edge hardware.",
    ],
    role: "AI research and engineering",
    domain: "Computer vision",
    outcome: "30+ FPS edge inference on RTX 3060 across a 150 GB dataset.",
    stack: ["PyTorch", "YOLOv8", "ByteTrack", "OpenCV"],
    flow: ["Video stream", "Extract modalities", "Fuse signals", "Flag anomaly"],
  },
];

export default function WorkSection() {
  const [selectedProject, setSelectedProject] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.add("work-page-active");
    return () => document.documentElement.classList.remove("work-page-active");
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const workView = document.getElementById('work');
    const previousViewOverflow = workView?.style.overflowY;
    dialogRef.current?.showModal();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialogRef.current?.animate(
        [{ opacity: 0, transform: "perspective(1000px) translateZ(-24px) translateY(8px)" },
         { opacity: 1, transform: "perspective(1000px) translateZ(0) translateY(0)" }],
        { duration: 220, easing: "ease-out" }
      );
    }
    document.body.style.overflow = "hidden";
    if (workView) workView.style.overflowY = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      if (workView) workView.style.overflowY = previousViewOverflow || '';
      if (trigger instanceof HTMLElement) trigger.focus({ preventScroll: true });
    };
  }, [selectedProject]);

  return (
    <div className="container work-page">
      <header className="work-header">
        <div>
          <h2>Work</h2>
          <p>AI tools, automations, and web applications, including work built directly with clients.</p>
        </div>
        <span className="work-count">{projects.length} projects</span>
      </header>

      <div className="work-grid">
        {projects.map((project) => (
          <article className="work-card" id={project.id} key={project.id}>
            <div className="work-card-labels">
              <p>{project.domain}</p>
              {project.status && <span className="work-status">{project.status}</span>}
            </div>
            <h3>{project.title}</h3>
            <p className="work-card-description">{project.description}</p>
            {project.client && <p className="work-client-note">Direct client collaboration</p>}
            <p className="work-card-tools" aria-label="Tools used">{project.stack.join(" · ")}</p>
            <button
              className="project-detail-button"
              type="button"
              aria-haspopup="dialog"
              aria-label={`Project details: ${project.title}`}
              onClick={() => setSelectedProject(project)}
            >
              Project details <span aria-hidden="true">↗</span>
            </button>
          </article>
        ))}
      </div>

      {selectedProject && (
        <dialog
          ref={dialogRef}
          aria-labelledby="project-modal-title"
          className="project-modal"
          onCancel={() => setSelectedProject(null)}
          onClose={() => setSelectedProject(null)}
          onClick={(event) => {
            if (event.target !== event.currentTarget) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            if (event.clientX < bounds.left || event.clientX > bounds.right ||
                event.clientY < bounds.top || event.clientY > bounds.bottom) {
              setSelectedProject(null);
            }
          }}
        >
          <header className="project-modal-header">
            <div>
              <p className="project-modal-domain">{selectedProject.domain}</p>
              <h2 id="project-modal-title">{selectedProject.title}</h2>
            </div>
            <button
              aria-label="Close project details"
              className="project-modal-close"
              type="button"
              onClick={() => setSelectedProject(null)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </header>

          <div className="project-modal-body" tabIndex={0} aria-label="Project explanation">
            <p className="project-modal-headline">{selectedProject.headline}</p>
            {selectedProject.status && <p className="project-modal-status">Currently in development</p>}
            <section className="project-modal-section">
              <h3>About the project</h3>
              <div className="project-modal-copy">
                {selectedProject.details.map((detail) => <p key={detail}>{detail}</p>)}
              </div>
            </section>

            <dl className="project-modal-meta">
              {selectedProject.client && <div><dt>Client collaboration</dt><dd>I worked directly with the client on this project.</dd></div>}
              <div><dt>My role</dt><dd>{selectedProject.role}</dd></div>
              <div><dt>{selectedProject.status ? "Current focus" : "What it delivers"}</dt><dd>{selectedProject.outcome}</dd></div>
            </dl>

            <section className="project-modal-section">
              <h3>How it works</h3>
              <ol className="project-workflow">
                {selectedProject.flow.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </section>

            {selectedProject.roadmap?.length > 0 && (
              <section className="project-modal-section">
                <h3>Planned next</h3>
                <ul className="project-roadmap">
                  {selectedProject.roadmap.map((step) => <li key={step}>{step}</li>)}
                </ul>
              </section>
            )}

            <section className="project-modal-section project-modal-stack">
              <h3>Built with</h3>
              <p>{selectedProject.stack.join(" · ")}</p>
            </section>
          </div>
        </dialog>
      )}
    </div>
  );
}
