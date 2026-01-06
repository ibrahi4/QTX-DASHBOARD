import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
  
  function CustomPagination({
    setCurrentPage,
    last_page,
    currentPage,
    setIsFirstMount,
    skeleton,
  }) {
    return (
      <Pagination dir="ltr">
        <PaginationContent>
          <PaginationItem className="text-white">
            <button
              disabled={+currentPage === 1}
              onClick={() => {
                {
                  setIsFirstMount && setIsFirstMount((curr) => ++curr);
                }
                setCurrentPage((prev) => prev - 1);
              }}
            >
              <PaginationPrevious />
            </button>
          </PaginationItem>
          {/* <PaginationItem> */}
          {/* <PaginationLink href="#">1</PaginationLink> */}
          {/* </PaginationItem> */}
          <PaginationItem>
            {skeleton ? (
              skeleton
            ) : (
              <PaginationLink
                href="#"
                isActive
                className={`mx-1 text-green-1`}
              >
                {currentPage}
              </PaginationLink>
            )}
          </PaginationItem>
          {/* <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem> */}
          <PaginationItem className="text-white">
            <button
              disabled={+currentPage === +last_page || +currentPage > +last_page}
              onClick={() => {
                {
                  setIsFirstMount && setIsFirstMount((curr) => ++curr);
                }
                setCurrentPage((prev) => ++prev);
              }}
            >
              <PaginationNext />
            </button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }

export default CustomPagination;