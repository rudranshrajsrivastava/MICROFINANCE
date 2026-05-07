import { AuthForm } from "@/components/auth-form";

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const params = await searchParams;
  return <AuthForm mode="sign-in" initialRole={params.role === "bank" ? "bank" : "msme"} />;
}
