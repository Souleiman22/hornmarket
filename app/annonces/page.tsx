import { getListings, getCategories } from "@/lib/api";
import ListingCard from "@/components/ListingCard";
import Link from "next/link";
import Image from "next/image";
import { getCategoryImage } from "@/lib/categoryImages";
import { COUNTRIES } from "@/lib/countries";

export const dynamic = "force-dynamic";

interface SearchParams {
  search?: string;
  categoryId?: string;
  location?: string;
  country?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc";
  page?: string;
}

export default async function AnnoncesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);

  const [res, categories] = await Promise.all([
    getListings({
      search: params.search,
      categoryId: params.categoryId,
      location: params.location,
      country: params.country,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      sort: params.sort ?? "newest",
      page,
      limit: 12,
    }).catch(() => ({ data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0 } })),
    getCategories().catch(() => []),
  ]);

  const activeCategory = categories.find((c) => c.id === params.categoryId);

  const inputCls = "w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-gray-800 sticky top-20">
            <h2 className="font-bold text-gray-800 dark:text-white mb-4 text-lg">Filtres</h2>

            <form method="GET" className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">Recherche</label>
                <input name="search" defaultValue={params.search} placeholder="Mot-clé..." className={inputCls} />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">Ville</label>
                <input name="location" defaultValue={params.location} placeholder="Paris, Dakar..." className={inputCls} />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">Pays</label>
                <select name="country" defaultValue={params.country ?? ""} className={inputCls}>
                  <option value="">Tous les pays</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">Prix (FCFA)</label>
                <div className="flex gap-2">
                  <input name="minPrice" defaultValue={params.minPrice} placeholder="Min" type="number" min="0" className={`w-1/2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200`} />
                  <input name="maxPrice" defaultValue={params.maxPrice} placeholder="Max" type="number" min="0" className={`w-1/2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200`} />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">Trier par</label>
                <select name="sort" defaultValue={params.sort ?? "newest"} className={inputCls}>
                  <option value="newest">Plus récentes</option>
                  <option value="oldest">Plus anciennes</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-orange-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 transition">
                Appliquer
              </button>

              {Object.values(params).some(Boolean) && (
                <Link href="/annonces" className="block text-center text-sm text-gray-400 hover:text-orange-500 transition">
                  Réinitialiser les filtres
                </Link>
              )}
            </form>

            {/* Categories list */}
            <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-4">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Catégories</h3>
              <ul className="space-y-0.5">
                <li>
                  <Link href="/annonces" className={`text-sm px-3 py-1.5 rounded-lg block transition ${!params.categoryId ? "bg-orange-50 dark:bg-orange-950 text-orange-600 font-semibold" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                    Toutes les catégories
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/annonces?categoryId=${cat.id}`}
                      className={`text-sm px-2 py-1.5 rounded-lg flex items-center justify-between transition gap-2 ${params.categoryId === cat.id ? "bg-orange-50 dark:bg-orange-950 text-orange-600 font-semibold" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="relative w-6 h-6 rounded overflow-hidden shrink-0">
                          <Image src={getCategoryImage(cat.slug)} alt={cat.name} fill className="object-cover" unoptimized />
                        </span>
                        {cat.name}
                      </span>
                      <span className="text-xs text-gray-400 shrink-0">{cat._count.listings}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {activeCategory ? `${activeCategory.icon} ${activeCategory.name}` : "Toutes les annonces"}
              </h1>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                {res.meta.total.toLocaleString("fr-FR")} résultat{res.meta.total !== 1 ? "s" : ""}
              </p>
            </div>
            <Link href="/annonces/new" className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-600 transition shadow">
              + Déposer une annonce
            </Link>
          </div>

          {res.data.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Aucune annonce trouvée</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Essayez de modifier vos filtres</p>
              <Link href="/annonces" className="mt-4 inline-block text-orange-500 text-sm hover:underline">
                Voir toutes les annonces →
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {res.data.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>

              {/* Pagination */}
              {res.meta.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: res.meta.totalPages }, (_, i) => i + 1).map((p) => {
                    const sp = new URLSearchParams(params as Record<string, string>);
                    sp.set("page", String(p));
                    return (
                      <Link
                        key={p}
                        href={`/annonces?${sp}`}
                        className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition ${p === page ? "bg-orange-500 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300"}`}
                      >
                        {p}
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
