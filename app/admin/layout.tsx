import { redirect } from "next/navigation";
import { getSessionUser, hasAtLeastRole } from "@/lib/server/session";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Staff-only. Previously this whole console was reachable by anyone who knew
  // the URL; access is now decided server-side from the session record.
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin");
  if (!hasAtLeastRole(user.role, "PHARMACIST")) redirect("/account");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-3xl text-brand-navy-900">Admin Dashboard</h1>
        <p className="text-xs text-brand-gray-500">
          Signed in as {user.name} · {user.role.replace("_", " ").toLowerCase()}
        </p>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <AdminSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
