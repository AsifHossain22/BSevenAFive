import { getUser } from '@/service/getUser';
import { redirect } from 'next/navigation';
import { IUserProfileResponse } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Shield } from 'lucide-react';
import EditProfileModal from '@/components/shared/dashboard/EditProfileModal';

export default async function ProfilePage() {
  const userRes: IUserProfileResponse | null = await getUser();
  const profileData = userRes?.data?.profile;

  if (!profileData) {
    redirect('/');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Account Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal profile details and contact information.
          </p>
        </div>
        {/* EditProfileModal */}
        <EditProfileModal initialProfile={profileData} />
      </div>

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
                {profileData.role || 'CUSTOMER'}
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
                {profileData.address || 'Not provided'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Account Role</p>
              <p className="text-sm font-medium capitalize">
                {profileData.role?.toLowerCase() || 'Customer'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
