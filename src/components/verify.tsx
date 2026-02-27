"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { verifyEmailAction } from "@/action/authActions";

export default function VerifyComponent({ token }: { token: string }) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await verifyEmailAction(token);
      setStatus(res.message || "Email verified!");
    } catch (e: any) {
      setStatus(e.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={handleVerify} disabled={loading}>
        {loading ? "Verifying..." : "Verify Email"}
      </Button>
      {status && <p>{status}</p>}
    </div>
  );
}
