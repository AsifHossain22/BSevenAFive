import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ txnId?: string }>;
}) {
  const resolvedParams = await searchParams;
  const txnId = resolvedParams?.txnId;

  // Revalidate
  revalidatePath('/dashboard', 'layout');
  revalidatePath('/dashboard/customer-dashboard');
  revalidatePath('/dashboard/customer-dashboard/bookings');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-3xl font-bold">
        ✓
      </div>
      <h1 className="text-2xl font-bold text-gray-800">Payment Successful!</h1>
      {txnId && (
        <p className="text-gray-600 mt-2">
          Transaction ID:{' '}
          <span className="font-mono font-semibold text-gray-900">{txnId}</span>
        </p>
      )}

      <Link
        href="/dashboard/customer-dashboard/bookings"
        className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
