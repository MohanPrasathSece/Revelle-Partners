import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { CustomCursor } from "@/components/landing/CustomCursor";
import { ScrollProgress } from "@/components/landing/ScrollProgress";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { SectionWealth } from "@/components/landing/SectionWealth";
import { SectionWhy } from "@/components/landing/SectionWhy";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <SectionWealth />
        <SectionWhy />
        <ContactSection />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
