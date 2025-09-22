
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useUserBalance } from '@/contexts/balance-context';

type VerificationResult = {
    success: boolean;
    message: string;
    destinationUrl?: string;
};

const REWARD_AMOUNT = 1500;

export default function CompleteTaskPage() {
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addBalance, addTransaction } = useUserBalance();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const taskId = searchParams.get('id');
    const token = searchParams.get('token');

    if (!taskId || !token) {
        setVerificationResult({ success: false, message: 'Thiếu thông tin nhiệm vụ. Vui lòng thử lại.' });
        setIsLoading(false);
        return;
    }

    const verifyTask = async () => {
      try {
        const response = await fetch('/api/complete-task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ taskId, token }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // On successful verification from the server, update the client-side balance.
            addBalance(REWARD_AMOUNT);
            addTransaction({ amount: REWARD_AMOUNT });
            setVerificationResult(result);
        } else {
            setVerificationResult({ success: false, message: result.message || 'Xác thực không thành công.' });
        }
      } catch (error) {
        console.error('Verification failed:', error);
        setVerificationResult({ success: false, message: 'Đã xảy ra lỗi kết nối. Vui lòng thử lại.' });
      } finally {
        setIsLoading(false);
      }
    };

    verifyTask();

  }, [addBalance, addTransaction]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang xác thực nhiệm vụ của bạn...</p>
        </div>
      );
    }

    if (!verificationResult) {
      return null;
    }

    if (verificationResult.success) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <p className="text-lg font-medium">{verificationResult.message}</p>
          <Button asChild>
            <Link href={verificationResult.destinationUrl || '/dashboard'}>
              Về bảng điều khiển
            </Link>
          </Button>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <AlertCircle className="h-16 w-16 text-destructive" />
          <p className="text-lg font-medium">{verificationResult.message}</p>
           <Button asChild variant="destructive">
            <Link href="/tasks">
              Thử lại với nhiệm vụ khác
            </Link>
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Xác thực nhiệm vụ</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
