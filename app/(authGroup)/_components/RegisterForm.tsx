'use client';

import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { registerAction } from '../_actions/authActions';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [state, action, pending] = useActionState(registerAction, null);
  const [role, setRole] = useState<string>('CUSTOMER');

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message || 'Registration successful!');
      if (onSuccess) onSuccess();
    } else {
      toast.error(state.message || 'Registration failed');
    }
  }, [state, onSuccess]);

  return (
    <form action={action} className="space-y-4">
      {/* HiddenInputEnsuresROLEIncludedInStandardFormDataSubmission */}
      <input type="hidden" name="role" value={role} />

      <div className="space-y-2">
        <Label htmlFor="register-name">Name</Label>
        <Input
          id="register-name"
          type="text"
          name="name"
          placeholder="Enter your name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          name="email"
          placeholder="Enter your email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-password">Password</Label>
        <Input
          id="register-password"
          type="password"
          name="password"
          placeholder="Enter your password"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-role">Select Role</Label>
        <Select
          value={role}
          onValueChange={val => {
            if (val) setRole(val);
          }}
        >
          <SelectTrigger id="register-role">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CUSTOMER">Customer</SelectItem>
            <SelectItem value="TECHNICIAN">Technician</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="w-full cursor-pointer"
      >
        {pending ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
}
