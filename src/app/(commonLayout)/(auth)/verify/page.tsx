import { use } from "react";
import VerifyPage from "@/components/verify-page";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = use(searchParams);
  return <VerifyPage token={params.token} />;
}
