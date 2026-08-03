'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShieldAlert, ShieldCheck, Mail, Calendar } from 'lucide-react';

interface IUserItem {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
  isBanned: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  // TODO: Fetch users list from backend API
  const [users, setUsers] = useState<IUserItem[]>([
    {
      id: 'usr-1',
      name: 'Sufian Ahmed',
      email: 'sufian@example.com',
      role: 'CUSTOMER',
      isBanned: false,
      createdAt: '2026-01-10',
    },
    {
      id: 'usr-2',
      name: 'Tanvir Hossain',
      email: 'tanvir@example.com',
      role: 'TECHNICIAN',
      isBanned: false,
      createdAt: '2026-02-01',
    },
    {
      id: 'usr-3',
      name: 'Rahim Uddin',
      email: 'rahim@example.com',
      role: 'CUSTOMER',
      isBanned: true,
      createdAt: '2026-03-12',
    },
  ]);

  const toggleBanStatus = async (userId: string) => {
    // TODO: Send backend API PATCH call
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, isBanned: !u.isBanned } : u)),
    );
  };

  const filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-sm text-muted-foreground">
          View registered customer and technician profiles, search users and
          manage account status.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          className="pl-8"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredUsers.map(user => (
          <Card key={user.id}>
            <CardContent className="p-5 flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base">{user.name}</span>
                  <Badge variant="outline">{user.role}</Badge>
                  <Badge
                    className={
                      user.isBanned
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-emerald-500/10 text-emerald-600'
                    }
                  >
                    {user.isBanned ? 'Banned' : 'Active'}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {user.email}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Joined: {user.createdAt}
                </p>
              </div>

              <div className="flex items-center">
                <Button
                  size="sm"
                  variant={user.isBanned ? 'outline' : 'destructive'}
                  onClick={() => toggleBanStatus(user.id)}
                >
                  {user.isBanned ? (
                    <>
                      <ShieldCheck className="w-4 h-4 mr-1" /> Unban Account
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4 mr-1" /> Ban Account
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
