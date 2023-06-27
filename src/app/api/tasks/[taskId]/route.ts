import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function DELETE(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  console.log("Attempting to delete taske");
  try {
    const taskId = Number(params.taskId);

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
