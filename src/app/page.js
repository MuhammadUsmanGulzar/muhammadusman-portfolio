import ViewDeck from '../components/ViewDeck';
import HomeSection from '../components/sections/HomeSection';
import WorkSection from '../components/sections/WorkSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import AboutSection from '../components/sections/AboutSection';
import ContactSection from '../components/sections/ContactSection';

function View({ id, label, children }) {
  return <section id={id} className="portfolio-view" data-portfolio-view aria-label={label} hidden={id !== 'home'} aria-hidden={id !== 'home'} inert={id !== 'home'}>
    <div className="view-content">
      {children}
      <footer className="site-footer"><span>© 2026 Muhammad Usman</span><span>AI, automation & web development.</span></footer>
    </div>
  </section>;
}

export default function Home() {
  return <ViewDeck>
    <View id="home" label="Home"><HomeSection /></View>
    <View id="work" label="Work"><WorkSection /></View>
    <View id="experience" label="Experience"><ExperienceSection /></View>
    <View id="about" label="About"><AboutSection /></View>
    <View id="contact" label="Contact"><ContactSection /></View>
  </ViewDeck>;
}
