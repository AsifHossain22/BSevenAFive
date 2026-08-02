'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthModalProps {
  defaultTab?: 'login' | 'register';
  triggerText: string;
  variant?:
    | 'default'
    | 'outline'
    | 'ghost'
    | 'secondary'
    | 'link'
    | 'destructive';
}

export function AuthModal({
  defaultTab = 'login',
  triggerText,
  variant = 'default',
}: AuthModalProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant={variant} className="cursor-pointer">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">
            {activeTab === 'login' ? 'Welcome Back' : 'Create an Account'}
          </DialogTitle>
        </DialogHeader>
        <Tabs
          value={activeTab}
          onValueChange={val => setActiveTab(val as 'login' | 'register')}
          className="w-full"
        >
          <TabsContent value="login" className="mt-4">
            <LoginForm onSuccess={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="register" className="mt-4">
            <RegisterForm onSuccess={() => setOpen(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
