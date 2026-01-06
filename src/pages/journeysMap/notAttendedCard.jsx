import { useTranslation } from "react-i18next";

const NotAttendedCard = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full p-4 space-y-5 bg-transparent rounded-[20px] border border-[#EE9919] my-4 ">
      <h2 className="font-medium border-b border-[#88888866] dark:border-gray-400 py-2">
        {t("journeyInfo")}
      </h2>
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-1">
          <img
            className="object-cover mx-auto rounded-full size-14 w-fit"
            src="https://github.com/shadcn.png"
            alt="profile"
          />
          <h2 className="font-medium text-center">أحمد ياسر</h2>
          <p className="text-[#888888] font-medium text-center dark:text-gray-400">
            0102547962
          </p>
        </div>
        <span className="text-lg font-medium text-green">500دع</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-bold text-[#717171] dark:text-gray-400">نوع الرحله</p>
          <p className="font-medium text-[#888] dark:text-gray-300 text-sm">ذهاب فقط</p>
        </div>
        <div>
          <p className="font-bold text-[#717171] dark:text-gray-400">التاريخ </p>
          <p className="font-medium text-[#888] dark:text-gray-300 text-sm">
            11/9/2025
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-bold text-[#717171] dark:text-gray-400">طريقه الدفع</p>
          <p className="font-medium text-[#888] dark:text-gray-300 text-sm">كاش</p>
        </div>
        <div>
          <p className="font-bold text-[#717171] dark:text-gray-400">وقت الوصول</p>
          <p className="font-medium text-[#888] dark:text-gray-300 text-sm">8 مساءا</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-bold text-[#717171] dark:text-gray-400">المسافة</p>
          <p className="font-medium text-[#888] dark:text-gray-300 text-sm">100متر</p>
        </div>
        <div>
          <p className="font-bold text-[#717171] dark:text-gray-400">وقت الانطلاق</p>
          <p className="font-medium text-[#888] dark:text-gray-300 text-sm">
            4:00مساءا
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotAttendedCard;
