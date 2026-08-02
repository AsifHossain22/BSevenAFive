import { Calendar, Clock, MapPin, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// FetchBookings
async function getCustomerBookings() {
  // TODO: APIServiceFromDB
  return [
    {
      id: 'BK-1001',
      serviceName: 'AC Deep Cleaning & Repair',
      category: 'HVAC Services',
      technicianName: 'Rahim Ahmed',
      date: '2026-08-10',
      timeSlot: '10:00 AM - 12:00 PM',
      address: 'Gulshan 2, Dhaka',
      amount: 1500,
      status: 'PENDING', // [PENDING, CONFIRMED, COMPLETED, CANCELLED]
      paymentStatus: 'PAID',
    },
    {
      id: 'BK-1002',
      serviceName: 'Plumbing Leakage Repair',
      category: 'Plumbing',
      technicianName: 'Karim Ullah',
      date: '2026-07-28',
      timeSlot: '02:00 PM - 04:00 PM',
      address: 'Dhanmondi 32, Dhaka',
      amount: 800,
      status: 'COMPLETED',
      paymentStatus: 'PAID',
    },
  ];
}

export default async function CustomerBookingsPage() {
  const bookings = await getCustomerBookings();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">
            Confirmed
          </Badge>
        );
      case 'COMPLETED':
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-200">
            Completed
          </Badge>
        );
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-sm text-muted-foreground">
          View and track all your service requests and appointment statuses.
        </p>
      </div>

      {bookings.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No bookings found. You have not booked any service yet.
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map(booking => (
            <Card key={booking.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 bg-muted/30">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-primary" />
                  <CardTitle className="text-base font-semibold">
                    {booking.serviceName}
                  </CardTitle>
                </div>
                {getStatusBadge(booking.status)}
              </CardHeader>
              <CardContent className="p-4 grid md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Booking ID</p>
                  <p className="font-medium">{booking.id}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Technician
                  </p>
                  <p className="font-medium">{booking.technicianName}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Scheduled Date
                  </p>
                  <p className="font-medium">{booking.date}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Time Slot
                  </p>
                  <p className="text-medium">{booking.timeSlot}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Location
                  </p>
                  <p className="font-medium truncate">{booking.address}</p>
                </div>

                <div className="flex flex-col justify-between items-start md:items-end">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Price</p>
                    <p className="text-lg font-bold text-primary">
                      ৳{booking.amount}
                    </p>
                  </div>
                  <Badge variant="outline" className="mt-2">
                    Payment: {booking.paymentStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
