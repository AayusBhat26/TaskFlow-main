"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

interface Props {
  href: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null;
  size?: "default" | "sm" | "lg" | "icon" | null;
  children?: React.ReactNode;
  include?: string;
  workspaceIcon?: boolean;
  disableActiveStateColor?: boolean;
}

const ActiveLink = React.forwardRef<HTMLAnchorElement, Props>(
  (
    {
      href,
      className,
      variant = "default",
      size = "default",
      children,
      include,
      workspaceIcon,
      disableActiveStateColor = false,
      ...props
    }: Props,
    ref
  ) => {
    const pathname = usePathname();

    // Check if this ActiveLink is inside a HoverCardTrigger or other wrapper that might create nested anchors
    const isInWrapper = useRef(false);

    // Check if children contains any anchor elements
    const containsAnchor = React.Children.toArray(children).some(child => {
      if (React.isValidElement(child)) {
        return child.type === 'a' || child.type === Link;
      }
      return false;
    });

    const linkClass = cn(
      `${buttonVariants({ variant, size })} ${
        href === pathname || (include && pathname.includes(include))
          ? workspaceIcon
            ? "font-semibold border-secondary-foreground border-2"
            : disableActiveStateColor
            ? ""
            : "bg-secondary font-semibold"
          : ""
      }`,
      className
    );

    // If wrapped in HoverCardTrigger or contains anchor, render as div to avoid nesting
    if (containsAnchor) {
      return (
        <div className={linkClass} {...(props as any)} ref={ref as any}>
          {children}
        </div>
      );
    }

    return (
      <Link
        href={href}
        className={linkClass}
        ref={ref}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

ActiveLink.displayName = "ActiveLink";

export default ActiveLink;
