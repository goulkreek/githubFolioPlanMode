"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./Button";

const schema = z.object({
  token: z
    .string()
    .trim()
    .min(20, "Token trop court")
    .max(255, "Token trop long")
    .regex(/^[A-Za-z0-9_]+$/, "Format de token invalide (caractères autorisés : A-Z a-z 0-9 _)"),
});

type FormData = z.infer<typeof schema>;

const FLAG_COOKIE = "gh_token_set";

function readFlag(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c.startsWith(`${FLAG_COOKIE}=1`));
}

export function TokenDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { token: "" },
  });

  useEffect(() => {
    setHasToken(readFlag());
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json: unknown = await res.json();
      if (!res.ok || typeof json !== "object" || json === null || !("ok" in json) || json.ok !== true) {
        const msg =
          typeof json === "object" && json !== null && "error" in json && typeof json.error === "string"
            ? json.error
            : "Erreur inconnue";
        setSubmitError(msg);
        return;
      }
      reset();
      setHasToken(true);
      setOpen(false);
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  };

  const clearToken = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/token", { method: "DELETE" });
      setHasToken(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-50 glass rounded-full px-4 py-2 text-xs font-medium flex items-center gap-2 hover:border-white/20 transition-colors"
      >
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            hasToken ? "bg-cyan shadow-[0_0_10px_#22d3ee]" : "bg-muted/50"
          }`}
        />
        {hasToken ? "Token actif" : "Ajouter un token"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-2">Token GitHub</h2>
              <p className="text-sm text-muted mb-5">
                Stocké en cookie <span className="font-mono text-cyan">httpOnly</span>, jamais
                exposé au JS du navigateur. Durée : 24h. Scopes recommandés :{" "}
                <span className="font-mono">public_repo</span> (lecture seule).
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <input
                  {...register("token")}
                  type="password"
                  placeholder="ghp_..."
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:border-cyan/50"
                />
                {errors.token && (
                  <p className="text-xs text-magenta">{errors.token.message}</p>
                )}
                {submitError && (
                  <p className="text-xs text-magenta">{submitError}</p>
                )}

                <div className="flex items-center justify-between gap-3 pt-2">
                  {hasToken ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={clearToken}
                      disabled={submitting}
                    >
                      Effacer
                    </Button>
                  ) : (
                    <span />
                  )}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setOpen(false)}
                      disabled={submitting}
                    >
                      Annuler
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Validation…" : "Enregistrer"}
                    </Button>
                  </div>
                </div>
              </form>

              <p className="mt-5 text-xs text-muted/70">
                Créer un token :{" "}
                <a
                  href="https://github.com/settings/tokens/new?description=GitFolio&scopes=public_repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan hover:underline"
                >
                  github.com/settings/tokens
                </a>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
