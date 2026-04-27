import { useState } from "react";
import { Modal, Tabs } from "@heroui/react";
import Header from "./Header";
import FoodItemTab from "./FoodItems/FoodItemTab";
import MealPlanTab from "./MealPlan/MealPlanTab";

interface MealLoggingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function MealLoggingModal({
  isOpen,
  onOpenChange,
  onSuccess,
}: MealLoggingModalProps) {
  const [activeTab, setActiveTab] = useState("food-item");

  const handleSuccess = () => {
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Modal>
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        variant="blur"
      >
        <Modal.Container placement="center" scroll="inside" size="lg">
          <Modal.Dialog className="w-full max-w-125 overflow-hidden rounded-2xl bg-white">
            {({ close: _close }) => (
              <>
                <Modal.CloseTrigger />

                <Modal.Header className="pb-0">
                  <Header />
                </Modal.Header>

                <Modal.Body className="p-0">
                  <div className="px-6 py-4">
                    <Tabs
                      selectedKey={activeTab}
                      onSelectionChange={(key) => setActiveTab(String(key))}
                    >
                      <Tabs.ListContainer>
                        <Tabs.List
                          aria-label="Log meal type"
                          className="inline-flex w-full items-center gap-1 rounded-xl bg-transparent p-1"
                        >
                          <Tabs.Tab
                            id="food-item"
                            className="flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-[13.125px] font-medium"
                          >
                            Log Food Item
                            <Tabs.Indicator />
                          </Tabs.Tab>

                          <Tabs.Tab
                            id="meal-plan"
                            className="flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-[13.125px] font-medium"
                          >
                            Log from Meal Plan
                            <Tabs.Indicator />
                          </Tabs.Tab>
                        </Tabs.List>
                      </Tabs.ListContainer>

                      <Tabs.Panel id="food-item" className="mt-4 p-0">
                        <FoodItemTab onSuccess={handleSuccess} />
                      </Tabs.Panel>

                      <Tabs.Panel id="meal-plan" className="mt-4 p-0">
                        <MealPlanTab onSuccess={handleSuccess} />
                      </Tabs.Panel>
                    </Tabs>
                  </div>
                </Modal.Body>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
