import { About } from "@/app/components/About";
import { FeaturedProjects } from "@/app/components/FeaturedProjects";
import { Footer } from "@/app/components/Footer";
import { Hero } from "@/app/components/Hero";
import { Nav } from "@/app/components/Nav";
import { Projects } from "@/app/components/Projects";
import { Skills } from "@/app/components/Skills";
import { CharacterStatsLauncher } from "@/app/modules/character-stats";
import { buildCharacterStats } from "@/app/modules/character-stats/service";
import { portfolioData } from "@/app/data/portfolio";

export default function Portfolio() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <FeaturedProjects />
        <Projects projects={portfolioData.projects} />
        <Skills />
        <About />
      </main>
      <Footer />
      <CharacterStatsLauncher stats={buildCharacterStats(portfolioData)} />
    </>
  );
}
