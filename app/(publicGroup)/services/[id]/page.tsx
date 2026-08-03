/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  User,
  Star,
  Loader2,
  ArrowLeft,
  Calendar,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { getServiceById } from '@/service/customerService';

interface ServicePageProps {
  params: Promise<{ id: string }>;
}

export default function ServiceDetailsPage({ params }: ServicePageProps) {
  const resolvedParams = use(params);
  const serviceId = resolvedParams.id;

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServiceDetails() {
      if (!serviceId) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getServiceById(serviceId);
        if (data) {
          setService(data);
        } else {
          setError('Service not found.');
        }
      } catch (err: any) {
        console.error('Failed to load service details:', err);
        setError(err?.message || 'Failed to fetch service details.');
      } finally {
        setLoading(false);
      }
    }

    fetchServiceDetails();
  }, [serviceId]);

  const getCategoryName = (data: any): string => {
    if (!data) return 'General';
    if (typeof data.category === 'object' && data.category !== null) {
      return data.category.categoryName || data.category.name || 'General';
    }
    return typeof data.category === 'string' ? data.category : 'General';
  };

  const getTechnicianName = (data: any): string => {
    if (!data) return 'Verified Tech';
    if (typeof data.technician === 'object' && data.technician !== null) {
      return (
        data.technician.name || data.technician.userName || 'Verified Tech'
      );
    }
    return typeof data.technician === 'string'
      ? data.technician
      : 'Verified Tech';
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">
          Loading service details...
        </p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-4 rounded-full bg-destructive/10 text-destructive w-fit mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold">Service Not Available</h2>
        <p className="text-muted-foreground text-sm">
          {error || 'The requested service could not be found.'}
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/services">
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> <span>Back to Services</span>
            </span>
          </Link>
        </Button>
      </div>
    );
  }

  const title =
    typeof service.title === 'string'
      ? service.title
      : service.name || 'Service Details';
  const categoryLabel = getCategoryName(service);
  const techName = getTechnicianName(service);
  const price = service.price || service.hourlyRate || service.amount || 0;
  const rating = service.rating || service.averageRating || 4.9;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link
        href="/services"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Services
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary">{categoryLabel}</Badge>
                <div className="flex items-center text-xs font-semibold text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500 mr-1" />
                  {rating}
                </div>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold">
                {title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-2">
                  Service Description
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {typeof service.description === 'string' &&
                  service.description.trim() !== ''
                    ? service.description
                    : 'Professional home repair and maintenance service guaranteed by verified local experts.'}
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h3 className="text-sm font-semibold mb-2">What is Included</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Verified Professional Service</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Quality Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Transparent Pricing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>24/7 Customer Support</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>

            <CardContent className="pt-4 space-y-4 text-sm">
              <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Service Price</span>
                <span className="text-2xl font-black text-primary">
                  ${price}
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    Technician:{' '}
                    <strong className="text-foreground">{techName}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    Duration:{' '}
                    <strong>{service.duration || '1 - 2 Hours'}</strong>
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <Button
                className="w-full cursor-pointer"
                size="lg"
                onClick={() => router.push(`/booking/${serviceId}`)}
              >
                <Calendar className="w-4 h-4 mr-2" /> Proceed to Book
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
