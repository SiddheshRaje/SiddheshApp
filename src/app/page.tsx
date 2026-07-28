import CodeBio from "@/components/CodeBio";
import CredentialsCard from "@/components/CredentialsCard";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import FeaturedProject from "@/components/FeaturedProject";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Location from "@/components/Location";
import Marquee from "@/components/Marquee";
import Nav from "@/components/Nav";
import ResourceShelf from "@/components/ResourceShelf";
import { projects } from "@/data/resume";
import { connection } from "next/server";

export default async function Home() {
  await connection();

  return (
    <div id="top" className="portfolio-shell">
      <Nav />

      <main className="portfolio-main">
        <section id="work" className="portfolio-layout" aria-label="Portfolio overview">
          <Hero />

          <div className="featured-market">
            <FeaturedProject project={projects[0]} variant="market" />
          </div>
          <div className="featured-transaction">
            <FeaturedProject project={projects[1]} variant="transaction" />
          </div>

          <div className="support-column support-left">
            <CodeBio />
            <Location />
          </div>
          <div className="support-column support-middle">
            <Marquee />
            <CredentialsCard />
          </div>
          <div className="support-column support-right">
            <ExperienceTimeline />
            <ResourceShelf />
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
