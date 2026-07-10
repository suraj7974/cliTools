import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Positioning } from "@/components/sections/Positioning";
import { FeaturedPips } from "@/components/sections/FeaturedPips";
import { ToolGrid } from "@/components/sections/ToolGrid";
import { ComingSoon } from "@/components/sections/ComingSoon";
import { InstallCTA } from "@/components/sections/InstallCTA";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Positioning />
        <FeaturedPips />
        <ToolGrid />
        <ComingSoon />
        <InstallCTA />
      </main>
      <Footer />
    </>
  );
}
