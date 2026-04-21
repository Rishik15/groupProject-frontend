import { useState } from "react";
import { Modal, Button } from "@heroui/react";
import FilterList from "./FilterList";
import {
  goalItems,
  experienceItems,
  dayItems,
  sessionLengthItems,
} from "../../services/RecommendationExercises/filters";

import type { Filters, Plan } from "../../services/RecommendationExercises/types";
import get_plans from "../../services/RecommendationExercises/getPlan";

type Props = {
  filters: Filters;
  setFilters: (val: Filters) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  setPlan: (plan: Plan) => void;
};

const FilterModal = ({ filters, setFilters, isOpen, setIsOpen, setPlan }: Props) => {
  const [draftFilters, setDraftFilters] = useState<Filters>(filters);

  const handleApply = async () => {
    console.log(draftFilters)
    const data = await get_plans(draftFilters);
    console.log(data.plans)
    setFilters(draftFilters);
    setPlan(data.plans[0])
    setIsOpen(false);
  };

  const handleClose = () => {
    setDraftFilters(filters);
    setIsOpen(false);
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-[800px]">
          <Modal.CloseTrigger />

          <Modal.Header>
            <div>
              <p className="text-2xl font-bold">Edit filters</p>
              <p className="mt-1 text-[13px] font-thin text-gray-500">
                Update the options used to match a workout plan.
              </p>
            </div>
          </Modal.Header>

          <Modal.Body>
            <p className="text-[13px]">
              These fields are the only ones used to match the plan shown on this
              page.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <FilterList
                name="Goal"
                items={goalItems}
                value={draftFilters.category}
                onChange={(value) =>
                  setDraftFilters((prev) => ({ ...prev, category: value }))
                }
              />

              <FilterList
                name="Experience"
                items={experienceItems}
                value={draftFilters.level}
                onChange={(value) =>
                  setDraftFilters((prev) => ({ ...prev, level: value }))
                }
              />

              <FilterList
                name="Days per week"
                items={dayItems}
                value={draftFilters.days_per_week}
                onChange={(value) =>
                  setDraftFilters((prev) => ({ ...prev, days_per_week: value }))
                }
              />

              <FilterList
                name="Session length"
                items={sessionLengthItems}
                value={draftFilters.duration}
                onChange={(value) =>
                  setDraftFilters((prev) => ({ ...prev, duration: value }))
                }
              />
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              className="h-12 rounded-2xl border border-gray-300 bg-white text-black"
              onPress={handleClose}
            >
              Cancel
            </Button>

            <Button
              className="h-12 rounded-2xl bg-indigo-500 text-white"
              onPress={handleApply}
            >
              Apply filters
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};

export default FilterModal;