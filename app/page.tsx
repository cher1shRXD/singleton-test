import Open from "@/components/Open";
import { cookies } from "next/headers";

export default async function Home() {
  const cookie = await cookies();

  return (
    <div>
      <p>{cookie.get("SESSION")?.value || "저장된 세션이 없습니다"}</p>
      <Open />
    </div>
  );
}
