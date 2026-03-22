import type { MouseEventHandler, ReactNode } from "react";

type TemplateButtonProps = {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  type?: "button" | "submit" | "reset";

  // Optional click handler passed down from the parent component.
  // Intended usage:
  // - Keep TemplateButton reusable and route-agnostic.
  // - The parent decides what happens on click, such as navigation,
  //   opening a modal, or submitting an action.
  // Example:
  // <TemplateButton onClick={() => navigate("/register")}>
  //   Get Started
  // </TemplateButton>
  // When real routes/features are implemented, another dev only needs to
  // update the parent onClick logic instead of changing this shared button.
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const TemplateButton = ({
  children,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
}: TemplateButtonProps) => {
  // Shared button base styles for all landing page actions.
  const baseClasses = "rounded-lg font-semibold transition duration-200";

  // Variant intent:
  // primary = main CTA
  // outline = bordered secondary action
  // ghost = low-emphasis text button with hover fill
  const variantClasses =
    variant === "primary"
      ? "bg-[#5B5EF4] text-white px-3 py-1 hover:bg-[#6A6DF5]"
      : variant === "outline"
        ? "bg-white text-black border border-[#DCDCE6] px-2 py-1 hover:bg-[#5B5EF4] hover:text-white hover:border-[#5B5EF4]"
        : "bg-transparent text-black hover:bg-[#5B5EF4] px-3 py-1 hover:text-white";

  return (
    <button
      type={type}
      // onClick is optional.
      // If no onClick is passed, the button still renders normally and can
      // still be used as a submit/reset button depending on the "type" prop.
      // If an onClick is paRsed, it runs whatever action the parent provided.
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default TemplateButton;
