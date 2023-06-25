import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Session, getServerSession } from "next-auth";
import { NextApiRequest } from "next";

const prisma = new PrismaClient();

// interface Task {
//     id?: number;
//     title: String;
//     description: String;
//     userId?: number;
//     created_at: Date;
//     due_date: Date;
//     updatedAt: Date;
//     finished_date: Date;
//   }

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log("data", data);
  const session = data.session;
  const task = data.taskData;
  console.log("task", task);
  if (session === undefined) {
    return NextResponse.json({
      status: "please log in before accessing our website :)",
    });
  } else {
    try {
      console.log("session test case passed in api/tasks");
      const user = await prisma.user.findUnique({
        where: {
          providerAccountId: session.providerAccountId,
        },
        include: {
          tasks: true,
        },
      });
      console.log("user fetched in tasks", user);
      await prisma.$disconnect();
      if (!user) {
        return NextResponse.json({
          status: "please log in before accessing our website :)",
        });
      } else {
        console.log("user was found", task);
        const newTask = await prisma.task.create({
          data: {
            title: task.title,
            description: task.description,
            due_date: task.due_date,
            user: {
              connect: {
                id: task.userId,
              },
            },
          },
        });
        console.log("newTask", newTask);
        return NextResponse.json({
          status: "Successfully created task!!",
          newTask,
        });
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
