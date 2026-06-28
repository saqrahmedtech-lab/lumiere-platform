import { redirect } from "next/navigation";
import { getUserProfile, type Profile } from "./get-user-profile";

export async function requireRole(role: Profile["role"]) {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/auth/login");
  }

  if (profile.role !== role) {
    redirect("/auth/login?error=not_authorized");
  }

  return profile;
}
