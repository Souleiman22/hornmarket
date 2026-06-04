import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { title, description, price, location, categorySlug } = await req.json();

  if (!title || !description || !price || !location || !categorySlug) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });

  const userId = (session.user as { id: string }).id;

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      price: parseFloat(price),
      location,
      categoryId: category.id,
      userId,
    },
  });

  return NextResponse.json(listing, { status: 201 });
}

export async function GET() {
  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    include: { category: true, user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(listings);
}
