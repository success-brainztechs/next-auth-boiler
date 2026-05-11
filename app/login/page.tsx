"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/schema/auth_schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // Admin form
  const adminForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAdminLogin = async (data: z.infer<typeof loginSchema>) => {
    if (!data.email || !data.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      alert("Invalid credentials");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="pb-2 text-center">
        <CardTitle className="text-lg">Sign in to your account</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="adminForm"
          onSubmit={adminForm.handleSubmit(handleAdminLogin)}
          className="space-y-4"
        >
          <div className="space-y-4">
            <FieldGroup>
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Controller
                    name="email"
                    control={adminForm.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Email</FieldLabel>
                        <Input
                          className="h-10 bg-muted"
                          {...field}
                          placeholder="admin@company.com"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Controller
                    name="password"
                    control={adminForm.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Password</FieldLabel>
                        <Input
                          className="h-10 bg-muted"
                          {...field}
                          placeholder="••••••••"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {loading ? "Logging in..." : "Login"}
                </Button>
                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    className="text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                  <Link href="/signup" className="text-primary hover:underline">
                    Create Workspace
                  </Link>
                </div>
              </div>
            </FieldGroup>
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
  );
}
