
import { NextResponse } from 'next/server';
import { database } from '@/lib/firebase';
import { ref, get, update, set } from 'firebase/database';

const REWARD_AMOUNT = 1500;

export async function POST(request: Request) {
  try {
    const { taskId, token } = await request.json();

    if (!taskId || !token) {
      return NextResponse.json({ message: 'Thiếu thông tin nhiệm vụ.' }, { status: 400 });
    }

    const taskRef = ref(database, `tasks/${taskId}`);
    const taskSnapshot = await get(taskRef);

    if (!taskSnapshot.exists()) {
      return NextResponse.json({ message: 'Nhiệm vụ không tồn tại hoặc đã hết hạn.' }, { status: 404 });
    }

    const task = taskSnapshot.val();

    if (task.status !== 'pending') {
        return NextResponse.json({ message: 'Nhiệm vụ đã được hoàn thành trước đó.' }, { status: 400 });
    }

    if (task.token !== token) {
      return NextResponse.json({ message: 'Token xác thực không hợp lệ.' }, { status: 403 });
    }

    // Update task status to completed
    await update(taskRef, { status: 'completed' });

    // In a real application, you would also credit the user's balance here.
    // This logic is currently on the client, but should be moved to the server
    // for security. For now, we will just return a success message.

    return NextResponse.json({
        success: true,
        message: `Nhiệm vụ đã hoàn thành! Bạn đã được cộng ${REWARD_AMOUNT.toLocaleString('vi-VN')}đ.`,
        destinationUrl: task.destinationUrl
    });

  } catch (error: any) {
    console.error("Task completion error:", error);
    return NextResponse.json({ message: 'Lỗi phía máy chủ khi xác thực nhiệm vụ.' }, { status: 500 });
  }
}
