import { Search } from "lucide-react";

type Props = {
  search: string;
  setSearch: (value: string) => void;
};

const MealPlanSearch = ({ search, setSearch }: Props) => {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#72728A]" />

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search meal plans..."
        className="h-10 w-full rounded-xl border border-[#E6E6EE] bg-white pl-10 pr-3 text-[14px] text-black outline-none transition-colors placeholder:text-[#9A9AAF] focus:border-[#5E5EF4]"
      />
    </div>
  );
};

export default MealPlanSearch;
