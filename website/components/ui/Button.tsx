import Link from "next/link";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
  className?: string;
}

/** Plain CTA — instant hover states, no motion. */
export function Button({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: ButtonProps) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`btn ${variant === "primary" ? "btn-primary" : "btn-ghost"} ${className}`}
    >
      {children}
    </Link>
  );
}
