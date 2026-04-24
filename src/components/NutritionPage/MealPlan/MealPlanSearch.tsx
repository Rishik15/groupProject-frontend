import { Input } from "@heroui/react";

type Props = {
  search: string;
  setSearch: (value: string) => void;
};

const MealPlanSearch = ({ search, setSearch }: Props) => {
  return (
    <Input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="mb-4"
      placeholder="Search meal plans..."
    />
  );
};

export default MealPlanSearch;