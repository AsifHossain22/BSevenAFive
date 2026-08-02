import { CreditCard, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// FetchPayments
async function getPaymentHistory() {
  // TODO: APIServiceFromDB
  return [
    {
      id: 'TXN-982103',
      bookingId: 'BK-1001',
      serviceName: 'AC Deep Cleaning & Repair',
      amount: 1500,
      paymentMethod: 'bKash Online',
      date: '2026-08-01',
      status: 'PAID',
    },
    {
      id: 'TXN-871239',
      bookingId: 'BK-1002',
      serviceName: 'Plumbing Leakage Repair',
      amount: 800,
      paymentMethod: 'Credit Card',
      date: '2026-07-28',
      status: 'PAID',
    },
  ];
}

export default async function CustomerPaymentsPage() {
  const payments = await getPaymentHistory();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payment History</h1>
        <p className="text-sm text-muted-foreground">
          Review your transaction details and payment logs.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" /> Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 border-b">
                <tr>
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-muted/20">
                    <td className="p-3 font-medium">{p.id}</td>
                    <td className="p-3">{p.serviceName}</td>
                    <td className="p-3 text-muted-foreground">{p.date}</td>
                    <td className="p-3">{p.paymentMethod}</td>
                    <td className="p-3 font-semibold text-primary">
                      ৳{p.amount}
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {p.status}
                      </span>
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
