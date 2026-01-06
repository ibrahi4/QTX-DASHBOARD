import { useState, useEffect } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import ArabicTable from "@/components/ArabicTable";
import Loading from "@/components/feedback/Loading";
import LottieHandler from "@/components/feedback/lottieHandler/LottieHandler";
import { ResponsiveDialog } from "@/components/shared/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CiSearch } from "react-icons/ci";
import { Switch } from "@/components/ui/switch";
import { RiDeleteBinLine } from "react-icons/ri";
import DateInput from "@/components/ui/dateInput";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { BsReply } from "react-icons/bs";
import Chat from "./chat";
import { getAllComplaints } from "@/services/adminService"; // نستخدم نفس الدالة بس نعدلها في الـ service

const Supports = () => {
  const [open, setOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const { t } = useTranslation();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { control } = useForm();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getAllComplaints(); // دلوقتي هيجيب من /admin/complaints
        const complaintsData = res.data?.data || res.data || [];

        setComplaints(complaintsData);
      } catch (err) {
        console.error("Failed to load complaints:", err);
        setError(t("failedToLoad") || "Failed to load complaints");
        toast.error(t("failedToLoad") || "Failed to load complaints");
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [t]);

  const handleCheckboxChange = (complaintId) => {
    setSelectedRows((prev) =>
      prev.includes(complaintId)
        ? prev.filter((id) => id !== complaintId)
        : [...prev, complaintId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredComplaints.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredComplaints.map((c) => c._id));
    }
  };

  const headData = [
    t("complaintOwner"),
    t("complaintNumber"),
    t("complaintStatus"),
    t("complaintDate"),
    t("supportAgent"),
  ];

  const filteredComplaints = complaints.filter(
    (c) =>
      c.user?.fullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
      c.complaintNumber?.includes(searchValue) ||
      (c.supportAgent?.fullName || c.supportAgent || "")
        .toLowerCase()
        .includes(searchValue.toLowerCase())
  );

  return (
    <div className="container py-8">
      <div className="mt-4 p-6 bg-white rounded-[20px] dark:bg-gray-900">
        <h1 className="text-2xl font-medium text-[#222222] mb-8 dark:text-white">
          {t("supportAndComplaints")}
        </h1>

        <div className="flex flex-wrap items-center justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex items-center">
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                type="text"
                className="px-[28px] dark:bg-gray-800 dark:text-white placeholder:dark:text-gray-400 min-h-[40px] rounded-[5px] border-none bg-[#F9F9F9] text-black py-2 focus:outline-none focus:ring-1 focus:ring-primary-1 placeholder:text-[#888888]"
                placeholder={t("searchUser")}
              />
              <CiSearch
                size={20}
                className="absolute ltr:left-2 rtl:right-2 text-[#888888] dark:text-white"
              />
            </div>

            <div>
              <Select>
                <SelectTrigger className="w-[150px] focus:border-[#C9CDF6] focus:ring-0 dark:text-white">
                  <SelectValue placeholder={t("allUsers")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Controller
                name="join"
                control={control}
                render={({ field }) => (
                  <FormItem className="relative w-full text-black">
                    <DateInput
                      value={field.value || null}
                      onChange={field.onChange}
                      placeholder={t("date")}
                    />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <Switch
                checked={
                  selectedRows.length === filteredComplaints.length &&
                  filteredComplaints.length > 0
                }
                onCheckedChange={handleSelectAll}
                className="data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-[#11A849]"
              />
            </div>
            <div>
              <Button
                disabled={selectedRows.length === 0}
                className="bg-transparent text-[14px] text-[#EC373B] border border-[#EC373B] shadow-none hover:bg-[#EC373B] hover:text-white transition duration-200 ease-in-out flex items-center gap-2 disabled:opacity-50"
              >
                <RiDeleteBinLine size={16} />
                {t("delete")}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <ArabicTable headData={headData}>
            {loading ? (
              <Loading type="table" status={true} td={headData.length} tr={8} />
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={headData.length}
                  className="text-center text-red-500 py-10"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredComplaints.length > 0 ? (
              filteredComplaints.map((item) => (
                <TableRow
                  key={item._id}
                  className="text-center border-t hover:dark:bg-gray-800"
                >
                  <TableCell className="flex items-center justify-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item._id)}
                      onChange={() => handleCheckboxChange(item._id)}
                    />
                    <img
                      src={item.user?.profileImg || "/assets/driver.png"}
                      alt={item.user?.fullName}
                      className="w-[50px] h-[50px] object-cover rounded-full"
                    />
                    {item.user?.fullName || t("notSpecified")}
                  </TableCell>

                  <TableCell>{item.complaintNumber || "-"}</TableCell>

                  <TableCell>
                    <p
                      className={`text-center w-fit mx-auto px-3 py-2 rounded-md font-semibold text-sm ${
                        item.status === "resolved" || item.status === "solved"
                          ? "text-green bg-[#E6F4EF]"
                          : "text-yellow-800 bg-yellow-100"
                      }`}
                    >
                      {item.status === "resolved" || item.status === "solved"
                        ? t("solved")
                        : t("pending")}
                    </p>
                  </TableCell>

                  <TableCell>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("ar-EG")
                      : "-"}
                  </TableCell>

                  <TableCell>
                    <div
                      className="flex items-center justify-center gap-2 cursor-pointer"
                      onClick={() => {
                        setSelectedComplaint(item);
                        setOpen(true);
                      }}
                    >
                      {item.supportAgent?.fullName ||
                        item.supportAgent ||
                        t("notAssigned")}
                      <BsReply size={24} className="ltr:scale-x-[-1]" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={headData.length}>
                  <LottieHandler type="empty" message={t("noData")} />
                </TableCell>
              </TableRow>
            )}
          </ArabicTable>
        </div>
      </div>

      <ResponsiveDialog open={open} setOpen={setOpen}>
        <Chat complaint={selectedComplaint} />
      </ResponsiveDialog>
    </div>
  );
};

export default Supports;
