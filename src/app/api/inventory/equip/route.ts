// src/app/api/inventory/equip/route.ts
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

    const inventoryEntry = await prisma.userInventory.findUnique({
      where: {
        userId_itemId: {
          userId: user.id,
          itemId,
        },
      },
      include: { item: true },
    });

    if (!inventoryEntry) {
      return NextResponse.json(
        { error: "Item not found in your inventory" },
        { status: 404 }
      );
    }

    const itemCategory = inventoryEntry.item.category;
    const targetEquippedState = !inventoryEntry.isEquipped;

    // If equipping, unequip any other item of the exact same category first
    if (targetEquippedState) {
      const sameCategoryItems = await prisma.userInventory.findMany({
        where: {
          userId: user.id,
          item: { category: itemCategory },
        },
      });

      for (const other of sameCategoryItems) {
        if (other.itemId !== itemId && other.isEquipped) {
          await prisma.userInventory.update({
            where: { id: other.id },
            data: { isEquipped: false },
          });
        }
      }
    }

    const updatedEntry = await prisma.userInventory.update({
      where: { id: inventoryEntry.id },
      data: { isEquipped: targetEquippedState },
      include: { item: true },
    });

    // Refresh user's full inventory to send back
    const fullInventory = await prisma.userInventory.findMany({
      where: { userId: user.id },
      include: { item: true },
    });

    return NextResponse.json({
      success: true,
      message: targetEquippedState
        ? `Equipped ${inventoryEntry.item.name}!`
        : `Unequipped ${inventoryEntry.item.name}.`,
      item: updatedEntry.item,
      isEquipped: updatedEntry.isEquipped,
      inventory: fullInventory,
    });
  } catch (error: any) {
    console.error("Equip item error:", error);
    return NextResponse.json(
      { error: "Failed to equip equipment" },
      { status: 500 }
    );
  }
}
