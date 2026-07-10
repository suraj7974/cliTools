import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ReviewBlock } from "@/components/sections/ReviewBlock";
import { ToolsSubNav } from "@/components/sections/ToolsSubNav";
import { Craft } from "@/components/sections/Craft";
import { InstallCTA } from "@/components/sections/InstallCTA";
import { Scramble } from "@/components/ui/Scramble";
import { tools } from "@/data/tools";

export const metadata: Metadata = {
  title: "The tools, reviewed — cliTools",
  description:
    "Each cliTools command up close: what it does, how it works, and how to install it.",
};

export default function ToolsPage() {
  return (
    <>
      <Nav />
      <main>
        <header className="container-site pb-10 pt-36">
          <p className="text-caption">Showcase</p>
          <Scramble
            as="h1"
            text="The tools, reviewed."
            className="text-display mt-4"
            play="mount"
            delay={100}
            stagger={18}
          />
          <p className="text-body-lg mt-5 max-w-xl">
            Each one, up close: what it does, how it works, and how to install
            it.
          </p>
        </header>

        <ToolsSubNav />

        {tools.map((tool, i) => (
          <ReviewBlock key={tool.slug} tool={tool} flip={i % 2 === 1} />
        ))}

        <Craft />
        <InstallCTA />
      </main>
      <Footer />
    </>
  );
}
