import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getDashboard, getMyListings, formatPrice, timeAgo } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const token = session.user.accessToken;

  const [dash, listings] = await Promise.all([
    getDashboard(token).catch(() => null),
    getMyListings(token).catch(() => []),
  ]);

  const stats = dash?.stats ?? { active: 0, sold: 0, paused: 0 };
  const total = stats.active + stats.sold + stats.paused;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">Mon espace</h1>
          <p className="text-gray-400 mt-1">Bonjour, {session.user?.name} 👋</p>
        </div>
        <Link
          href="/annonces/new"
          className="bg-orange-500 text-white px-5 py-2.5 rounded-full font-bold hover:bg-orange-600 transition shadow"
        >
          + Nouvelle annonce
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total annonces", value: total, color: "text-gray-800", bg: "bg-white" },
          { label: "Actives", value: stats.active, color: "text-green-600", bg: "bg-green-50" },
          { label: "Vendues", value: stats.sold, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Messages non lus", value: dash?.unreadMessages ?? 0, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl border border-gray-100 p-5 text-center shadow-sm`}>
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {[
          { href: "/messages", icon: "💬", label: "Messages" },
          { href: "/annonces/new", icon: "📝", label: "Déposer" },
          { href: "/annonces?status=ACTIVE", icon: "🔍", label: "Parcourir" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white border border-gray-100 rounded-2xl p-4 text-center hover:border-orange-300 hover:shadow-md transition group"
          >
            <div className="text-2xl mb-1">{item.icon}</div>
            <p className="text-sm font-medium text-gray-600 group-hover:text-orange-500">{item.label}</p>
          </Link>
        ))}
      </div>

      {/* My listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Mes annonces</h2>
          <Link href="/annonces/new" className="text-sm text-orange-500 font-semibold hover:underline">
            + Nouvelle
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 font-medium">Vous n&apos;avez aucune annonce</p>
            <Link href="/annonces/new" className="mt-4 inline-block bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition">
              Déposer ma première annonce
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((l) => (
              <div
                key={l.id}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-lg shrink-0">
                    {l.category.icon}
                  </div>
                  <div className="min-w-0">
                    <Link href={`/annonces/${l.id}`} className="font-semibold text-gray-800 hover:text-orange-500 transition text-sm truncate block">
                      {l.title}
                    </Link>
                    <p className="text-xs text-gray-400">
                      {formatPrice(l.price)} · {l.location} · {timeAgo(l.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    l.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                    l.status === "SOLD" ? "bg-gray-100 text-gray-500" :
                    "bg-yellow-100 text-yellow-600"
                  }`}>
                    {l.status === "ACTIVE" ? "Actif" : l.status === "SOLD" ? "Vendu" : "Pausé"}
                  </span>
                  <Link
                    href={`/annonces/${l.id}/edit`}
                    className="text-xs text-gray-400 hover:text-orange-500 border border-gray-200 rounded-lg px-2 py-1 hover:border-orange-300 transition"
                  >
                    Modifier
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
