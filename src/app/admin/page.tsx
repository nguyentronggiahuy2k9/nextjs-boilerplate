
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { Button } from "@/components/ui/button";
import { linkStats, pendingWithdrawals } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
    links: {
      label: "Links",
      color: "hsl(var(--primary))",
    },
}

export default function AdminPage() {
    const { toast } = useToast()

    const handleApprove = (id: string) => {
        toast({
            title: "Đã duyệt!",
            description: `Giao dịch ${id} đã được phê duyệt thành công.`,
            variant: "default",
            className: "bg-accent text-accent-foreground"
        })
    }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Thống kê lượt vượt link</CardTitle>
          <CardDescription>Thống kê trong 7 ngày gần nhất.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart accessibilityLayer data={linkStats}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="links" fill="var(--color-links)" radius={4} />
                </BarChart>
            </ChartContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Yêu cầu rút tiền</CardTitle>
          <CardDescription>Danh sách các yêu cầu đang chờ xử lý.</CardDescription>
        </CardHeader>
        <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người dùng</TableHead>
              <TableHead>Ngày</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Phương thức</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingWithdrawals.map((withdrawal) => (
              <TableRow key={withdrawal.id}>
                <TableCell className="font-medium">{withdrawal.user}</TableCell>
                <TableCell>{withdrawal.date}</TableCell>
                <TableCell>{withdrawal.amount}</TableCell>
                <TableCell>{withdrawal.method}</TableCell>
                <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => handleApprove(withdrawal.id)}>Duyệt</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </CardContent>
      </Card>
    </div>
  )
}
