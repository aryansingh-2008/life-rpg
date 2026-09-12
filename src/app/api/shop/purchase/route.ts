// src/app/api/shop/purchase/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 });
    }

    const item = await prisma.shopItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Check if user already owns this item
    const alreadyOwns = await prisma.userInventory.findUnique({
      where: {
        userId_itemId: {
          userId: user.id,
          itemId: item.id,
        },
      },
    });

    if (alreadyOwns && item.category !== "POTION") {
      return NextResponse.json(
        { error: "You already possess this equipment in your armory" },
        { status: 400 }
      );
    }

    // Anti-Cheat: Validate gold authoritatively on server
    if (user.gold < item.cost) {
      return NextResponse.json(
        { error: `Insufficient Gold! Need ${item.cost}g, but you only have ${user.gold}g.` },
        { status: 400 }
      );
    }

    // Process purchase transaction
    const [updatedUser, inventoryEntry] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          gold: user.gold - item.cost,
        },
      }),
      prisma.userInventory.upsert({
        where: {
          userId_itemId: {
            userId: user.id,
            itemId: item.id,
          },
        },
        create: {
          userId: user.id,
          itemId: item.id,
          isEquipped: false,
        },
        update: {
          // If potion, keep entry
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `Acquired ${item.name}!`,
      remainingGold: updatedUser.gold,
      inventoryEntry,
      item,
    });
  } catch (error: any) {
    console.error("Purchase error:", error);
    return NextResponse.json(
      { error: "Failed to complete transaction" },
      { status: 500 }
    );
  }
}
