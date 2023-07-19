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
  console.log(params.taskId);
  const taskId = Number(params.taskId);
  const data = await req.json();
  const taskPayload = data.taskPayload;
  // initialize sanitized payload
  if (!token?.providerAccountId) {
    return NextResponse.json({
      status: "please log in before accessing our website :)",
    });
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
        status: "You do not own the task or the task does not exist.",
      });
    }
    console.log(
      "checking to see if this update request is to finish or unfinish task"
    );
    if (taskPayload.stringToday && taskPayload.finished) {
      console.log("---------String Today", taskPayload.stringToday);
      const updatedTask = await prisma.task.update({
        where: {
          id: taskId,
        },
        data: { finished_date: new Date(taskPayload.stringToday) },
      });
      return NextResponse.json({
        status: "Successfully finished task!!",
        updatedTask,
      });
    } else if (taskPayload.stringToday && !taskPayload.finished) {
      const updatedTask = await prisma.task.update({
        where: {
          id: taskId,
        },
        data: { finished_date: null },
      });
      return NextResponse.json({
        status: "Successfully unfinished task!!",
        updatedTask,
      });
    }
    console.log(
      "finish task check failed, proceeding to update res of the data in task"
    );
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
      status: "Successfully updated task!!",
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
    updateData.due_date = new Date(taskPayload.due_date);
  }
  return updateData;
}
