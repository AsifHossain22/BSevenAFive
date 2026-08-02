/* eslint-disable react/no-unescaped-entities */
import { Star, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// FetchReviews
async function getCustomerReviews() {
  // TODO: APIServiceFromDB
  return [
    {
      id: 'REV-1',
      technicianName: 'Karim Ullah',
      serviceName: 'Plumbing Leakage Repair',
      rating: 5,
      comment:
        'Very professional worker. Fixed the pipeline leakage in under an hour!',
      date: '2026-07-29',
    },
  ];
}

export default async function CustomerReviewsPage() {
  const reviews = await getCustomerReviews();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Reviews</h1>
        <p className="text-sm text-muted-foreground">
          Ratings and feedback you provided to service technicians.
        </p>
      </div>

      {reviews.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          You have not posted any reviews yet.
        </Card>
      ) : (
        <div className="grid gap-4">
          {reviews.map(rev => (
            <Card key={rev.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {rev.serviceName}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Technician:{' '}
                      <span className="font-medium text-foreground">
                        {rev.technicianName}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    {rev.rating} / 5
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                  "{rev.comment}"
                </p>
                <p className="text-xs text-muted-foreground text-right">
                  {rev.date}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
