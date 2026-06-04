"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getListing, updateListing, deleteListing, getCategories, parseImages, formatPrice, type Category, type Listing } from "@/lib/api";
import { use } from "react";

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [listing, setListing] = useState<Listing | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    categoryId: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([getListing(id), getCategories()]).then(([l, cats]) => {
      setListing(l);
      setCategories(cats);
      setForm({
        title: l.title,
        description: l.description,
        price: String(l.price),
        location: l.location,
        categoryId: l.category.id,
        status: l.status,
      });
      const imgs = parseImages(l.images);
      setImageUrls(imgs.length > 0 ? imgs : [""]);
    }).catch(() => router.push("/dashboard"));
  }, [id, status, router]);

  if (status === "loading" || !listing) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!session || session.user.id !== listing.user.id) {
    router.push("/dashboard");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const images = imageUrls.filter((u) => u.trim() !== "");
    try {
      await updateListing(id, {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        location: form.location,
        categoryId: form.categoryId,
        status: form.status,
        images,
      }, session!.user.accessToken);
      router.push(`/annonces/${id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Supprimer cette annonce définitivement ?")) return;
    setDeleting(true);
    try {
      await deleteListing(id, session!.user.accessToken);
      router.push("/dashboard");
    } catch {
      setError("Erreur lors de la suppression.");
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href={`/annonces/${id}`} className="text-sm text-gray-400 hover:text-orange-500 transition mb-2 inline-block">
            ← Voir l&apos;annonce
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-800">Modifier l&apos;annonce</h1>
          <p className="text-gray-400 text-sm mt-1">{formatPrice(listing.price)} · {listing.location}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Titre</label>
          <input
            type="text"
            required
            minLength={3}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Catégorie</label>
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
          <textarea
            required
            minLength={10}
            rows={6}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Prix (FCFA)</label>
            <input
              type="number"
              required
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Localisation</label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Statut</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <option value="ACTIVE">Disponible</option>
            <option value="SOLD">Vendu</option>
            <option value="PAUSED">En pause</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Photos (URLs)</label>
          <div className="space-y-2">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setImageUrls((p) => p.map((u, i) => i === idx ? e.target.value : u))}
                  placeholder="https://exemple.com/photo.jpg"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
                {imageUrls.length > 1 && (
                  <button type="button" onClick={() => setImageUrls((p) => p.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-500 px-2">✕</button>
                )}
              </div>
            ))}
          </div>
          {imageUrls.length < 10 && (
            <button type="button" onClick={() => setImageUrls((p) => [...p, ""])} className="mt-2 text-sm text-orange-500 hover:underline">
              + Ajouter une photo
            </button>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 disabled:opacity-50 transition"
          >
            {loading ? "Enregistrement…" : "Enregistrer les modifications"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-3 border border-red-200 text-red-500 rounded-xl font-medium hover:bg-red-50 disabled:opacity-50 transition text-sm"
          >
            {deleting ? "…" : "Supprimer"}
          </button>
        </div>
      </form>
    </div>
  );
}
