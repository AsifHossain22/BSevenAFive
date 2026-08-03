import { getUser } from '@/service/getUser';
import { redirect } from 'next/navigation';
import { IUserProfileResponse, IUserRole } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Mail,
  Phone,
  MapPin,
  Shield,
  Wrench,
  Briefcase,
  Award,
  KeyRound,
} from 'lucide-react';
import EditProfileModal from '@/components/shared/dashboard/EditProfileModal';
import { Badge } from '@/components/ui/badge';

export default async function UserProfileView() {
  const userRes: IUserProfileResponse | null = await getUser();
  const profileData = userRes?.data?.profile;

  if (!profileData) {
    redirect('/');
  }

  const role: IUserRole = profileData.role || 'CUSTOMER';
  const nestedProfile = profileData.profile;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* TopTitleModal */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Account Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal profile details and account preferences.
          </p>
        </div>
        <EditProfileModal initialProfile={profileData} />
      </div>

      {/* SharedCard */}
      <Card>
        <CardHeader className="border-b bg-muted/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {profileData.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <CardTitle className="text-xl">
                {profileData.name || 'User'}
              </CardTitle>
              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded font-semibold bg-primary/10 text-primary uppercase">
                {role}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 grid sm:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Email Address</p>
              <p className="text-sm font-medium">{profileData.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Phone Number</p>
              <p className="text-sm font-medium">
                {profileData.phone || 'Not provided'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Address</p>
              <p className="text-sm font-medium">
                {profileData.address ||
                  nestedProfile?.location ||
                  'Not provided'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Account Role</p>
              <p className="text-sm font-medium capitalize">
                {role.toLowerCase()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TECHNICIAN */}
      {role === 'TECHNICIAN' && (
        <Card>
          <CardHeader className="border-b bg-muted/10">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Technician Dashboard</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 grid sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Experience Years
                </p>
                <p className="text-sm font-medium">
                  {nestedProfile?.experienceYears
                    ? `${nestedProfile.experienceYears} Years`
                    : 'Not set'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Hourly Rate</p>
                <p className="text-sm font-medium">
                  {nestedProfile?.hourlyRate
                    ? `$${nestedProfile.hourlyRate}/hr`
                    : 'Not set'}
                </p>
              </div>
            </div>

            {nestedProfile?.skills && nestedProfile.skills.length > 0 && (
              <div className="sm:col-span-2 space-y-1.5">
                <p className="text-xs text-muted-foreground">
                  Skills & Specializations
                </p>
                <div className="flex flex-wrap gap-2">
                  {nestedProfile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ADMIN */}
      {role === 'ADMIN' && (
        <Card>
          <CardHeader className="border-b bg-muted/10">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Admin Dashboard</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Full access to user permissions, service management, audit logs
              and category creation.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
