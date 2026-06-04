const API = process.env.API_URL ?? "http://localhost:4000/api";

type FetchOptions = {
  token?: string;
  method?: string;
  body?: unknown;
  cache?: RequestCache;
  tags?: string[];
};

async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { token, method = "GET", body, cache = "no-store", tags } = opts;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache,
    next: tags ? { tags } : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? "Request failed");
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Listings ────────────────────────────────────────────────────────────────

export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  country: string;
  images: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string; slug: string; icon: string };
  user: { id: string; name: string; image: string | null; phone: string | null; location: string | null };
  _count: { messages: number };
};

export type ListingsResponse = {
  data: Listing[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

export type ListingQuery = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  location?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc";
  status?: string;
};

export function getListings(query: ListingQuery = {}, token?: string) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => v !== undefined && params.set(k, String(v)));
  return apiFetch<ListingsResponse>(`/listings?${params}`, { token });
}

export function getListing(id: string, token?: string) {
  return apiFetch<Listing>(`/listings/${id}`, { token });
}

export function createListing(body: unknown, token: string) {
  return apiFetch<Listing>("/listings", { method: "POST", body, token });
}

export function updateListing(id: string, body: unknown, token: string) {
  return apiFetch<Listing>(`/listings/${id}`, { method: "PATCH", body, token });
}

export function deleteListing(id: string, token: string) {
  return apiFetch<void>(`/listings/${id}`, { method: "DELETE", token });
}

export function getMyListings(token: string) {
  return apiFetch<Listing[]>("/listings/mine", { token });
}

// ─── Categories ──────────────────────────────────────────────────────────────

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  _count: { listings: number };
};

export function getCategories() {
  return apiFetch<Category[]>("/categories", { cache: "no-store" });
}

export function getCategory(idOrSlug: string) {
  return apiFetch<Category>(`/categories/${idOrSlug}`);
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
};

export function registerUser(body: RegisterInput) {
  return apiFetch<{ user: { id: string }; accessToken: string; refreshToken: string }>(
    "/auth/register",
    { method: "POST", body },
  );
}

export function getMe(token: string) {
  return apiFetch<{
    id: string;
    name: string;
    email: string;
    phone: string | null;
    location: string | null;
    image: string | null;
    createdAt: string;
    _count: { listings: number };
  }>("/auth/me", { token });
}

// ─── Messages ────────────────────────────────────────────────────────────────

export type Message = {
  id: string;
  content: string;
  createdAt: string;
  read: boolean;
  sender: { id: string; name: string; image: string | null };
  listing?: { id: string; title: string };
};

export type ConversationsResponse = {
  owned: Array<{
    id: string;
    title: string;
    images: string;
    messages: Message[];
    _count: { messages: number };
  }>;
  sent: Array<{
    id: string;
    title: string;
    images: string;
    user: { id: string; name: string; image: string | null };
    messages: Message[];
  }>;
};

export function getMyConversations(token: string) {
  return apiFetch<ConversationsResponse>("/messages", { token });
}

export function getConversation(listingId: string, token: string) {
  return apiFetch<Message[]>(`/messages/${listingId}`, { token });
}

export function sendMessage(body: { listingId: string; content: string }, token: string) {
  return apiFetch<Message>("/messages", { method: "POST", body, token });
}

// ─── Users ───────────────────────────────────────────────────────────────────

export type PublicProfile = {
  id: string;
  name: string;
  image: string | null;
  location: string | null;
  createdAt: string;
  listings: Listing[];
  _count: { listings: number };
};

export type Dashboard = {
  user: { id: string; name: string; email: string; image: string | null; phone: string | null; location: string | null };
  stats: { active: number; sold: number; paused: number };
  unreadMessages: number;
};

export function getPublicProfile(id: string) {
  return apiFetch<PublicProfile>(`/users/${id}`);
}

export function getDashboard(token: string) {
  return apiFetch<Dashboard>("/users/dashboard", { token });
}

export function updateProfile(body: unknown, token: string) {
  return apiFetch("/users/profile", { method: "PATCH", body, token });
}

// ─── Favorites ───────────────────────────────────────────────────────────────

export function getFavorites(token: string) {
  return apiFetch<Listing[]>("/favorites", { token });
}

export function addFavorite(listingId: string, token: string) {
  return apiFetch<{ id: string }>("/favorites", { method: "POST", body: { listingId }, token });
}

export function removeFavorite(listingId: string, token: string) {
  return apiFetch<void>(`/favorites/${listingId}`, { method: "DELETE", token });
}

export function checkFavorite(listingId: string, token: string) {
  return apiFetch<{ isFavorite: boolean }>(`/favorites/${listingId}/check`, { token });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function parseImages(raw: string): string[] {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(price);
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `il y a ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `il y a ${days}j`;
  return new Date(dateStr).toLocaleDateString("fr-FR");
}
