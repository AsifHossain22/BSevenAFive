import Link from 'next/link';
import RegisterForm from '../_components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-card p-8 shadow-sm">
        {/* HeaderSection */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Explore FixItNow!
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details below to create your new account
          </p>
        </div>

        {/* Register Form */}
        <RegisterForm />

        {/* SwitchRouteLink */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
