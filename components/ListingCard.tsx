import Link from "next/link";
import Image from "next/image";
import { parseImages, formatPrice, timeAgo } from "@/lib/api";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    price: number;
    location: string;
    createdAt: string;
    images: string;
    category: { name: string; icon: string };
    user?: { name: string };
  };
}

export default function ListingCard({ listing }: ListingCardProps) {
  const images = parseImages(listing.images);
  const thumb = images[0];

  return (
    <Link
      href={`/annonces/${listing.id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {thumb ? (
          <Image
            src={thumb}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
            {listing.category.icon}
          </div>
        )}
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
          {listing.category.icon} {listing.category.name}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-orange-500 font-bold text-base">{formatPrice(listing.price)}</p>
        <h3 className="text-gray-800 font-medium text-sm leading-tight mt-0.5 line-clamp-2">{listing.title}</h3>
        <div className="flex items-center justify-between mt-auto pt-2 text-xs text-gray-400">
          <span className="truncate">📍 {listing.location}</span>
          <span className="shrink-0 ml-2">{timeAgo(listing.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
