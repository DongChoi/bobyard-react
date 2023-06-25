import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Session, getServerSession } from "next-auth";
import { NextApiRequest } from "next";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();
  const session = data.session;
  // This doesn't work

  if (session === undefined) {
    return NextResponse.json({
      status: "please log in before accessing our website :)",
    });
  } else {
    try {
      const user = await prisma.user.findUnique({
        where: {
          providerAccountId: session.providerAccountId,
        },
        include: {
          tasks: true,
        },
      });

      if (!user) {
        const newUser = await prisma.user.create({
          data: {
            name: session.name,
            providerAccountId: session.providerAccountId,
            profilePicture: session.image,
          },
        });
        await prisma.$disconnect();
        return NextResponse.json({
          status: "Successfully signed up!!",
          newUser,
        });
      } else {
        return NextResponse.json({ status: "Log in Successful!!", user });
      }
    } catch (e) {
      return NextResponse.json({
        error: e,
        message:
          "something went wrong in the application, report how to replicate this issue",
      });
    }
  }
}
