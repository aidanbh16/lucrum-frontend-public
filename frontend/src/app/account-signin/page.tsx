import AuthCard from "@/components/auth/AuthCard";
import AccountSignInForm from "@/components/auth/AccountSignInForm";
import { authStyles } from "@/styles/auth";

export default function AccountSignInPage() {
  return (
    <main className={authStyles.pageWrapper}>
      <AuthCard
        title="Sign In"
        subtitle="Access your financial plan and continue managing your allocations"
      >
        <AccountSignInForm />
      </AuthCard>
    </main>
  );
}