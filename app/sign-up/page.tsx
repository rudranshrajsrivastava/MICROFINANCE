import { AuthForm } from "@/components/auth-form";

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const params = await searchParams;
  return <AuthForm mode="sign-up" initialRole={params.role === "bank" ? "bank" : "msme"} />;
}
