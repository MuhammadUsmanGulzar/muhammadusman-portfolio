import './globals.css';
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: 'Muhammad Usman | Agentic AI & Automation Developer',
  description: 'Portfolio of Muhammad Usman, Agentic AI and Automation Developer specializing in multi-agent architectures and LLM orchestration.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <div className="page-wrapper">
              {children}
            </div>
          </main>
          <footer className="site-footer"><span>© 2026 Muhammad Usman</span><span>AI, automation & web development.</span></footer>
        </div>
      </body>
    </html>
  );
}

