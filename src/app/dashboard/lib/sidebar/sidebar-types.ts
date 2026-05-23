export type SidebarIconName =
  | "home"
  | "layout-dashboard"
  | "users"
  | "settings"
  | "folder"
  | "bell";

export type SidebarNavigationItem = {
  title: string;
  url: string;
  icon: SidebarIconName;
  items?: {
    title: string;
    url: string;
  }[];
};

export type SidebarNavigationGroupId = "home" | "organization" | "personal";

export type SidebarNavigationGroup = {
  id: SidebarNavigationGroupId;
  items: SidebarNavigationItem[];
};

export type SidebarOrganizationItem = {
  id: string;
  name: string;
  slug: string;
};

export type DashboardSidebarConfig = {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  organizations: SidebarOrganizationItem[];
  activeOrganizationId: string | null;
  navGroups: SidebarNavigationGroup[];
  projects: {
    name: string;
    url: string;
    icon: SidebarIconName;
  }[];
};
