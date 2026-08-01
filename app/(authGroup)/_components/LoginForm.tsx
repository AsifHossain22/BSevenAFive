'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const LoginForm = () => {
  return (
    <form className="space-y-4">
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
          Login
        </Button>
      </Card>
    </form>
  );
};

export default LoginForm;
