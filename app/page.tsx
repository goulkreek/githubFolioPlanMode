import { SceneCanvas } from "@/components/three/SceneCanvas";
import { ParticlesHero } from "@/components/three/ParticlesHero";
import { UsernameForm } from "@/components/ui/UsernameForm";
import { LandingTitle } from "@/components/landing/LandingTitle";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <SceneCanvas className="opacity-90">
        <ParticlesHero />
      </SceneCanvas>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <LandingTitle />
        <UsernameForm />
        <p className="mt-6 text-sm text-muted max-w-md">
          Essaie avec <span className="font-mono text-cyan">vercel</span>,{" "}
          <span className="font-mono text-violet">torvalds</span> ou{" "}
          <span className="font-mono text-magenta">gaearon</span>.
        </p>
      </section>

      <footer className="absolute bottom-4 inset-x-0 text-center text-xs text-muted/60 z-10">
        Construit avec Next.js · React Three Fiber · Motion
      </footer>
    </main>
  );
}
