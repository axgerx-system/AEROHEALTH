import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { ResearchStory } from "@/components/research-story";
import { SiteFooter } from "@/components/site-footer";

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <ResearchStory />
      </main>
      <SiteFooter />
    </>
  );
}
