"use client";

import { LocaleSwitcher } from "@/components/switchers/LocaleSwitcher";
import ActiveLink from "@/components/ui/active-link";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { LogOutIcon, Settings2, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouteLoading } from "@/hooks/useRouteLoading";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export const Bottom = () => {
  const t = useTranslations("SIDEBAR");
  const lang = useLocale();
  const { startLoading } = useRouteLoading();
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);
  const pathname = usePathname();
  
  // Reset loading state when route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSettingsLoading(false);
    }, 100); // Small delay to ensure route change is detected
    
    return () => clearTimeout(timer);
  }, [pathname]);
  
  const logOutHandler = () => {
    startLoading();
    signOut({
      callbackUrl: `${window.location.origin}/${lang}`,
    });
  };

  const handleSettingsClick = () => {
    setIsSettingsLoading(true);
    startLoading();
  };

  return (
    <div className="flex flex-col gap-4">
      <LocaleSwitcher
        textSize="text-lg"
        alignHover="start"
        alignDropdown="start"
        variant={"ghost"}
        size={"icon"}
      />
      <HoverCard openDelay={250} closeDelay={250}>
        <HoverCardTrigger tabIndex={1}>
          <Button onClick={logOutHandler} variant={"ghost"} size={"icon"}>
            <LogOutIcon />
          </Button>
        </HoverCardTrigger>
      </HoverCard>
      <HoverCard openDelay={250} closeDelay={250}>
        <HoverCardTrigger asChild>
          <div>
            <ActiveLink
              include="settings"
              variant={"ghost"}
              size={"icon"}
              href="/dashboard/settings"
              onClick={handleSettingsClick}
            >
              {isSettingsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Settings2 />
              )}
            </ActiveLink>
          </div>
        </HoverCardTrigger>
        <HoverCardContent align="start">
          <span>{t("MAIN.SETTINGS_HOVER")}</span>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};
