"use client";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useToggleSidebar } from "@/context/ToggleSidebar";
import { OptionsSidebar } from "./optionsSidebar/OptionsSidebar";
import { ShortcutSidebar } from "./shortcutSidebar/ShortcutSidebar";
import { CloseSidebar } from "./CloseSidebar";
import { Workspace } from "@prisma/client";
import { getWorkspaces } from "@/lib/api";

interface Props {
  userWorkspaces: Workspace[];
  userId: string;
  userAdminWorkspaces: Workspace[];
}

export const SidebarContainer = ({
  userWorkspaces,
  userId,
  userAdminWorkspaces,
}: Props) => {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useToggleSidebar();
  // Use React Query to fetch workspaces
  const {
    data: workspaces = [],
    refetch: refetchWorkspaces,
  } = useQuery({
    queryKey: ["userWorkspaces", userId],
    queryFn: () => getWorkspaces(userId),
    initialData: userWorkspaces,
  });
  const createdWorkspaces = workspaces.filter(
    (workspace) => workspace.creatorId == userId
  );
  // Always filter admin workspaces from latest workspaces
  const latestAdminWorkspaces = workspaces.filter(
    (workspace: any) =>
      Array.isArray(workspace.subscribers) &&
      workspace.subscribers.some(
        (sub: any) => sub.user.id === userId && sub.userRole === "ADMIN"
      )
  );
  return (
    <>
      <aside
        className={`fixed z-50 top-0 h-full left-0 lg:static bg-background border-r flex lg:translate-x-0 transition-all duration-300 ${
          isOpen ? "translate-x-0 shadow-sm" : "translate-x-[-100%]"
        }`}
      >
        <ShortcutSidebar
          userWorkspaces={workspaces}
          createdWorkspaces={createdWorkspaces.length}
          refetchWorkspaces={refetchWorkspaces}
        />
        {!(pathname && pathname.includes("/notes") || (pathname && pathname.includes("/chat"))) && (
          <OptionsSidebar
            createdWorkspaces={createdWorkspaces.length}
            userAdminWorkspaces={userAdminWorkspaces}
            userWorkspaces={workspaces}
          />
        )}
        <CloseSidebar />
      </aside>
      <div
        onClick={() => {
          setIsOpen(false);
        }}
        className={`fixed h-screen w-full top-0 left-0 bg-black/80 z-40 lg:hidden ${
          isOpen ? "block" : "hidden"
        }`}
      ></div>
    </>
  );
};
