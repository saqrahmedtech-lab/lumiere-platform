"use client";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Profile } from "@/utils/supabase/get-user-profile";
import { logout } from "@/app/[locale]/auth/actions/logout";
import { useLocale } from "@/hooks/use-locale";
import { useNotifications, type Notification } from "@/hooks/use-notifications";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { cn } from "@/lib/utils";

const MAX_MENU_NOTIFICATIONS = 5;

export function NavUser({ user }: { user: Profile }) {
  const { isMobile } = useSidebar();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const targetLocale = locale === "ar" ? "en" : "ar";
  const segments = pathname.split("/");
  segments[1] = targetLocale;
  const targetPath = segments.join("/") || `/${targetLocale}`;

  const recentNotifications = notifications.slice(0, MAX_MENU_NOTIFICATIONS);

  async function handleNotificationClick(notification: Notification) {
    await markAsRead(notification);

    if (notification.link) {
      router.push(`/${locale}${notification.link}`);
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="relative shrink-0">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.avatar_url}
                    alt={user.full_name || "Super Admin"}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex size-2.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-bloom opacity-75" />
                    <span className="relative inline-flex size-2.5 rounded-full border-2 border-sidebar bg-bloom" />
                  </span>
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user.full_name || "Super Admin"}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-80 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.avatar_url}
                    alt={user.full_name || "Super Admin"}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.full_name || "Super Admin"}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Notifications */}
            <div className="-mx-1">
              <div className="flex items-center justify-between px-3 py-1.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-text-tertiary uppercase">
                  <Bell className="size-3.5" aria-hidden="true" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-bloom px-1 text-[10px] font-semibold leading-none text-pearl">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[11px] font-medium text-tide hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {recentNotifications.length === 0 ? (
                <p className="px-3 pb-2 text-xs text-text-secondary">
                  You&apos;re all caught up.
                </p>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {recentNotifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      onSelect={() => handleNotificationClick(notification)}
                      className={cn(
                        "flex cursor-pointer flex-col items-start gap-0.5 rounded-none px-3 py-2 whitespace-normal",
                        !notification.is_read && "bg-tide/10",
                      )}
                    >
                      <div className="flex w-full items-center gap-1.5">
                        {!notification.is_read && (
                          <span
                            className="size-1.5 shrink-0 rounded-full bg-tide"
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className={cn(
                            "truncate text-sm",
                            !notification.is_read
                              ? "font-semibold text-text-primary"
                              : "font-normal text-text-secondary",
                          )}
                        >
                          {notification.title}
                        </span>
                      </div>
                      <p className="line-clamp-1 text-xs text-text-secondary">
                        {notification.body}
                      </p>
                      <span className="text-[11px] text-text-tertiary">
                        {formatRelativeTime(notification.created_at)}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={targetPath} className="flex items-center gap-2">
                <Globe className="size-4" />
                {locale === "ar" ? "English" : "العربية"}
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem asChild variant="destructive">
              <form action={logout} className="w-full">
                <button
                  type="submit"
                  className="flex w-full items-center gap-1.5"
                >
                  <LogOut />
                  Log out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
