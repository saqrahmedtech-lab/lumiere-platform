import { defaultLocale, hasLocale, isRTL } from "@/lib/i18n";
import { AdminBreadcrumb } from "../../components/admin/AdminBreadcrumb";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getUserProfile } from "@/utils/supabase/get-user-profile";
import { requireRole } from "@/utils/supabase/require-role";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(rawLocale) ? rawLocale : defaultLocale;
  const rtl = isRTL(locale);
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/auth/login");
  }
  await requireRole("super_admin");
  return (
    <div className="flex min-h-full" dir={rtl ? "rtl" : "ltr"}>
      <Toaster position="top-center" richColors />
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar userProfile={profile} side={rtl ? "right" : "left"} />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-pearl">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4 translate-y-1.5"
                />
                <AdminBreadcrumb locale={locale} />
              </div>
            </header>
            <main className="flex-1 overflow-y-auto bg-sand p-6 text-deep">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
