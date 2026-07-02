"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

export function useNotifications() {
  const supabase = createClient();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function init() {
      // Realtime authorizes a channel join with whatever JWT is current at
      // subscribe time. If the join fires before the session is hydrated,
      // it silently authorizes as anon, and the super_admin RLS policy on
      // notifications then drops every event with no error. Syncing the
      // token here — before .subscribe() runs — avoids that race.
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        await supabase.realtime.setAuth(session.access_token);
      }

      const [{ data: recent }, { count }] = await Promise.all([
        supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .eq("is_read", false),
      ]);

      if (cancelled) return;
      setNotifications((recent as Notification[]) ?? []);
      setUnreadCount(count ?? 0);

      channel = supabase
        .channel("admin-notifications")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notifications" },
          (payload) => {
            const inserted = payload.new as Notification;
            setNotifications((current) => [inserted, ...current].slice(0, 20));
            setUnreadCount((count) => count + 1);
          },
        )
        .subscribe();
    }

    init();

    // Keep the Realtime socket's JWT in sync if the session refreshes later.
    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        supabase.realtime.setAuth(session.access_token);
      }
    });

    return () => {
      cancelled = true;
      authSubscription.unsubscribe();
      if (channel) supabase.removeChannel(channel);
    };
  }, [supabase]);

  async function markAsRead(notification: Notification) {
    if (notification.is_read) return;

    setNotifications((current) =>
      current.map((n) =>
        n.id === notification.id ? { ...n, is_read: true } : n,
      ),
    );
    setUnreadCount((count) => Math.max(0, count - 1));

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notification.id);
  }

  async function markAllAsRead() {
    setNotifications((current) => current.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("is_read", false);
  }

  return { notifications, unreadCount, markAsRead, markAllAsRead };
}
