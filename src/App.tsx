import { SmoothScrollProvider } from './lib/smooth-scroll';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Intro from './components/Intro';
import LightTrace from './components/LightTrace';
import Performance from './components/Performance';
import VisualPause from './components/VisualPause';
import Gallery from './components/Gallery';
import Closing from './components/Closing';

export default function App() {
  return (
    <SmoothScrollProvider>
      <a className="skip-link" href="#overview">
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <Intro />
        <LightTrace />
        <Performance />
        <VisualPause />
        <Gallery />
      </main>
      <Closing />
    </SmoothScrollProvider>
  );
}
