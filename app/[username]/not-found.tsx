import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center px-6">
      <div className="glass rounded-2xl p-10 max-w-lg text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan mb-4">404</p>
        <h1 className="text-2xl font-bold mb-3">Utilisateur introuvable</h1>
        <p className="text-sm text-muted mb-6">
          Ce username GitHub n&apos;existe pas (ou n&apos;a aucun repo public).
        </p>
        <Link href="/">
          <Button>Essayer un autre username</Button>
        </Link>
      </div>
    </main>
  );
}
