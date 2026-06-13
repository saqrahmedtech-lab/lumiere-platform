"use client";
import * as React from "react";
import {
  LayoutDashboard,
  PackageSearch,
  Store,
  ShoppingCart,
  BarChart2,
  Settings2,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
// This is sample data.

const data = {
  user: {
    name: "Super Admin",
    email: "admin@lumiere.eg",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: PackageSearch,
      items: [
        { title: "Review queue", url: "/admin/products" },
        { title: "Live products", url: "/admin/store-products" },
        { title: "Categories", url: "/admin/categories" },
      ],
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: ShoppingCart,
      items: [
        { title: "All orders", url: "/admin/orders" },
        { title: "Payment queue", url: "/admin/payments" },
      ],
    },
    {
      title: "Merchants",
      url: "/admin/merchants",
      icon: Store,
      items: [{ title: "All merchants", url: "/admin/merchants" }],
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: BarChart2,
      items: [
        { title: "Platform revenue", url: "/admin/reports" },
        { title: "Per merchant", url: "/admin/reports#merchants" },
        { title: "Delivery fees", url: "/admin/reports#delivery" },
      ],
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings2,
      items: [
        { title: "Delivery fee", url: "/admin/settings#delivery" },
        { title: "Payment accounts", url: "/admin/settings#payments" },
      ],
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="hover:bg-transparent focus:bg-transparent"
              size="lg"
              asChild
            >
              <div>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#0B7B8C] text-white">
                  <span className="text-sm font-bold">L</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Lumière</span>
                  <span className="truncate text-xs text-[#4A6670]">
                    Super Admin
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
