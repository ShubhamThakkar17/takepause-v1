import { useState } from "react";
import { useSmoothScroll } from "@/lib/useSmoothScroll";
import { Preloader } from "@/sections/Preloader";
import { Nav } from "@/sections/Nav";
import { Hero } from "@/sections/Hero";
import { Ribbon } from "@/sections/Ribbon";
import { Story } from "@/sections/Story";
import { Menu } from "@/sections/Menu";
import { Process } from "@/sections/Process";
import { Occasions } from "@/sections/Occasions";
import { Philosophy } from "@/sections/Philosophy";
import { Gallery } from "@/sections/Gallery";
import { Testimonials } from "@/sections/Testimonials";
import { Contact } from "@/sections/Contact";
import { Footer } from "@/sections/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";

export default function App() {
  const [ready, setReady] = useState(false);

  useSmoothScroll();

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <ScrollProgress />
      <Nav />

      {/* Held back until the curtain lifts so entrance animations aren't spent
          behind the preloader. */}
      <main data-ready={ready}>
        <Hero />
        <Ribbon />
        <Story />
        <Menu />
        <Process />
        <Occasions />
        <Philosophy />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
