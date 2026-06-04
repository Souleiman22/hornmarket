import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getMyConversations, parseImages, timeAgo } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const conversations = await getMyConversations(session.user.accessToken).catch(() => ({
    owned: [],
    sent: [],
  }));

  const hasAny = conversations.owned.length > 0 || conversations.sent.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">Messages</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Vos conversations avec acheteurs et vendeurs</p>
        </div>
        <Link href="/dashboard" className="text-sm text-orange-500 hover:underline">← Mon espace</Link>
      </div>

      {!hasAny ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-16 text-center">
          <p className="text-5xl mb-4">💬</p>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Aucun message pour le moment</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Contactez un vendeur depuis une annonce pour démarrer une conversation.</p>
          <Link href="/annonces" className="mt-5 inline-block bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition">
            Parcourir les annonces
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {conversations.owned.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span>
                Messages reçus ({conversations.owned.reduce((acc, l) => acc + l._count.messages, 0)})
              </h2>
              <div className="space-y-2">
                {conversations.owned.map((listing) => {
                  const lastMsg = listing.messages[0];
                  const imgs = parseImages(listing.images);
                  return (
                    <Link
                      key={listing.id}
                      href={`/annonces/${listing.id}`}
                      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-4 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-800 transition shadow-sm group"
                    >
                      <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shrink-0">
                        {imgs[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={imgs[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-white text-sm truncate group-hover:text-orange-500 transition">{listing.title}</p>
                        {lastMsg && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                            <span className="font-semibold text-orange-500">{lastMsg.sender.name}</span>: {lastMsg.content}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 text-right flex flex-col items-end gap-1">
                        {listing._count.messages > 0 && (
                          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {listing._count.messages}
                          </span>
                        )}
                        {lastMsg && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">{timeAgo(lastMsg.createdAt)}</p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {conversations.sent.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
                Messages envoyés
              </h2>
              <div className="space-y-2">
                {conversations.sent.map((listing) => {
                  const lastMsg = listing.messages[0];
                  const imgs = parseImages(listing.images);
                  return (
                    <Link
                      key={listing.id}
                      href={`/annonces/${listing.id}`}
                      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-4 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-800 transition shadow-sm group"
                    >
                      <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shrink-0">
                        {imgs[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={imgs[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-white text-sm truncate group-hover:text-orange-500 transition">{listing.title}</p>
                        <p className="text-xs text-blue-500 dark:text-blue-400 mt-0.5">Vendeur : {listing.user.name}</p>
                        {lastMsg && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">Vous : {lastMsg.content}</p>
                        )}
                      </div>
                      {lastMsg && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{timeAgo(lastMsg.createdAt)}</p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
