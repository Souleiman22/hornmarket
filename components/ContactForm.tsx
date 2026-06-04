"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { sendMessage } from "@/lib/api";

export default function ContactForm({ listingId }: { listingId: string }) {
  const { data: session } = useSession();
  const [message, setMessage] = useState("Bonjour, est-ce encore disponible ?");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!session) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-600 mb-3">Connectez-vous pour contacter le vendeur</p>
        <Link
          href="/login"
          className="inline-block bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <p className="text-2xl mb-1">✅</p>
        <p className="text-sm text-green-700 font-medium">Message envoyé au vendeur !</p>
        <Link href="/messages" className="text-sm text-orange-500 hover:underline mt-1 inline-block">
          Voir mes messages →
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await sendMessage({ listingId, content: message }, session!.user.accessToken);
      setSent(true);
    } catch {
      setError("Erreur lors de l'envoi. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300"
        required
        minLength={1}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={loading || !message.trim()}
        className="w-full bg-orange-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 disabled:opacity-50 transition"
      >
        {loading ? "Envoi en cours…" : "Envoyer un message"}
      </button>
    </form>
  );
}
