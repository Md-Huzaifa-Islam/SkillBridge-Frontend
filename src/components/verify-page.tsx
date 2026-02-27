import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import VerifyComponent from "@/components/verify";

type VerifyPageProps = {
  token?: string;
};

export default function VerifyPage({ token }: VerifyPageProps) {
  if (!token) {
    return (
      <>
        <nav className="invisible">
          <Navbar />
        </nav>
        <div
          className={cn("flex min-h-[60vh] items-center justify-center p-4")}
        >
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                The verify link is broken. Please reclick the link sent to your
                mail.
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </>
    );
  }
  return (
    <>
      <nav className="invisible">
        <Navbar />
      </nav>
      <div className={cn("flex min-h-[60vh] items-center justify-center p-4")}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verify your email</CardTitle>
            <CardDescription>
              Click below to verify your email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <VerifyComponent token={token} />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
