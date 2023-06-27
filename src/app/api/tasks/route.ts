import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Session, getServerSession } from "next-auth";
import { NextApiRequest } from "next";
import { cookies } from "next/headers";

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
  // const cookieStore = cookies();
  // const token = cookieStore.get("token");
  // console.log("cookies", token.value);
  const data = await req.json();
  console.log("data", data);
  const session = data.session;
  const task = data.taskData;
  console.log("task", task, "\n SESSION:", session);
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
      // await prisma.$disconnect();
      if (!user) {
        return NextResponse.json({
          status: "please log in before accessing our website :)",
        });
      } else {
        console.log("user was found", task);
        const newTask = await prisma.task.create({
          //
          data: {
            title: task.title,
            description: task.description,
            due_date: new Date(task.due_date),
            userId: task.userId,
            // user: {
            //   connect: {
            //     id: task.userId,
            //   },
            // },
          },
        });
        console.log("newTask", newTask);
        return NextResponse.json({
          status: "Successfully created task!!",
          newTask,
        });
      }
    } catch (e) {
      console.log(e);
      return NextResponse.json({
        error: e,
        message:
          "something went wrong in the application, report how to replicate this issue",
      });
    }
  }
}

export async function DELETE(req: NextRequest) {
  const data = await req.json();
  const taskId = data.taskId;
  console.log("Attempting to delete taske");
  try {
    const deletedTask = await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    console.log("task deleted, here is the response: \n", deletedTask);
    await prisma.$disconnect();
    return NextResponse.json({
      status: "Successfully created task!!",
      deletedTask,
    });
  } catch (e) {
    console.log("ut-oh, something went wrong when deleting the task!", e);
    return NextResponse.json({
      error: e,
      message:
        "something went wrong in the application, report how to replicate this issue",
    });
  }
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  const taskId = data.taskId;
  const taskPayload = data.Payload;
  console.log("Attempting to delete taske");
  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      //if i wanted to i can sanitize the data.
      data: taskPayload,
    });

    console.log("task deleted, here is the response: \n", updatedTask);
    await prisma.$disconnect();
    return NextResponse.json({
      status: "Successfully created task!!",
      updatedTask,
    });
  } catch (e) {
    console.log("ut-oh, something went wrong when updating the task!", e);
    return NextResponse.json({
      error: e,
      message:
        "something went wrong in the application, report how to replicate this issue",
    });
  }
}
