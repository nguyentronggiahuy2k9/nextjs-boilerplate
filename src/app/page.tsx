import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, DollarSign, Gift, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full bg-primary text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
            NextJS Starter
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
            Nền tảng kiếm tiền online đơn giản và uy tín bằng cách vượt link rút gọn.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/register">Bắt đầu ngay</Link>
          </Button>
        </div>
      </section>

      <section id="how-it-works" className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center font-headline">
            Hoạt động như thế nào?
          </h2>
          <p className="mt-4 text-center text-muted-foreground max-w-xl mx-auto">
            Chỉ với 3 bước đơn giản để bắt đầu hành trình kiếm tiền của bạn.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mx-auto">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold font-headline">Đăng ký tài khoản</h3>
              <p className="mt-2 text-muted-foreground">
                Tạo tài khoản nhanh chóng và an toàn chỉ với một cú nhấp chuột qua Google.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mx-auto">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold font-headline">Hoàn thành nhiệm vụ</h3>
              <p className="mt-2 text-muted-foreground">
                Nhận và hoàn thành các nhiệm vụ vượt link đơn giản hàng ngày.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mx-auto">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold font-headline">Rút tiền</h3>
              <p className="mt-2 text-muted-foreground">
                Rút tiền về tài khoản ngân hàng hoặc ví Momo một cách nhanh chóng.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="w-full bg-muted py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center font-headline">
            Tại sao chọn chúng tôi?
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Zap className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">Nhiệm vụ tức thì</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nhận nhiệm vụ mới ngay lập tức, không cần chờ đợi.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <DollarSign className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">Thanh toán nhanh</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yêu cầu rút tiền được xử lý nhanh chóng và minh bạch.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">Đơn giản & Dễ dùng</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Giao diện thân thiện, dễ dàng sử dụng cho mọi người.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Gift className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">Min rút thấp</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Dễ dàng đạt được mức rút tiền tối thiểu để nhận thưởng.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
