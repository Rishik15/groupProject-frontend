import { Pagination } from "@heroui/react";

type Props = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

const MealPlanPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: Props) => {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-4">
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous
            onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
            isDisabled={currentPage === 1}
          >
            <Pagination.PreviousIcon />
            <span>Previous</span>
          </Pagination.Previous>
        </Pagination.Item>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Pagination.Item key={page}>
            <Pagination.Link
              isActive={page === currentPage}
              onPress={() => setCurrentPage(page)}
            >
              {page}
            </Pagination.Link>
          </Pagination.Item>
        ))}

        <Pagination.Item>
          <Pagination.Next
            onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            isDisabled={currentPage === totalPages}
          >
            <span>Next</span>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
};

export default MealPlanPagination;