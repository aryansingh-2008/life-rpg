// src/app/api/shop/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    const shopItems = await prisma.shopItem.findMany({
      orderBy: [{ cost: "asc" }],
    });

    const userItemMap: Record<string, { owned: boolean; isEquipped: boolean }> = {};

    if (user) {
      const userInventory = await prisma.userInventory.findMany({
        where: { userId: user.id },
      });
      userInventory.forEach((inv) => {
        userItemMap[inv.itemId] = {
          owned: true,
          isEquipped: inv.isEquipped,
        };
      });
    }

    const itemsWithStatus = shopItems.map((item) => ({
      ...item,
      owned: !!userItemMap[item.id]?.owned,
      isEquipped: !!userItemMap[item.id]?.isEquipped,
    }));

    return NextResponse.json({ success: true, items: itemsWithStatus });
  } catch (error: any) {
    console.error("Shop items error:", error);
    return NextResponse.json(
      { error: "Failed to fetch shop armory" },
      { status: 500 }
    );
  }
}
