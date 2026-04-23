import AuthCard from "@/components/auth/authCard";
import AccountCreationForm from "@/components/auth/accountCreationForm";
import { authStyles } from "@/styles/auth";

export default function AccountCreationPage() {
  return (
    <main className={authStyles.pageWrapper}>
      <AuthCard
        title="Create Account"
        subtitle="Start managing your finances with clarity"
      >
        <AccountCreationForm />
      </AuthCard>
    </main>
  );
}