import AuthCard from "@/components/auth/authCard";
import AccountSignOutPanel from "@/components/auth/accountSignOutPanel";
import { authStyles } from "@/styles/auth";

export default function AccountSignOutPage() {
  return (
    <main className={authStyles.pageWrapper}>
      <AuthCard
        title="Sign Out"
        subtitle="Sign out of your Lucrum account securely"
      >
        <AccountSignOutPanel />
      </AuthCard>
    </main>
  );
}