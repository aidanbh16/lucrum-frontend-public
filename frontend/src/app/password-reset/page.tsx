import AuthCard from "@/components/auth/AuthCard";
import PasswordResetForm from "@/components/auth/PasswordResetForm";
import { authStyles } from "@/styles/auth";

export default function PasswordResetPage() {
  return (
    <main className={authStyles.pageWrapper}>
      <AuthCard
        title="Reset Password"
        subtitle="Enter your account information to reset your password"
      >
        <PasswordResetForm />
      </AuthCard>
    </main>
  );
}