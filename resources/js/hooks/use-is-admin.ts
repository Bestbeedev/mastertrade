import { usePage } from "@inertiajs/react";
import { useAuthStore } from "@/stores/auth";

export function useIsAdmin() {
  const page = usePage();
  const storeUser = useAuthStore((s) => s.user);
  const auth: { isAdmin?: boolean; user?: unknown } | undefined = (page.props as { auth?: { isAdmin?: boolean; user?: unknown } })?.auth;
  if (typeof auth?.isAdmin === 'boolean') return auth.isAdmin;

  const user = auth?.user || storeUser;
  const roleName = ((user as { role?: { name?: string }; role_name?: string })?.role?.name || (user as { role?: { name?: string }; role_name?: string })?.role_name || "").toString().toLowerCase();
  return roleName === "admin" || roleName === "administrator" || roleName === "superadmin";
}
