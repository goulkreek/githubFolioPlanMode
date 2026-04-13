"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center px-6">
      <div className="glass rounded-2xl p-10 max-w-lg text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-magenta mb-4">
          Erreur
        </p>
        <h1 className="text-2xl font-bold mb-3">Impossible de charger ce profil</h1>
        <p className="text-sm text-muted mb-6">{error.message}</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="ghost">
            Réessayer
          </Button>
          <Link href="/">
            <Button>Retour à l&apos;accueil</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
