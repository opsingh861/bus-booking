"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex gap-px">
        <Button asChild>
          <button onClick={() => router.push("/auth/login")}>Login</button>
        </Button>
        <Button asChild>
          <button onClick={() => router.push("/auth/register")}>Register</button>
        </Button>
      </div>
    </main>
  );
}
