import { getUser } from '@/service/getUser';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, ArrowDownRight } from 'lucide-react';
import { IPayment, IUserProfileResponse } from '@/lib/types';

async function getEarningsHistory(): Promise<IPayment[]> {
  return [
    {
      id: 'PAY-501',
      bookingId: 'JOB-2002',
      amount: 800,
      status: 'PAID',
      transactionId: 'TXN-992014',
      paymentMethod: 'bKash',
      createdAt: '2026-08-02',
      updatedAt: '2026-08-02',
      booking: {
        id: 'JOB-2002',
        customerId: 'customer-2',
        technicianId: 'tech-1',
        serviceId: 'srv-2',
        service: {
          id: 'srv-2',
          title: 'Plumbing Repair & Pipe Leakage',
          description: '',
          price: 800,
          categoryId: 'cat-2',
          createdAt: '',
          updatedAt: '',
        },
        status: 'COMPLETED',
        bookingDate: '2026-08-02',
        slotTime: '03:00 PM',
        totalAmount: 800,
        createdAt: '',
        updatedAt: '',
      },
    },
  ];
}

export default async function TechnicianEarningsPage() {
  const userRes: IUserProfileResponse | null = await getUser();
  if (!userRes?.data?.profile) redirect('/');

  const earnings = await getEarningsHistory();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Earnings & Payouts
        </h1>
        <p className="text-sm text-muted-foreground">
          Track your completed job earnings and payout transactions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" /> Payment Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 border-b">
                <tr>
                  <th className="p-3">Payment ID</th>
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {earnings.map(e => (
                  <tr key={e.id} className="hover:bg-muted/20">
                    <td className="p-3 font-medium">{e.id}</td>
                    <td className="p-3 text-muted-foreground font-mono text-xs">
                      {e.transactionId}
                    </td>
                    <td className="p-3">
                      {e.booking?.service?.title || 'N/A'}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {e.paymentMethod}
                    </td>
                    <td className="p-3 font-semibold text-green-600">
                      ${e.amount}
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                        <ArrowDownRight className="w-3.5 h-3.5" /> {e.status}
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
