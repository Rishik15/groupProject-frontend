const DropdownItem = ({
  label,
  danger,
}: {
  label: string;
  danger?: boolean;
}) => {
  return (
    <button
      className={`w-full text-left px-3 py-2 rounded-md transition ${
        danger ? "text-red-400 hover:bg-red-500/10" : "hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
};

export default DropdownItem;
