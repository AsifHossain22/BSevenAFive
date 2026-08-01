'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { loginAction } from '../_actions/authActions';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

const LoginForm = () => {
  // PendingState - FormSubmission
  const [state, action, pending] = useActionState(loginAction, false);

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message || 'Logged in successfully!');
    }

    if (!state.success) {
      toast.error(state.message || 'Logged in failed!');
    }
  }, [state]);
  return (
    <form action={action} className="space-y-4">
      <Card className="p-5 space-y-4">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
        />

        <Input
          type="password"
          name="password"
          placeholder="Enter your password"
          required
        />

        <Button className="cursor-pointer" type="submit">
          {pending ? 'Submitting...' : 'Login'}
        </Button>
      </Card>
    </form>
  );
};

export default LoginForm;
