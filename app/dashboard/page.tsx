"use client"

import SignOutButton from "@/components/SignOutButton";
import { useUserStore } from "@/store/userStore";

const DashboardHome = () => {
  const { user, loading } = useUserStore()

  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      <div>DASHBOARD</div><br/>
      <div>Email is: {user?.email}</div>
      <div>Full name is: {user?.full_name}</div>
      <SignOutButton />
    </div>
  );
};

export default DashboardHome;