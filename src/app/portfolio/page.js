"use client";

import { useEffect, useState } from "react";

const projects = [
  {
    id: "real-estate-agent",
    icon: "RE",
    title: "Autonomous Real Estate Agent",
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
    id: "linkedin-publisher",
    icon: "LI",
    title: "LinkedIn AI Publisher",
    type: "content automation",
    headline: "From topic research to a scheduled post in one flow.",
    description:
      "A complete content workflow for research, drafting, visual creation, and scheduling.",
    details: [
      "The workflow starts from a topic, researches useful points, and drafts a LinkedIn post in a consistent tone.",
      "It can create a supporting image, prepare the final post, and schedule it after approval.",
      "The purpose is to make posting more consistent while still keeping a review step before anything goes live.",
    ],
    role: "Automation engineering",
    domain: "Content operations",
    outcome: "A repeatable publishing rhythm with less manual production effort.",
    stack: ["n8n", "Gemini", "DALL-E", "LinkedIn"],
    flow: ["Topic research", "Draft content", "Create visual", "Schedule post"],
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
    icon: "JE",
    title: "Jepsii Logistics Dashboard",
    type: "web application",
    headline: "Operational visibility for charter and fuel logistics.",
    description:
      "Built for Jepsii to track revenue, client activity, and logistics performance.",
    details: [
      "The dashboard brings commercial and logistics data into one place so the team can see what is happening quickly.",
      "It tracks revenue, client activity, and key operating metrics with a clean layout built for daily use.",
      "The aim was to replace scattered updates with one clear view for faster decisions.",
    ],
    role: "Full-stack development",
    domain: "Logistics",
    outcome: "One clear operating picture for faster commercial decisions.",
    stack: ["Next.js", "React", "Tailwind CSS", "REST APIs"],
    flow: ["Collect data", "Normalize metrics", "Calculate KPIs", "Display insight"],
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

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  return (
    <div className="container">
      <section className="page-header">
        <h1 className="page-title">Projects</h1>
        <p className="page-desc">
          A selection of my work in AI, automation, and web development.
        </p>
      </section>

      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" id={project.id} key={project.id}>
            <p className="eyebrow">{project.domain}</p>
            <h2>{project.title.replace("Autonomous ", "")}</h2>
            <p>{project.description}</p>

            {project.stack.length > 0 && (
              <div className="project-tools">
                {project.stack.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
            )}

            <button
              className="project-detail-button"
              type="button"
              onClick={() => setSelectedProject(project)}
            >
              Project details
            </button>
          </article>
        ))}
      </div>

      {selectedProject && (
        <div
          className="project-modal-backdrop"
          role="presentation"
          onMouseDown={() => setSelectedProject(null)}
        >
          <section
            aria-labelledby="project-modal-title"
            aria-modal="true"
            className="project-modal"
            role="dialog"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Close project details"
              className="project-modal-close"
              type="button"
              onClick={() => setSelectedProject(null)}
            >
              x
            </button>

            <p className="eyebrow">{selectedProject.domain}</p>
            <h2 id="project-modal-title">{selectedProject.title}</h2>
            <p className="project-modal-headline">{selectedProject.headline}</p>

            <div className="project-modal-copy">
              {selectedProject.details.map((detail) => (
                <p key={detail}>{detail}</p>
              ))}
            </div>

            <div className="project-modal-meta">
              <p>
                <strong>My role:</strong> {selectedProject.role}
              </p>
              <p>
                <strong>Result:</strong> {selectedProject.outcome}
              </p>
            </div>

            {selectedProject.flow.length > 0 && (
              <div className="project-modal-section">
                <h3>Workflow</h3>
                <ol>
                  {selectedProject.flow.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {selectedProject.stack.length > 0 && (
              <div className="project-tools project-modal-tools">
                {selectedProject.stack.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
