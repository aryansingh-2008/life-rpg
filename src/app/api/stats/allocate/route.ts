// src/app/api/stats/allocate/route.ts
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
    const { attribute } = body; // "STRENGTH" | "INTELLECT" | "AGILITY" | "VITALITY" | "SPIRIT"

    if (user.unspentPoints <= 0) {
      return NextResponse.json(
        { error: "No unspent stat points available. Level up to earn more!" },
        { status: 400 }
      );
    }

    const validAttrs = ["STRENGTH", "INTELLECT", "AGILITY", "VITALITY", "SPIRIT"];
    const attrUpper = (attribute || "").toUpperCase();

    if (!validAttrs.includes(attrUpper)) {
      return NextResponse.json(
        { error: "Invalid attribute specified" },
        { status: 400 }
      );
    }

    const updateData: any = {
      unspentPoints: user.unspentPoints - 1,
    };

    if (attrUpper === "STRENGTH") updateData.strength = user.strength + 1;
    if (attrUpper === "INTELLECT") updateData.intellect = user.intellect + 1;
    if (attrUpper === "AGILITY") updateData.agility = user.agility + 1;
    if (attrUpper === "VITALITY") updateData.vitality = user.vitality + 1;
    if (attrUpper === "SPIRIT") updateData.spirit = user.spirit + 1;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `Allocated +1 point to ${attrUpper}!`,
    });
  } catch (error: any) {
    console.error("Stat allocate error:", error);
    return NextResponse.json(
      { error: "Failed to allocate stat point" },
      { status: 500 }
    );
  }
}
