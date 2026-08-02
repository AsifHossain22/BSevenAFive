import { Badge } from '@/components/ui/badge';

export type BookingStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'PAID'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

const statusConfig: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  REQUESTED: {
    label: 'Requested',
    className: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  ACCEPTED: {
    label: 'Accepted',
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  DECLINED: {
    label: 'Declined',
    className: 'bg-red-100 text-red-800 border-red-300',
  },
  PAID: {
    label: 'Paid',
    className: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-zinc-100 text-zinc-800 border-zinc-300',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-rose-900 text-rose-100 border-rose-900',
  },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const config = statusConfig[status] || { label: status, className: '' };

  return (
    <Badge
      variant="outline"
      className={`font-semibold text-xs px-2.5 py-0.5 ${config.className}`}
    >
      {config.label}
    </Badge>
  );
}
