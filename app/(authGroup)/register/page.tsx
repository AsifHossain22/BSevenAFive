import RegisterForm from '../_components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg border p-8 shadow-lg">
        {/* FormGenericTexts */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">
            Are you new here. Lets explore Fix It Up!
          </h1>
          <p className="text-gray-500">
            Enter your credentials to register your account
          </p>
        </div>

        {/* RegisterForm */}
        <RegisterForm />
      </div>
    </div>
  );
}
