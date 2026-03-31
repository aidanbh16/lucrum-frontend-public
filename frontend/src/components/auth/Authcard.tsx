import Image from "next/image";
import { ReactNode } from "react";
import { authStyles } from "@/styles/auth";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className={authStyles.container}>
      <Image
        src="/logo/LucrumLogo.png"
        alt="Lucrum Logo"
        width={600}
        height={600}
        className={authStyles.logo}
        priority
      />

      <div className={authStyles.card}>
        <div className="mb-6">
          <h1 className={authStyles.title}>{title}</h1>
          <p className={authStyles.subtitle}>{subtitle}</p>
        </div>

        {children}

        <p className={authStyles.footer}>
          Simple. Clean. Built for better budgeting.
        </p>
      </div>
    </div>
  );
}