import NutritionTabs from "./Tabs";

const Nutrition = ({ contract_Id }: { contract_Id: number }) => {
  return (
    <section>
      <div className="px-36 py-6">
        <div className="flex items-left">
          <NutritionTabs contract_Id={contract_Id} />
        </div>
      </div>
    </section>
  );
};

export default Nutrition;
