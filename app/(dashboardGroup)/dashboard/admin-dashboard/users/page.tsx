/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShieldAlert, ShieldCheck, Mail, Loader2 } from 'lucide-react';
import {
  IUser,
  getAllUsers,
  updateUserStatus,
} from '@/service/adminUserService';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllUsers();
        setUsers(data);
      } catch (err: any) {
        console.error('Failed to load users:', err);
        setError('Failed to fetch users from server.');
        toast.error('Failed to fetch users from server.');
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  // HandleStatus [ACTIVE | BANNED]
  const handleToggleStatus = async (user: IUser) => {
    const nextStatus = user.status === 'BANNED' ? 'ACTIVE' : 'BANNED';
    setActionLoadingId(user.id);

    const toastId = toast.loading(`Updating ${user.name}'s status...`);

    try {
      const response = await updateUserStatus(user.id, nextStatus);

      if (response?.success || response?.data) {
        setUsers(prevUsers =>
          prevUsers.map(u =>
            u.id === user.id ? { ...u, status: nextStatus } : u,
          ),
        );
        toast.success(`User ${user.name} is now ${nextStatus.toLowerCase()}!`, {
          id: toastId,
        });
      } else {
        throw new Error(response?.message || 'Failed to update user status.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Could not update user status.', {
        id: toastId,
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // SearchFiltering
  const filteredUsers = users.filter(
    u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-sm text-muted-foreground">
          View registered customer and technician profiles, search users and
          manage account access.
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

      {loading ? (
        <Card className="p-8 flex items-center justify-center text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading users from server...
        </Card>
      ) : error ? (
        <Card className="p-8 text-center text-destructive">{error}</Card>
      ) : filteredUsers.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No users found matching your search.
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map(user => {
            const isBanned = user.status === 'BANNED';
            const isUpdating = actionLoadingId === user.id;

            return (
              <Card key={user.id}>
                <CardContent className="p-5 flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-base">{user.name}</span>
                      {user.role && (
                        <Badge variant="outline">{user.role}</Badge>
                      )}
                      <Badge
                        className={
                          isBanned
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-emerald-500/10 text-emerald-600'
                        }
                      >
                        {user.status || 'ACTIVE'}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" /> {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID:{' '}
                      <code className="text-[10px] opacity-70">{user.id}</code>
                    </p>
                  </div>

                  <div className="flex items-center">
                    <Button
                      size="sm"
                      variant={isBanned ? 'outline' : 'destructive'}
                      disabled={isUpdating}
                      onClick={() => handleToggleStatus(user)}
                      className="cursor-pointer"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      ) : isBanned ? (
                        <>
                          <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" />{' '}
                          Unban Account
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
            );
          })}
        </div>
      )}
    </div>
  );
}
