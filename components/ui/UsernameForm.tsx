"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { motion } from "motion/react";
import { Button } from "./Button";

const schema = z.object({
  username: z
    .string()
    .min(1, "Username requis")
    .max(39, "Max 39 caractères")
    .regex(
      /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/,
      "Username GitHub invalide",
    ),
});

type FormData = z.infer<typeof schema>;

export function UsernameForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { username: "" },
  });

  const onSubmit = (data: FormData) => {
    setSubmitting(true);
    router.push(`/${data.username}`);
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="w-full max-w-xl"
    >
      <div className="glass rounded-2xl p-2 flex items-center gap-2">
        <span className="pl-3 text-muted font-mono">@</span>
        <input
          {...register("username")}
          placeholder="torvalds"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-transparent text-lg text-foreground placeholder:text-muted/50 focus:outline-none py-2"
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? "Chargement…" : "Générer"}
        </Button>
      </div>
      {errors.username && (
        <p className="mt-2 text-sm text-magenta">{errors.username.message}</p>
      )}
    </motion.form>
  );
}
