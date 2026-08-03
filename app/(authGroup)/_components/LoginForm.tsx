'use client';

import { useActionState, useEffect, Suspense } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAction } from '../_actions/authActions';

interface LoginFormProps {
  onSuccess?: () => void;
}

function LoginFormContent({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || null;

  const loginActionWithRedirect = loginAction.bind(null, redirectUrl);
  const [state, action, pending] = useActionState(
    loginActionWithRedirect,
    null,
  );

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message || 'Login successful!');
      router.refresh();
      if (onSuccess) onSuccess();
    } else {
      toast.error(state.message || 'Login failed');
    }
  }, [state, onSuccess, router]);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          name="email"
          placeholder="Enter your email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          name="password"
          placeholder="Enter your password"
          required
        />
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="w-full cursor-pointer"
      >
        {pending ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}

export default function LoginForm(props: LoginFormProps) {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-center text-sm text-muted-foreground">
          Loading form...
        </div>
      }
    >
      <LoginFormContent {...props} />
    </Suspense>
  );
}
