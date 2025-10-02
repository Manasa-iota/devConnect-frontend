import { cn } from "../../lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

export default function Button({ className, variant="primary", size="md", ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-xl2 transition focus:outline-none focus:ring-2 focus:ring-white/10";
  const variants = {
    primary: "bg-brand-primary text-white font-semibold hover:opacity-90",
    ghost: "bg-surface-100 text-white/90 border border-white/10 hover:border-white/20",
    outline: "bg-transparent text-white border border-white/15 hover:border-white/30"
  };
  const sizes = { sm:"px-3 py-1.5 text-sm", md:"px-4 py-2 text-sm", lg:"px-5 py-3 text-base" };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
