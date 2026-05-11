"use client"

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  return (
    <div>
      <button onClick={()=>router.push("/login")}>Login</button><br/>
      <button onClick={()=>router.push("/dashboard")}>Dashboard</button>
    </div>
  );
}
