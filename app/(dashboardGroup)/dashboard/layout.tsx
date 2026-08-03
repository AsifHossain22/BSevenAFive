import { getUser } from '@/service/getUser';
import { redirect } from 'next/navigation';
import { IUserProfileResponse, IUserRole } from '@/lib/types';
import Sidebar from '@/components/shared/dashboard/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userRes: IUserProfileResponse | null = await getUser();
  const profileData = userRes?.data?.profile;

  if (!profileData) {
    redirect('/');
  }

  const role: IUserRole = profileData.role || 'CUSTOMER';

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-muted/20">
      {/* Sidebar */}
      <Sidebar role={role} userName={profileData.name || 'User'} />

      {/* MainContainer */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
