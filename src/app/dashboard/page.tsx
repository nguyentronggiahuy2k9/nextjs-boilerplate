
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Banknote, Clock, History, Landmark, Smartphone } from 'lucide-react';
import { useUserBalance } from '@/contexts/balance-context';
import { useToast } from '@/hooks/use-toast';
import { MBBankLogo } from '@/components/icons/mbbank-logo';
import { MomoLogo } from '@/components/icons/momo-logo';

const MIN_WITHDRAWAL = 10000;


export default function DashboardPage() {
  const { balance, taskHistory, withdrawalHistory, requestWithdrawal } = useUserBalance();
  const { toast } = useToast();
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState<'Momo' | 'MB Bank'>('Momo');
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);

  const handleRequestWithdrawal = async () => {
    const amount = parseInt(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Số tiền không hợp lệ',
        description: 'Vui lòng nhập một số tiền hợp lệ.',
        variant: 'destructive',
      });
      return;
    }
    if (amount < MIN_WITHDRAWAL) {
         toast({
            title: 'Số tiền không đủ',
            description: `Bạn cần rút tối thiểu ${MIN_WITHDRAWAL.toLocaleString('vi-VN')}đ.`,
            variant: 'destructive',
        });
        return;
    }
    if (amount > balance) {
      toast({
        title: 'Số dư không đủ',
        description: 'Bạn không thể rút số tiền lớn hơn số dư hiện tại.',
        variant: 'destructive',
      });
      return;
    }

    const success = await requestWithdrawal(amount, withdrawalMethod);
    if (success) {
      toast({
        title: 'Yêu cầu thành công',
        description: `Yêu cầu rút ${amount.toLocaleString('vi-VN')}đ về ${withdrawalMethod} đã được gửi.`,
        className: "bg-accent text-accent-foreground"
      });
      setIsWithdrawDialogOpen(false);
      setWithdrawalAmount('');
    } else {
        toast({
            title: 'Yêu cầu thất bại',
            description: `Đã có lỗi xảy ra. Vui lòng thử lại.`,
            variant: "destructive"
          });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8">
        Tổng quan
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote />
              <span>Số dư của bạn</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {balance.toLocaleString('vi-VN')}đ
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Số tiền bạn đã kiếm được và có thể rút.
            </p>
          </CardContent>
          <CardFooter>
            <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
              <DialogTrigger asChild>
                <Button>Rút tiền</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Tạo yêu cầu rút tiền</DialogTitle>
                  <DialogDescription>
                    Số tiền rút tối thiểu là {MIN_WITHDRAWAL.toLocaleString('vi-VN')}đ. Tiền sẽ được gửi trong vòng 24 giờ.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Số tiền
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      className="col-span-3"
                      placeholder={`Ít nhất ${MIN_WITHDRAWAL.toLocaleString('vi-VN')}`}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="method" className="text-right">
                      Phương thức
                    </Label>
                    <Select
                      onValueChange={(value: 'Momo' | 'MB Bank') => setWithdrawalMethod(value)}
                      defaultValue={withdrawalMethod}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn phương thức thanh toán" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Momo">
                          <div className="flex items-center gap-2">
                            <MomoLogo className="h-5 w-5" />
                            <span>Ví Momo</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="MB Bank">
                          <div className="flex items-center gap-2">
                            <MBBankLogo className="h-5 w-5" />
                            <span>MB Bank</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleRequestWithdrawal}>
                    Xác nhận
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock />
              <span>Thống kê nhanh</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
             <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Nhiệm vụ đã hoàn thành</span>
                <span className="font-bold">{taskHistory.length}</span>
            </div>
             <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Lần rút tiền</span>
                <span className="font-bold">{withdrawalHistory.length}</span>
            </div>
             <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ngày tham gia</span>
                <span className="font-bold">28/10/2023</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History />
            <span>Lịch sử hoạt động</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tasks">
            <TabsList>
              <TabsTrigger value="tasks">Nhiệm vụ</TabsTrigger>
              <TabsTrigger value="withdrawals">Rút tiền</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã nhiệm vụ</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Phần thưởng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskHistory.length > 0 ? (
                    taskHistory.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.id}</TableCell>
                      <TableCell>{new Date(task.date).toLocaleDateString('vi-VN')}</TableCell>
                      <TableCell>
                          <span className="text-accent font-semibold">{task.status}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        {task.amount.toLocaleString('vi-VN')}đ
                      </TableCell>
                    </TableRow>
                  ))) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">Chưa có hoạt động nào.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="withdrawals">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã giao dịch</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Phương thức</TableHead>
                     <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Số tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawalHistory.length > 0 ? (
                    withdrawalHistory.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell className="font-medium">{w.id}</TableCell>
                      <TableCell>{new Date(w.date).toLocaleDateString('vi-VN')}</TableCell>
                      <TableCell>{w.method}</TableCell>
                       <TableCell>
                          <span className="text-accent font-semibold">{w.status}</span>
                       </TableCell>
                      <TableCell className="text-right">
                        {w.amount.toLocaleString('vi-VN')}đ
                      </TableCell>
                    </TableRow>
                  ))) : (
                     <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">Chưa có hoạt động nào.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
