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
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("ellipsis");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="mt-auto w-full overflow-hidden pt-2">
      <Pagination size="sm" className="w-full justify-center">
        <Pagination.Content className="flex max-w-full items-center gap-1 overflow-hidden">
          <Pagination.Item>
            <Pagination.Previous
              isDisabled={currentPage === 1}
              onPress={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="h-8 px-2 text-[12px]"
            >
              <Pagination.PreviousIcon />
              <span>Prev</span>
            </Pagination.Previous>
          </Pagination.Item>

          {getPageNumbers().map((page, index) =>
            page === "ellipsis" ? (
              <Pagination.Item key={`ellipsis-${index}`}>
                <Pagination.Ellipsis className="h-8 min-w-8 text-[12px]" />
              </Pagination.Item>
            ) : (
              <Pagination.Item key={page}>
                <Pagination.Link
                  isActive={page === currentPage}
                  onPress={() => setCurrentPage(page)}
                  className="h-8 min-w-8 text-[12px]"
                >
                  {page}
                </Pagination.Link>
              </Pagination.Item>
            ),
          )}

          <Pagination.Item>
            <Pagination.Next
              isDisabled={currentPage === totalPages}
              onPress={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              className="h-8 px-2 text-[12px]"
            >
              <span>Next</span>
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  );
};

export default MealPlanPagination;
