"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      alert("Invalid credentials");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="border p-2"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        className="border p-2"
      />

      <button disabled={loading}>
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
  );
}