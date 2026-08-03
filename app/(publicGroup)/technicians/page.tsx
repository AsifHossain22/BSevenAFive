/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Search,
  MapPin,
  Star,
  Loader2,
  ArrowRight,
  Users,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { getAllTechnicians } from '@/service/customerService';

export default function TechniciansPage() {
  const [loading, setLoading] = useState(true);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchTechnicians() {
      try {
        setLoading(true);
        const res = await getAllTechnicians();
        const dataList = Array.isArray(res)
          ? res
          : res?.data || res?.result || [];
        setTechnicians(Array.isArray(dataList) ? dataList : []);
      } catch (err) {
        console.error('Failed to load technicians:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTechnicians();
  }, []);

  const filteredTechnicians = technicians.filter(tech => {
    const name = tech.user?.name || tech.name || tech.userName || '';
    const email = tech.user?.email || tech.email || '';
    const bio = tech.bio || '';
    const matchTerm = searchTerm.toLowerCase();

    return (
      name.toLowerCase().includes(matchTerm) ||
      email.toLowerCase().includes(matchTerm) ||
      bio.toLowerCase().includes(matchTerm)
    );
  });

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* HeaderBanner */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <Badge
          variant="outline"
          className="px-3 py-1 bg-primary/10 text-primary border-primary/20"
        >
          <Users className="w-3.5 h-3.5 mr-1.5 inline" /> Verified Professionals
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Meet Our Expert Technicians
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Browse verified technicians, read ratings and book direct repair
          services.
        </p>

        {/* Search */}
        <div className="relative max-w-md mx-auto pt-2">
          <Search className="w-4 h-4 absolute left-3 top-5 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9 pr-4 py-5 shadow-xs"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading verified technicians...</p>
        </div>
      ) : filteredTechnicians.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-card">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-bold">No Technicians Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
            {searchTerm
              ? `No technicians match "${searchTerm}".`
              : 'No technicians registered in the database yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTechnicians.map((tech: any) => {
            const tId = tech.id || tech._id;
            const techName =
              tech.user?.name || tech.name || 'Verified Technician';
            const techEmail = tech.user?.email || tech.email || '';
            const isActive = tech.user?.status === 'ACTIVE';
            const hourlyRate = tech.pricePerHour || tech.hourlyRate || '0';
            const expYears =
              tech.yearsOfExperience ?? tech.experienceYears ?? 0;
            const bioText =
              tech.bio || 'Experienced repair & maintenance specialist.';

            const avatarUrl = tech.user?.image || tech.image || tech.avatar;

            return (
              <Card
                key={tId}
                className="flex flex-col hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted border shrink-0">
                      <Image
                        src={avatarUrl}
                        alt={techName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg line-clamp-1">
                        {techName}
                      </CardTitle>
                      <span className="text-xs text-muted-foreground block truncate">
                        {techEmail}
                      </span>
                      <Badge variant="secondary" className="text-xs mt-1">
                        Home Repair Expert
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-3 text-sm">
                  {/* StatusAndPricing */}
                  <div className="flex items-center justify-between text-xs font-medium border-y py-2.5">
                    {isActive ? (
                      <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-md">
                        <XCircle className="w-3.5 h-3.5" /> Inactive
                      </span>
                    )}
                    <span className="font-bold text-foreground">
                      ${hourlyRate}/hr
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-muted-foreground line-clamp-2 italic">
                    &ldquo;{bioText}&rdquo;
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-center bg-muted/40 p-2.5 rounded-lg">
                    <div>
                      <div className="font-bold text-xs">{expYears} Yrs</div>
                      <span className="text-[10px] text-muted-foreground">
                        Experience
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        5.0
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        Rating
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-3 border-t flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 cursor-pointer text-xs"
                  >
                    <Link href={`/technicians/${tId}`}>View Profile</Link>
                  </Button>

                  <Button
                    disabled={!isActive}
                    className="flex-1 cursor-pointer gap-1 text-xs"
                  >
                    Book Tech <ArrowRight className="w-3.5 h-3.5" />
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
