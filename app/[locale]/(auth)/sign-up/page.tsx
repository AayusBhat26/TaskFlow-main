import { AuthCard } from "@/components/auth/AuthCard";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await getAuthSession();
  if (session) {
    redirect("/dashboard");
  }
  return <AuthCard />;
}
