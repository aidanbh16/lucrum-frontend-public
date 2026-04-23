import AuthCard from "@/components/auth/authCard";
import AccountSignInForm from "@/components/auth/accountSignInForm";
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