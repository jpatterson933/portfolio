import { About } from "@/app/components/About";
import { Footer } from "@/app/components/Footer";
import { Hero } from "@/app/components/Hero";
import { Nav } from "@/app/components/Nav";
import { Projects } from "@/app/components/Projects";
import { Skills } from "@/app/components/Skills";

export default function Portfolio() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Skills />
        <About />
        <Footer />
      </main>
    </>
  );
}
