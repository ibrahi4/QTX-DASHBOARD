/* eslint-disable react/prop-types */
import { useTranslation } from "react-i18next";
import ReactPaginate from "react-paginate";
import { MdChevronRight } from "react-icons/md";
import { MdChevronLeft } from "react-icons/md";

export default function CitiesPagination({ handlePagination, data = "" }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center justify-between gap-5 py-3">
      <ReactPaginate
        nextLabel={<MdChevronLeft className={"ltr:rotate-180"} />}
        previousLabel={<MdChevronRight className={"ltr:rotate-180"} />}
        className="flex items-stretch !py-0 overflow-hidden border rounded-lg"
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
        breakLinkClassName="text-mainBlue dark:text-white"
        activeLinkClassName="!bg-gray-800 dark:!bg-gray-900 !text-white"
        pageLinkClassName="grid !border !border-gray-900 !border-x !px-4 py-2 text-mainBlue dark:text-white dark:bg-gray-700 place-items-center   duration-300 border-none text-center hover:bg-[#E6EEFF] dark:hover:bg-gray-600 "
        previousLinkClassName="p-2 h-full grid place-items-center  text-black dark:text-white   duration-300 text-center hover:bg-[#E6EEFF] dark:hover:bg-gray-600"
        nextLinkClassName="p-2 h-full grid place-items-center  text-black dark:text-white  duration-300 text-center hover:bg-[#E6EEFF] dark:hover:bg-gray-600"
        disabledLinkClassName="opacity-50"
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
