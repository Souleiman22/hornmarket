"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { addFavorite, removeFavorite, checkFavorite } from "@/lib/api";

export default function FavoriteButton({ listingId }: { listingId: string }) {
  const { data: session } = useSession();
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user?.accessToken) return;
    checkFavorite(listingId, session.user.accessToken)
      .then((r) => setIsFav(r.isFavorite))
      .catch(() => {});
  }, [listingId, session]);

  const toggle = async () => {
    if (!session?.user?.accessToken) return;
    setLoading(true);
    try {
      if (isFav) {
        await removeFavorite(listingId, session.user.accessToken);
        setIsFav(false);
      } else {
        await addFavorite(listingId, session.user.accessToken);
        setIsFav(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-medium transition-all ${
        isFav
          ? "border-red-400 bg-red-50 text-red-500 dark:bg-red-950 dark:border-red-600"
          : "border-gray-200 bg-white text-gray-600 hover:border-red-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
      }`}
    >
      <span className="text-xl">{isFav ? "❤️" : "🤍"}</span>
      <span>{isFav ? "Retirer des favoris" : "Ajouter aux favoris"}</span>
    </button>
  );
}
