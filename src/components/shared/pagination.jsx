import { useTranslation } from "react-i18next";
import ReactPaginate from "react-paginate";
import { FiChevronsRight } from "react-icons/fi";
import { FiChevronsLeft } from "react-icons/fi";

export default function Paginate({ handlePagination, data = "" }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center justify-between gap-5 py-3">
      <ReactPaginate
        nextLabel={<FiChevronsLeft className={"rtl:rotate-180"} />}
        previousLabel={<FiChevronsRight className={"ltr:rotate-180"} />}
        className="flex items-center gap-1 py-0 md:gap-2 md:p-4"
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
        breakLinkClassName="text-mainBlue dark:text-white"
        activeLinkClassName="!bg-mainBlue !text-white"
        pageLinkClassName="grid text-mainBlue dark:text-white bg-[#E6EEFF] dark:bg-gray-700 place-items-center !min-w-0 rounded-[3px] !size-[25px] duration-300 border-none text-center hover:bg-blue-100 dark:hover:bg-gray-600 md:min-w-[2.5rem]"
        previousLinkClassName="grid place-items-center border text-black dark:text-white !min-w-0 rounded-[3px] !size-[25px] duration-300 text-center hover:bg-pagination dark:hover:bg-gray-600"
        disabledLinkClassName="opacity-50"
        nextLinkClassName="grid place-items-center border text-black dark:text-white !min-w-0 rounded-[3px] !size-[25px] duration-300 text-center hover:bg-pagination dark:hover:bg-gray-600"
        pageCount={data?.last_page || 1}
        onPageChange={({ selected }) => handlePagination(selected + 1)}
        // forcePage={data?.current_page - 1}
      />
      {data?.from && (
        <p className="text-sm text-black dark:text-white">
          {`${t("Showing")} ${data?.from} ${t("to")} ${data?.to} ${t("of")} ${
            data?.total
          } ${t("entries")}`}
        </p>
      )}
    </div>
  );
}
