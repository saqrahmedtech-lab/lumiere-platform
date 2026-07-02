"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useLocale } from "@/hooks/use-locale";

// Matches the route's own page, or any nested route beneath it (e.g. the
// "All products" link stays active on /admin/products/publish/[id]).
// The dashboard root ("/admin") is the one exception — every admin route
// is nested under it, so it only lights up on an exact match. `rawUrl` is
// the un-localized config value (e.g. "/admin"); `localizedUrl` is what
// gets compared against the current pathname.
function isRouteActive(
  pathname: string,
  rawUrl: string,
  localizedUrl: string,
) {
  if (rawUrl === "/admin") return pathname === localizedUrl;
  return (
    pathname === localizedUrl || pathname.startsWith(`${localizedUrl}/`)
  );
}

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const hasChildren = !!item.items?.length;
          const itemActive = isRouteActive(
            pathname,
            item.url,
            `/${locale}${item.url}`,
          );

          if (!hasChildren) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={itemActive}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          const activeSubItem = item.items?.some((subItem) =>
            isRouteActive(pathname, subItem.url, `/${locale}${subItem.url}`),
          );
          const groupActive = itemActive || activeSubItem;

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive || groupActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} isActive={groupActive}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>

                    <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180 rtl:group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isRouteActive(
                            pathname,
                            subItem.url,
                            `/${locale}${subItem.url}`,
                          )}
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
