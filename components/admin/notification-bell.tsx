"use client";

import { IconBell } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { useLocale } from "@/hooks/use-locale";
import {
  useNotifications,
  getNotificationPath,
  type Notification,
} from "@/hooks/use-notifications";

export function NotificationBell() {
  const router = useRouter();
  const locale = useLocale();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  async function handleNotificationClick(notification: Notification) {
    await markAsRead(notification);

    const path = getNotificationPath(notification);
    if (path) {
      router.push(`/${locale}${path}`);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative flex size-8 shrink-0 items-center justify-center rounded-lg text-deep transition-colors hover:bg-sidebar-accent"
          aria-label="Notifications"
        >
          <IconBell className="size-4.5" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-bloom px-1 text-[10px] font-semibold leading-none text-pearl">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="right"
        sideOffset={8}
        className="w-80 rounded-lg p-0"
      >
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm font-semibold text-text-primary">
            Notifications
          </span>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-xs font-medium text-tide hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        <DropdownMenuSeparator />

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-text-secondary">
              No notifications yet
            </p>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onSelect={() => handleNotificationClick(notification)}
                className={cn(
                  "flex cursor-pointer flex-col items-start gap-1 whitespace-normal rounded-none px-3 py-2.5",
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
                <p className="line-clamp-2 text-xs text-text-secondary">
                  {notification.body}
                </p>
                <span className="text-[11px] text-text-tertiary">
                  {formatRelativeTime(notification.created_at)}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
