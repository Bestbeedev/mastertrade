import { usePage } from "@inertiajs/react";
import { useAuthStore } from "@/stores/auth";

export function useIsAdmin() {
  const page = usePage();
  const storeUser = useAuthStore((s) => s.user);
  const auth: any = (page.props as any)?.auth;
  if (typeof auth?.isAdmin === 'boolean') return auth.isAdmin;

  const user = auth?.user || storeUser;
  const roleName = (user?.role?.name || user?.role_name || "").toString().toLowerCase();
  return roleName === "admin" || roleName === "administrator" || roleName === "superadmin";
}
