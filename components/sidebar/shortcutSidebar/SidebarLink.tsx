"use client";

import { useState, useEffect } from "react";
import ActiveLink from "@/components/ui/active-link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { LucideIcon, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouteLoading } from "@/hooks/useRouteLoading";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  Icon: LucideIcon;
  hoverTextKey: string;
  include?: string;
}

export const SidebarLink = ({ hoverTextKey, href, Icon, include }: Props) => {
  const t = useTranslations("SIDEBAR.MAIN");
  const { startLoading } = useRouteLoading();
  const [isLinkLoading, setIsLinkLoading] = useState(false);
  const pathname = usePathname();


  // Reset loading state when route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLinkLoading(false);
    }, 100); // Small delay to ensure route change is detected
    
    return () => clearTimeout(timer);
  }, [pathname]);

  const handleClick = (e: React.MouseEvent) => {
    setIsLinkLoading(true);
    startLoading();
  };

  return (
    <HoverCard openDelay={250} closeDelay={250}>
      <HoverCardTrigger asChild>
        <div>
          <ActiveLink
            include={include}
            variant={"ghost"}
            size={"icon"}
            href={href}
            onClick={handleClick}
          >
            {isLinkLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Icon />
            )}
          </ActiveLink>
        </div>
      </HoverCardTrigger>
      <HoverCardContent align="start">
        <span>{t(hoverTextKey)}</span>
      </HoverCardContent>
    </HoverCard>
  );
};
