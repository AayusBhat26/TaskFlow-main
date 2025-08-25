"use client";

import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { UserActiveItemList } from "@/types/extended";
import { UserPermission } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";

interface Props {
  children: React.ReactNode;
}

interface UserActivityStatus {
  isLoading: boolean;
  isError: boolean;

  allUsers: UserActiveItemList[];
  allActiveUsers: UserActiveItemList[];
  allInactiveUsers: UserActiveItemList[];

  getActiveUsersRoleType: (role: UserPermission) => UserActiveItemList[];
  checkIfUserIsActive: (id: string) => boolean;
  refetch: () => void;
}

export const UserActivityStatusCtx = createContext<UserActivityStatus | null>(
  null
);

export const UserActivityStatusProvider = ({ children }: Props) => {
  const { toast } = useToast();
  const m = useTranslations("MESSAGES");

  const [allInactiveUsers, setAllInactiveUsers] = useState<
    UserActiveItemList[]
  >([]);
  const [allActiveUsers, setAllActiveUsers] = useState<UserActiveItemList[]>(
    []
  );

  const params = useParams();
  const session = useSession();
  const workspaceId = params.workspace_id ? params.workspace_id : null;

  // Use refs to prevent infinite loops
  const previousUsersRef = useRef<UserActiveItemList[]>([]);
  const hasInitializedRef = useRef(false);

  const {
    data: users,
    isError,
    isLoading,
    refetch,
  } = useQuery<UserActiveItemList[], Error>({
    queryFn: async () => {
      const res = await fetch(
        `/api/users/get-users?workspaceId=${workspaceId}`
      );

      if (!res.ok) {
        const error = (await res.json()) as string;
        throw new Error(error);
      }

      const response = await res.json();

      return response;
    },
    enabled: !!workspaceId,
    queryKey: ["getUserActivityStatus", workspaceId],
  });

  useEffect(() => {
    if (!session.data?.user?.id || !users) return;

    // Prevent unnecessary updates by comparing with previous users
    const usersChanged = !hasInitializedRef.current ||
      previousUsersRef.current.length !== users.length ||
      previousUsersRef.current.some((prevUser, index) => prevUser.id !== users[index]?.id);

    if (!usersChanged) return;

    console.log("📊 UserActivityStatus: Supabase disabled - using simple tracking");

    // Simple tracking without Supabase - mark all users as active
    setAllActiveUsers(users);
    setAllInactiveUsers([]);

    // Update refs
    previousUsersRef.current = users;
    hasInitializedRef.current = true;

  }, [session.data?.user?.id, users]);

  const getActiveUsersRoleType = useCallback(
    (role: UserPermission) => {
      return allActiveUsers.filter((user) => user.userRole === role);
    },
    [allActiveUsers]
  );

  const checkIfUserIsActive = useCallback(
    (id: string) => !!allActiveUsers?.find((user) => user.id === id),
    [allActiveUsers]
  );

  const info: UserActivityStatus = useMemo(() => ({
    isLoading,
    isError,
    allUsers: users ?? [],
    allActiveUsers,
    allInactiveUsers,
    getActiveUsersRoleType,
    checkIfUserIsActive,
    refetch,
  }), [isLoading, isError, users, allActiveUsers, allInactiveUsers, getActiveUsersRoleType, checkIfUserIsActive, refetch]);

  return (
    <UserActivityStatusCtx.Provider value={info}>
      {children}
    </UserActivityStatusCtx.Provider>
  );
};

export const useUserActivityStatus = () => {
  const ctx = useContext(UserActivityStatusCtx);
  if (!ctx) throw new Error("invalid use");

  return ctx;
};
