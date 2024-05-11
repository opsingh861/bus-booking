"use client";

import Navbar from "@/components/ui/Navbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="overflow-auto">
      <Navbar />
      <main>

      </main>
    </div>
  );
}
