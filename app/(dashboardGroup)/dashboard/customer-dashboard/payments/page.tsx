import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IPayment } from '@/lib/types';

export default async function CustomerPaymentsPage() {
  // TODO: ReplaceWithDBQuery;
  const payments: IPayment[] = [
    {
      id: 'PAY-8821',
      bookingId: 'BK-101',
      amount: 85,
      status: 'PAID',
      transactionId: 'txn_3Mq129481923',
      paymentMethod: 'Stripe Credit Card',
      createdAt: '2026-08-01T10:00:00Z',
      updatedAt: '2026-08-01T10:00:00Z',
    },
    {
      id: 'PAY-8819',
      bookingId: 'BK-099',
      amount: 50,
      status: 'PAID',
      transactionId: 'SSL_COMMERZ_99182',
      paymentMethod: 'SSLCommerz',
      createdAt: '2026-07-28T14:30:00Z',
      updatedAt: '2026-07-28T14:30:00Z',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payment History</h1>
        <p className="text-sm text-muted-foreground">
          View all completed transactions and receipts.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
                <tr>
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-muted/20">
                    <td className="p-3 font-mono font-medium">
                      {p.transactionId}
                    </td>
                    <td className="p-3">{p.paymentMethod}</td>
                    <td className="p-3 font-bold">${p.amount}</td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      <Badge className="bg-emerald-600">{p.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
