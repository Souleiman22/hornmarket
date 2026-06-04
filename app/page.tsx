import Link from "next/link";
import Image from "next/image";
import { getListings, getCategories } from "@/lib/api";
import ListingCard from "@/components/ListingCard";
import { getCategoryImage } from "@/lib/categoryImages";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [listingsRes, categories] = await Promise.all([
    getListings({ limit: 8, sort: "newest" }).catch(() => ({ data: [], meta: { total: 0, page: 1, limit: 8, totalPages: 0 } })),
    getCategories().catch(() => []),
  ]);

  const listings = listingsRes.data;

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Achetez et vendez
            <br />
            <span className="text-orange-100">près de chez vous</span>
          </h1>
          <p className="text-orange-100 text-lg mb-10 max-w-xl mx-auto">
            Des milliers d&apos;annonces dans votre région — gratuitement et en toute confiance.
          </p>

          <form
            action="/annonces"
            method="GET"
            className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-2xl"
          >
            <input
              type="text"
              name="search"
              placeholder="Que recherchez-vous ?"
              className="flex-1 px-4 py-3 text-gray-700 outline-none rounded-xl text-sm"
            />
            <input
              type="text"
              name="location"
              placeholder="Ville ou région"
              className="sm:w-40 px-4 py-3 text-gray-700 outline-none rounded-xl border-t sm:border-t-0 sm:border-l border-gray-100 text-sm"
            />
            <button
              type="submit"
              className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition text-sm whitespace-nowrap"
            >
              Rechercher
            </button>
          </form>

          <p className="text-orange-200 text-xs mt-4">
            {listingsRes.meta.total.toLocaleString("fr-FR")} annonces disponibles
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Catégories</h2>
          <Link href="/annonces" className="text-orange-500 text-sm font-medium hover:underline">
            Toutes →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/annonces?categoryId=${cat.id}`}
              className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 aspect-video"
            >
              <Image
                src={getCategoryImage(cat.slug)}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-bold text-sm drop-shadow">{cat.name}</p>
                {cat._count.listings > 0 && (
                  <p className="text-orange-300 text-xs mt-0.5">{cat._count.listings} annonce{cat._count.listings !== 1 ? "s" : ""}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent listings */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Dernières annonces</h2>
          <Link href="/annonces" className="text-orange-500 text-sm font-medium hover:underline">
            Voir tout →
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-500 text-lg font-medium">Aucune annonce pour le moment</p>
            <p className="text-gray-400 text-sm mb-6">Soyez le premier à déposer une annonce !</p>
            <Link
              href="/annonces/new"
              className="inline-block bg-orange-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-orange-600 transition"
            >
              Déposer la première annonce
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>


      {/* CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-14 px-4 text-center text-white">
        <h2 className="text-3xl font-extrabold mb-2">Vous avez quelque chose à vendre ?</h2>
        <p className="text-orange-100 mb-8 max-w-md mx-auto">
          Déposez votre annonce en quelques minutes — c&apos;est totalement gratuit !
        </p>
        <Link
          href="/annonces/new"
          className="inline-block bg-white text-orange-500 px-8 py-3 rounded-full font-bold text-base hover:bg-orange-50 transition shadow-lg"
        >
          Déposer une annonce →
        </Link>
      </section>
    </div>
  );
}
