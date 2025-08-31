"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AddWorkspaceForm } from "./AddWorkspaceForm";
import Warning from "@/components/ui/warning";
import { CreatedWorkspacesInfo } from "@/components/common/CreatedWorkspacesInfo";
import { useRouteLoading } from "@/hooks/useRouteLoading";

interface Props {
  createdWorkspaces: number;
  refetchWorkspaces?: () => void;
}

export const AddWorkspace = ({ createdWorkspaces, refetchWorkspaces }: Props) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("SIDEBAR");
  const { startLoading } = useRouteLoading();
  
  const handleOpenDialog = () => {
    startLoading();
    setOpen(true);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <HoverCard openDelay={250} closeDelay={250}>
          <DialogTrigger asChild>
            <HoverCardTrigger>
              <Button
                onClick={handleOpenDialog}
                variant={"ghost"}
                size={"icon"}
              >
                <Plus />
              </Button>
            </HoverCardTrigger>
          </DialogTrigger>
          <HoverCardContent align="start">
            {t("MAIN.NEW_WORKSPACE_HOVER")}
          </HoverCardContent>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("MAIN.NEW_WORKSPACE_DIALOG_TITLE")}</DialogTitle>
              <DialogDescription>
                {t("MAIN.NEW_WORKSPACE_DIALOG_DESC")}
              </DialogDescription>
            </DialogHeader>
            <Warning className="hidden sm:flex" blue>
              <CreatedWorkspacesInfo
                className="text-left text-secondary-foreground"
                createdNumber={createdWorkspaces}
              />
            </Warning>
            <AddWorkspaceForm onSetOpen={setOpen} refetchWorkspaces={refetchWorkspaces} />
          </DialogContent>
        </HoverCard>
      </Dialog>
    </div>
  );
};
