import { getListing, parseImages, formatPrice, timeAgo } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import FavoriteButton from "@/components/FavoriteButton";
import MapViewWrapper from "@/components/MapViewWrapper";
import { getCountryName } from "@/lib/countries";

export const revalidate = 0;

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const listing = await getListing(id).catch(() => null);
  if (!listing) notFound();

  const images = parseImages(listing.images);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 dark:text-gray-500 mb-6 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-orange-500 transition">Accueil</Link>
        <span>/</span>
        <Link href="/annonces" className="hover:text-orange-500 transition">Annonces</Link>
        <span>/</span>
        <Link href={`/annonces?categoryId=${listing.category.id}`} className="hover:text-orange-500 transition">
          {listing.category.icon} {listing.category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-600 dark:text-gray-400 truncate max-w-[200px]">{listing.title}</span>
      </nav>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left: images + details */}
        <div className="md:col-span-2 space-y-4">
          {/* Image gallery */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
            {images.length > 0 ? (
              <>
                <div className="relative h-72 md:h-96">
                  <Image
                    src={images[0]}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                  />
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto border-t border-gray-100 dark:border-gray-800">
                    {images.slice(1).map((img, i) => (
                      <div key={i} className="relative h-16 w-20 shrink-0 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                        <Image src={img} alt="" fill className="object-cover" unoptimized />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="h-72 bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center text-gray-300 dark:text-gray-600">
                <span className="text-6xl">{listing.category.icon}</span>
                <p className="text-sm mt-2">Pas de photo</p>
              </div>
            )}
          </div>

          {/* Listing info */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{listing.title}</h1>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${listing.status === "ACTIVE" ? "bg-green-100 text-green-700" : listing.status === "SOLD" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>
                {listing.status === "ACTIVE" ? "Disponible" : listing.status === "SOLD" ? "Vendu" : "En pause"}
              </span>
            </div>

            <p className="text-4xl font-extrabold text-orange-500 mb-4">{formatPrice(listing.price)}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <span className="flex items-center gap-1">📍 {listing.location}</span>
              {listing.country && (
                <span className="flex items-center gap-1">🌍 {getCountryName(listing.country)}</span>
              )}
              <span className="flex items-center gap-1">🕐 {timeAgo(listing.createdAt)}</span>
              <span className="flex items-center gap-1">💬 {listing._count.messages} message{listing._count.messages !== 1 ? "s" : ""}</span>
            </div>

            <div className="mb-6">
              <FavoriteButton listingId={listing.id} />
            </div>

            <h2 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Description</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap text-sm">{listing.description}</p>
          </div>

          {/* Map */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="font-bold text-gray-800 dark:text-gray-200 mb-3">📍 Localisation sur la carte</h2>
            <MapViewWrapper location={listing.location} />
          </div>
        </div>

        {/* Right: seller + contact */}
        <div className="space-y-4">
          {/* Seller */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Vendeur</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg">
                {listing.user.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <Link href={`/profile/${listing.user.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-orange-500 transition">
                  {listing.user.name ?? "Anonyme"}
                </Link>
                {listing.user.location && (
                  <p className="text-xs text-gray-400">📍 {listing.user.location}</p>
                )}
              </div>
            </div>

            {listing.user.phone && (
              <a
                href={`tel:${listing.user.phone}`}
                className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-green-600 transition mb-2"
              >
                📞 Appeler le vendeur
              </a>
            )}
            <Link
              href={`/profile/${listing.user.id}`}
              className="w-full flex items-center justify-center gap-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 py-2.5 rounded-xl text-sm font-medium hover:border-orange-300 hover:text-orange-500 transition"
            >
              Voir le profil →
            </Link>
          </div>

          {/* Contact form */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Envoyer un message</h3>
            <ContactForm listingId={listing.id} />
          </div>

          {/* Safety tip */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-2xl p-4">
            <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold mb-1">🛡️ Conseils de sécurité</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
              Ne payez jamais à l&apos;avance. Préférez les transactions en personne dans un lieu public.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
