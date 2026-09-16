import Button from "../Button/Button";

type Pagination = {
  currentPage: number;
  totalResults: number;
  resultsPerPage: number;
  nextPage: number | null;
  previousPage: number | null;
};

interface PaginationProps {
  pagination: Pagination;
  handlePageChange: (newPage: string) => void;
}

export default function Pagination({
  pagination,
  handlePageChange,
}: PaginationProps) {
  const { currentPage, totalResults, resultsPerPage, nextPage, previousPage } =
    pagination;
  const startEmployeeNum = resultsPerPage * (currentPage - 1) + 1;
  const lastEmployeeNum = Math.min(
    startEmployeeNum - 1 + resultsPerPage,
    totalResults,
  );

  const handlePrevClick = () => {
    if (previousPage === null) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    handlePageChange(previousPage.toString());
  };

  const handleNextClick = () => {
    if (nextPage === null) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    handlePageChange(nextPage.toString());
  };

  if (totalResults === 0) return null;

  return (
    <div className="flex items-center justify-between w-full px-6 py-3 border-t border-gray-200 bg-white">
      <p className="text-sm text-zinc-500 3xl:text-xl">{`Employees ${startEmployeeNum}-${lastEmployeeNum} of ${totalResults}`}</p>
      <div className="flex items-center gap-2">
        <Button
          type="secondary"
          disabled={previousPage == null}
          handleClick={() => handlePrevClick()}
        >
          Previous
        </Button>
        <Button
          type="secondary"
          disabled={nextPage == null}
          handleClick={() => handleNextClick()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
