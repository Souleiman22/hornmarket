import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { listingId, content } = await req.json();

  if (!listingId || !content) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  const userId = (session.user as { id: string }).id;

  const message = await prisma.message.create({
    data: { listingId, content, senderId: userId },
  });

  return NextResponse.json(message, { status: 201 });
}
