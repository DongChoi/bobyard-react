import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

/*NOTE: THIS IS MY NEW WAY TO GET SESSION INFORMATION DUE TO GETSERVERSESSION 
  NOT BEING COMPATIBLE WITH NEXT13 YET */
import { getToken } from "next-auth/jwt";
const prisma = new PrismaClient();

interface UpdateData {
  title?: string;
  description?: string;
  due_date?: Date;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  console.log("Attempting to delete task");
  const token = await getToken({ req, secret: process.env.NEXT_AUTHSECRET });
  const taskId = Number(params.taskId);
  console.log("Validating token");
  if (!token?.providerAccountId) {
    return NextResponse.json({
      status: "please log in before accessing our website :)",
    });
  }
  try {
    //validate user in db
    const user = await getUser(String(token.providerAccountId));
    const targetTask = await getTask(taskId);
    if (!user) {
      return NextResponse.json({
        status: "User Not Found",
      });
    }

    if (user.id !== targetTask?.userId) {
      return NextResponse.json({
        status: "You do not own the task or task does not exist.",
      });
    }
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const token = await getToken({ req, secret: process.env.NEXT_AUTHSECRET });
  console.log("Attempting to update task");

  const taskId = Number(params.taskId);
  const data = await req.json();
  const taskPayload = data.taskPayload;
  // initialize sanitized payload
  if (!token?.providerAccountId) {
    return NextResponse.json({
      status: "please log in before accessing our website :)",
    });
  }
  if (taskPayload.stringToday && taskPayload.finished) {
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {},
    });
  } else if (taskPayload.stringToday && !taskPayload.finished) {
  }

  try {
    const user = await getUser(String(token.providerAccountId));
    const targetTask = await getTask(taskId);
    // check if user exists
    if (!user) {
      return NextResponse.json({
        status: "User Not Found",
      });
    }
    // check if user is owner of task
    if (user.id !== targetTask?.userId) {
      return NextResponse.json({
        status: "You do not own the task or task does not exist.",
      });
    }
    const sanitizedPayload = sanitizePayload(taskPayload);
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      //sanitizing data
      data: sanitizedPayload,
    });

    console.log("task updated, here is the response: \n", updatedTask);
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

/****************************** Helper Functions ******************************/
async function getUser(providerAccountId: string) {
  const user = await prisma.user.findUnique({
    where: {
      providerAccountId: providerAccountId,
    },
  });
  return user;
}
async function getTask(taskId: number) {
  const targetTask = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });
  return targetTask;
}

function sanitizePayload(taskPayload: UpdateData) {
  const updateData: UpdateData = {};
  if (taskPayload.title) {
    updateData.title = taskPayload.title;
  }

  if (taskPayload.description) {
    updateData.description = taskPayload.description;
  }

  if (taskPayload.due_date) {
    updateData.due_date = taskPayload.due_date;
  }
  return updateData;
}
