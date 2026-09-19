import './globals.css';
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: 'Muhammad Usman | AI & Automation Engineer',
  description: 'Muhammad Usman builds AI assistants, business automations, and web applications through direct client collaboration.',
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
        </div>
      </body>
    </html>
  );
}

