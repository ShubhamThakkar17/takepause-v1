import { MotionConfig } from "motion/react";
import { EnquiryProvider } from "@/components/EnquiryDialog";
import { ScrollProgress } from "@/components/Motion";
import { Bakes } from "@/sections/Bakes";
import { Celebrations } from "@/sections/Celebrations";
import { Footer } from "@/sections/Footer";
import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { HowToOrder } from "@/sections/HowToOrder";
import { InstagramFeed } from "@/sections/InstagramFeed";
import { Pause } from "@/sections/Pause";
import { Ribbon } from "@/sections/Ribbon";
import { Story } from "@/sections/Story";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <EnquiryProvider>
        <ScrollProgress />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-cocoa focus:px-5 focus:py-3 focus:text-cream"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">
          <Hero />
          <Ribbon />
          <Bakes />
          <Pause />
          <Celebrations />
          <Story />
          <HowToOrder />
          <InstagramFeed />
        </main>
        <Footer />
      </EnquiryProvider>
    </MotionConfig>
  );
}
