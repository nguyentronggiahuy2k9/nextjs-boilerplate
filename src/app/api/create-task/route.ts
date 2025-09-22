
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { database } from '@/lib/firebase';
import { ref, set } from 'firebase/database';

export async function POST() {
  const apiToken = process.env.LINK4M_API_TOKEN;
  const appDomain = 'https://studio-5845054210-9697a.web.app';
  const destinationUrl = '/';

  if (!apiToken) {
    console.error("LINK4M_API_TOKEN is not configured on the server.");
    return NextResponse.json(
      { message: 'Lỗi cấu hình phía máy chủ.' },
      { status: 500 }
    );
  }

  try {
    const taskId = uuidv4().substring(0, 8);
    const secretToken = uuidv4();

    const longUrl = encodeURIComponent(`${appDomain}/complete-task?id=${taskId}&token=${secretToken}`);
    
    const apiUrl = `https://link4m.co/api-shorten/v2?api=${apiToken}&url=${longUrl}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`link4m API request failed with status: ${response.status}`, errorText);
        throw new Error(`Dịch vụ rút gọn link gặp lỗi. Status: ${response.status}`);
    }
    
    const result = await response.json();

    if (result.status !== 'success' || !result.shortenedUrl) {
      console.error('link4m API error:', result.message);
      throw new Error(result.message || 'Lỗi không xác định từ dịch vụ rút gọn link');
    }

    const shortenedUrl = result.shortenedUrl;

    // Save the task details to Firebase Realtime Database
    const taskRef = ref(database, `tasks/${taskId}`);
    await set(taskRef, {
        id: taskId,
        token: secretToken, // Secret token for verification
        destinationUrl: destinationUrl,
        shortenedUrl: shortenedUrl,
        createdAt: new Date().toISOString(),
        status: 'pending' // Status to track completion
    });

    return NextResponse.json({
      taskId: taskId,
      shortenedUrl: shortenedUrl,
    });

  } catch (error: any) {
    console.error("Failed to create task:", error);
    return NextResponse.json(
      { message: error.message || 'Không thể tạo nhiệm vụ.' },
      { status: 500 }
    );
  }
}
