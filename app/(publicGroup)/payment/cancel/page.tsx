import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardContent className="p-8 space-y-4">
          <XCircle className="w-16 h-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold">Payment Cancelled</h1>
          <p className="text-sm text-muted-foreground">
            The payment process was cancelled or interrupted. You can try paying
            again from your booking dashboard.
          </p>
          <div className="pt-4 flex flex-col gap-2">
            <Button asChild>
              <Link href="/dashboard/customer-dashboard/bookings">
                Return to Bookings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
