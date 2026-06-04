import { getPublicProfile, formatPrice, timeAgo } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import ListingCard from "@/components/ListingCard";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getPublicProfile(id).catch(() => null);
  if (!profile) notFound();

  const memberSince = new Date(profile.createdAt).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-3xl font-extrabold text-orange-500 shrink-0">
          {profile.name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-extrabold text-gray-800">{profile.name}</h1>
          {profile.location && (
            <p className="text-gray-500 text-sm mt-1">📍 {profile.location}</p>
          )}
          <p className="text-gray-400 text-sm mt-1">Membre depuis {memberSince}</p>
          <div className="flex flex-wrap gap-4 mt-4 justify-center sm:justify-start">
            <div className="text-center">
              <p className="text-xl font-bold text-orange-500">{profile._count.listings}</p>
              <p className="text-xs text-gray-500">Annonce{profile._count.listings !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Annonces de {profile.name}
          <span className="text-base font-normal text-gray-400 ml-2">({profile.listings.length})</span>
        </h2>

        {profile.listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500">Ce vendeur n&apos;a pas encore d&apos;annonces actives.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {profile.listings.map((l) => (
              <ListingCard
                key={l.id}
                listing={{
                  ...l,
                  user: profile,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
