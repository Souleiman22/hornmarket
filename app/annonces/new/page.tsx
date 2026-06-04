"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { createListing, getCategories, type Category } from "@/lib/api";
import { COUNTRIES } from "@/lib/countries";

export default function NewListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "SN",
    categoryId: "",
  });

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-5xl mb-4">🔒</p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Connexion requise</h2>
        <p className="text-gray-500 mb-6">Vous devez être connecté pour déposer une annonce.</p>
        <Link href="/login" className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-orange-600 transition">
          Se connecter
        </Link>
      </div>
    );
  }

  function addImageUrl() {
    setImageUrls((prev) => [...prev, ""]);
  }

  function updateImageUrl(idx: number, val: string) {
    setImageUrls((prev) => prev.map((u, i) => (i === idx ? val : u)));
  }

  function removeImageUrl(idx: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const images = imageUrls.filter((u) => u.trim() !== "");

    try {
      const listing = await createListing(
        {
          title: form.title,
          description: form.description,
          price: Number(form.price),
          location: form.location,
          country: form.country,
          categoryId: form.categoryId,
          images,
        },
        session!.user.accessToken,
      );
      router.push(`/annonces/${listing.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link href="/annonces" className="text-sm text-gray-400 hover:text-orange-500 transition mb-4 inline-block">
          ← Retour aux annonces
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-800">Déposer une annonce</h1>
        <p className="text-gray-400 mt-1">Remplissez les informations ci-dessous — c&apos;est gratuit !</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Titre de l&apos;annonce <span className="text-orange-500">*</span>
          </label>
          <input
            type="text"
            required
            minLength={3}
            maxLength={200}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ex: iPhone 14 Pro Max 256Go — Excellent état"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Catégorie <span className="text-orange-500">*</span>
          </label>
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
          >
            <option value="">Choisir une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Description <span className="text-orange-500">*</span>
          </label>
          <textarea
            required
            minLength={10}
            rows={6}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Décrivez votre article en détail : état, caractéristiques, raison de la vente..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none transition"
          />
          <p className="text-xs text-gray-400 mt-1">{form.description.length} / 5000 caractères</p>
        </div>

        {/* Price & Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Prix (FCFA) <span className="text-orange-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="1"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Localisation <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Dakar, Abidjan..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
            />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pays</label>
          <select
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Photos (URLs)
          </label>
          <div className="space-y-2">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateImageUrl(idx, e.target.value)}
                  placeholder="https://exemple.com/photo.jpg"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageUrl(idx)}
                    className="text-gray-400 hover:text-red-500 transition px-2"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          {imageUrls.length < 10 && (
            <button
              type="button"
              onClick={addImageUrl}
              className="mt-2 text-sm text-orange-500 hover:underline"
            >
              + Ajouter une photo
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-bold text-base hover:bg-orange-600 disabled:opacity-50 transition shadow"
        >
          {loading ? "Publication en cours…" : "Publier l'annonce →"}
        </button>
      </form>
    </div>
  );
}
