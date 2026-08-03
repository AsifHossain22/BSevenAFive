import { getUser } from '@/service/getUser';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench, Check, Plus, ShieldCheck, Clock } from 'lucide-react';

async function getTechnicianServices() {
  return {
    category: 'Home Appliances Repair',
    experienceYears: 4,
    availability: 'AVAILABLE', // [AVAILABLE, BUSY, ON_LEAVE]
    skills: [
      'AC Servicing & Repair',
      'Gas Refilling',
      'Refrigerator Repair',
      'Washing Machine Setup',
    ],
  };
}

export default async function TechnicianServicesPage() {
  const userRes = await getUser();
  if (!userRes?.data?.profile) redirect('/');

  const serviceData = await getTechnicianServices();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Services & Skills
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage your service categories, listed skills and work availability
          status.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* ServiceCategoryAndAvailability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Primary Category
            </CardTitle>
            <CardDescription>Your registered service sector</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Category Name</p>
              <p className="text-base font-bold text-foreground">
                {serviceData.category}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Experience Level</p>
              <p className="text-sm font-semibold">
                {serviceData.experienceYears} Years Active
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Availability Status
              </p>
              <Badge className="bg-green-500/10 text-green-600 border border-green-300">
                <Clock className="w-3 h-3 mr-1" /> Available for Hire
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* SkillsList */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" /> Offered Skills
              </CardTitle>
              <CardDescription>
                Services you are verified to perform
              </CardDescription>
            </div>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" /> Add Skill
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {serviceData.skills.map((skill, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card"
                >
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> {skill}
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    Verified
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
