import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-paper-2 text-ink-soft",
        surplus: "bg-primary/10 text-primary",
        overdraft: "bg-danger/10 text-danger",
        enough: "bg-primary/10 text-primary",
        loss: "bg-danger/10 text-danger",
        ok: "bg-primary/10 text-primary",
        warn: "bg-danger/10 text-danger",
        note: "bg-paper-2 text-muted",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
