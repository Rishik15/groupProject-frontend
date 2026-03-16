import type { ReactNode } from "react";

type TemplateButtonProps = {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  type?: "button" | "submit" | "reset";
};

const TemplateButton = ({
  children,
  variant = "primary",
  className = "",
  type = "button",
}: TemplateButtonProps) => {
  // Shared button base styles for all landing page actions.
  const baseClasses = "rounded-lg font-semibold transition duration-200";

  // Variant intent:
  // primary = main CTA
  // outline = bordered secondary action
  // ghost = low-emphasis text button with hover fill
  const variantClasses =
    variant === "primary"
      ? "bg-[#5B5EF4] text-white px-6 py-3 hover:bg-[#6A6DF5]"
      : variant === "outline"
        ? "bg-white text-black border border-[#DCDCE6] px-6 py-3 hover:bg-[#5B5EF4] hover:text-white hover:border-[#5B5EF4]"
        : "bg-transparent text-black px-4 py-2 hover:bg-[#5B5EF4] hover:text-white";

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default TemplateButton;