'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerReviewsPage() {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you! Your review has been submitted.');
    setComment('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Service Reviews</h1>
        <p className="text-sm text-muted-foreground">
          Leave feedback for technicians after service completion.
        </p>
      </div>

      {/* ReviewSubmissionForm */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Leave a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-2">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-muted border-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-2">
                Your Feedback
              </label>
              <Textarea
                placeholder="How was your technician's service?"
                value={comment}
                onChange={e => setComment(e.target.value)}
                required
                rows={4}
              />
            </div>

            <Button type="submit" className="cursor-pointer">
              Submit Review
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
