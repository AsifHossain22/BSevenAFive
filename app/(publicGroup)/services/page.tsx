'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Wrench,
  Search,
  User,
  Star,
  Loader2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { getAllServices } from '@/service/customerService';
import { IGenericApiResponse, IService } from '@/lib/types';
export default function ServicesPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [services, setServices] = useState<IService[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const res: IGenericApiResponse<IService[]> | IService[] =
          await getAllServices();

        if (Array.isArray(res)) {
          setServices(res);
        } else if (res && Array.isArray(res.data)) {
          setServices(res.data);
        } else {
          setServices([]);
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const filteredServices = services.filter(service => {
    const title = service.title || '';
    const categoryName = service.category?.name || '';
    const description = service.description || '';
    const term = searchTerm.toLowerCase();

    return (
      title.toLowerCase().includes(term) ||
      categoryName.toLowerCase().includes(term) ||
      description.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* ServiceHeroBanner */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <Badge
          variant="outline"
          className="px-3 py-1 bg-primary/10 text-primary border-primary/20"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" /> Expert Technicians
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Explore Home Repair & Services
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Browse verified services created by top technicians, check transparent
          pricing and book your preferred time slot instantly.
        </p>

        {/* SearchInput */}
        <div className="relative max-w-md mx-auto pt-2">
          <Search className="w-4 h-4 absolute left-3 top-5 text-muted-foreground" />
          <Input
            placeholder="Search plumbing, electrical, AC repair..."
            className="pl-9 pr-4 py-5 shadow-xs"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ServicesGrid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading available services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-card">
          <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-bold">No Services Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
            {searchTerm
              ? `No services match "${searchTerm}". Try searching for something else.`
              : 'No services are currently available.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => {
            const categoryName = service.category?.name || 'General';
            const techName = service.technician?.name || 'Verified Tech';
            const rating = service.rating ?? 5.0;

            return (
              <Card
                key={service.id}
                className="flex flex-col hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {categoryName}
                    </Badge>
                    <div className="flex items-center text-xs font-semibold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500 mr-1" />
                      {rating}
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-2 line-clamp-1">
                    <Link
                      href={`/services/${service.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {service.title}
                    </Link>
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 space-y-3 text-sm">
                  <p className="text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>

                  <div className="pt-2 border-t space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-primary" />
                      <span>
                        Technician:{' '}
                        <strong className="text-foreground">{techName}</strong>
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-3 border-t flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Price
                    </span>
                    <span className="text-lg font-extrabold text-primary">
                      ${service.price}
                    </span>
                  </div>

                  <Button size="sm" className="gap-1 cursor-pointer">
                    <Link
                      href={`/booking/${service.id}`}
                      className="flex items-center gap-1"
                    >
                      Book Now <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
