import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFavorites, type Listing } from "@/lib/api";
import ListingCard from "@/components/ListingCard";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/favorites");

  let listings: Listing[] = [];
  try {
    listings = await getFavorites(session.user.accessToken);
  } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">❤️ Mes favoris</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Les annonces que vous avez sauvegardées.</p>

      {listings.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🤍</div>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Aucun favori pour le moment</p>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Cliquez sur ❤️ sur une annonce pour la sauvegarder.</p>
          <Link href="/annonces" className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition">
            Parcourir les annonces →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
