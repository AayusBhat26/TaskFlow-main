"use client";

import { MAX_USER_WORKSPACES } from "@/lib/options";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Props {
  className?: string;
  createdNumber: number;
}

export const CreatedWorkspacesInfo = ({ className, createdNumber }: Props) => {
  return (
    <p
      className={cn(
        "text-muted-foreground sm:text-sm text-xs text-center",
        className
      )}
    >
      You have used <span className="font-bold">{createdNumber} of {MAX_USER_WORKSPACES}</span> active workspaces
    </p>
  );
};
