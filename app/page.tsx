import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex justify-center">
      <Link href="/debts">
        <Button size={"lg"}>Go to debts</Button>
      </Link>
    </div>
  );
}
