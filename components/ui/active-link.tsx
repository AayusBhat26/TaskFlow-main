"use client";
import React from "react";
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
    // Check if children is a single anchor element
    let isAnchorChild = false;
    if (React.isValidElement(children) && children.type === 'a') {
      isAnchorChild = true;
    }
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
    if (isAnchorChild) {
      // Render a span to avoid nested <a>
      return (
        <span className={linkClass} {...props} ref={ref}>
          {children}
        </span>
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
