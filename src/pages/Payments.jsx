import { useState, useEffect } from "react";
import { ResponsiveDialog } from "@/components/shared/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { Form, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CiSearch } from "react-icons/ci";
import { TableCell, TableRow } from "@/components/ui/table";
import ArabicTable from "@/components/ArabicTable";
import Loading from "@/components/feedback/Loading";
import LottieHandler from "@/components/feedback/lottieHandler/LottieHandler";
import { RiAddCircleLine } from "react-icons/ri";
import { MdRemoveCircleOutline } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import {
  getWallets,
  topUpWallet,
  deductFromWallet,
  sendNotificationToUser,
} from "@/services/adminService";

const Payments = () => {
  const [filter, setFilter] = useState("drivers");
  const [openModal, setOpenModal] = useState(false);
  const [openModalCharge, setOpenModalCharge] = useState(false);
  const [openModalDiscount, setOpenModalDiscount] = useState(false);
  const [openModalNotif, setOpenModalNotif] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchValue, setSearch] = useState("");
  const { t } = useTranslation();

  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  // Fetch wallets (drivers or passengers)
  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setLoading(true);
        const role = filter === "drivers" ? "driver" : "user";
        const res = await getWallets(role);
        setWallets(res.data || res || []);
        console.log("Fetched wallets:", res.data || res || []);
      } catch (err) {
        console.error("Failed to load wallets:", err);
        setError(t("failedToLoad") || "Failed to load wallets");
        toast.error(t("failedToLoad") || "Failed to load wallets");
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, [filter]);

  // Top Up Balance
  const handleTopUp = async (data) => {
    try {
      await topUpWallet(selectedUser._id, {
        amount: Number(data.amount),
        notes: data.notes || "",
        notify: data.notify || false,
      });
      toast.success(t("topUpSuccess") || "Balance topped up successfully");
      setOpenModalCharge(false);
      reset();
      // Refresh wallets
      const role = filter === "drivers" ? "driver" : "user";
      const res = await getWallets(role);
      setWallets(res.data || res || []);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error(t("topUpFailed") || "Failed to top up balance");
    }
  };

  // Deduct Balance
  const handleDeduct = async (data) => {
    try {
      await deductFromWallet(selectedUser._id, {
        amount: Number(data.amount),
        reason: data.reason,
        notes: data.notes || "",
        notify: data.notify || false,
      });
      toast.success(t("deductSuccess") || "Balance deducted successfully");
      setOpenModalDiscount(false);
      reset();
      const role = filter === "drivers" ? "driver" : "user";
      const res = await getWallets(role);
      setWallets(res.data || res || []);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error(t("deductFailed") || "Failed to deduct balance");
    }
  };

  // Send Notification
  const handleSendNotification = async (data) => {
    try {
      await sendNotificationToUser(selectedUser._id, {
        title: data.title,
        body: data.body,
      });
      toast.success(t("notificationSent") || "Notification sent successfully");
      setOpenModalNotif(false);
      reset();
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error(t("notificationFailed") || "Failed to send notification");
    }
  };

  const headData = [
    t("userName"),

    t("availableBalance"),
    t("currentBalance"),
    t("status"),
    t("lastTransaction"),
    t("actions"),
  ];

  // Filtered list based on search
  const filteredWallets = wallets.filter(
    (w) =>
      w.user?.fullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
      w.user?.phone?.includes(searchValue) ||
      w.user?.email?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="container py-8">
      <div className="mt-8">
        <h1 className="text-2xl font-medium text-[#222222] dark:text-white">
          {t("walletManagement")}
        </h1>
        <div className="p-6 mt-8 bg-white rounded-[20px] dark:bg-gray-900">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-base font-medium text-[#111111] dark:text-white">
              {t("walletList")}
            </h1>
            <div className="flex items-center gap-4">
              <div
                onClick={() => setFilter("drivers")}
                className={`px-4 py-1 w-[128px] text-center cursor-pointer border transition-all rounded-[5px] ${
                  filter === "drivers"
                    ? "text-primary-1 bg-[#007AFF26] border-primary-1"
                    : "border-[#88888880]"
                }`}
              >
                {t("drivers")}
              </div>
              <div
                onClick={() => setFilter("passengers")}
                className={`px-4 py-1 w-[128px] text-center cursor-pointer border transition-all rounded-[5px] ${
                  filter === "passengers"
                    ? "text-primary-1 bg-[#007AFF26] border-primary-1"
                    : "border-[#88888880]"
                }`}
              >
                {t("passengers")}
              </div>
            </div>

            <div className="relative flex items-center">
              <Input
                value={searchValue}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                className="px-[28px] dark:bg-gray-800 dark:text-white placeholder:dark:text-gray-400 min-h-[40px] rounded-full border-none bg-[#F9F9F9] text-black py-2 focus:outline-none focus:ring-1 focus:ring-primary-1 placeholder:text-[#888888]"
                placeholder={t("searchByNamePhoneEmail")}
              />
              <CiSearch
                size={20}
                className="absolute right-2 text-[#888888] dark:text-white"
              />
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => setOpenModal(true)}
                className="flex items-center gap-2 text-white"
              >
                <span>{t("changeCommission")}</span>
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <ArabicTable headData={headData}>
              {loading ? (
                <Loading
                  type="table"
                  status={true}
                  td={headData.length}
                  tr={8}
                />
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={headData.length}
                    className="text-center text-red-500 py-10"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : filteredWallets.length > 0 ? (
                filteredWallets.map((wallet) => {
                  const user = wallet.user || {};
                  return (
                    <TableRow
                      key={wallet._id}
                      className="border-t text-center text-[#888888] hover:dark:bg-gray-800 dark:text-white"
                    >
                      <TableCell className="flex items-center justify-center gap-2 font-medium">
                        <img
                          src={user.profileImg || "/assets/driver.png"}
                          alt={user.fullName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        {user.fullName || "Not specified"}
                      </TableCell>

                      <TableCell>
                        <div className="py-2 bg-[#E6F4EF] border text-primary-1 border-[#3872FA] rounded">
                          {wallet.availableBalance || 0}
                        </div>
                      </TableCell>
                      <TableCell>{wallet.currentBalance || 0}</TableCell>
                      <TableCell>
                        {wallet.isActive ? t("active") : t("inactive")}
                      </TableCell>
                      <TableCell>{wallet.lastTransaction || "-"}</TableCell>

                      <TableCell>
                        <div className="flex items-center justify-center gap-4">
                          <button
                            className="text-[#3872FA]"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenModalCharge(true);
                            }}
                          >
                            <RiAddCircleLine size={20} />
                          </button>

                          <button
                            className="text-[#EC373B]"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenModalDiscount(true);
                            }}
                          >
                            <MdRemoveCircleOutline size={20} />
                          </button>

                          <button
                            className="text-[#EE9919]"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenModalNotif(true);
                            }}
                          >
                            <IoIosNotificationsOutline size={22} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
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

        {/* Change Commission Modal */}
        <ResponsiveDialog open={openModal} setOpen={setOpenModal}>
          <div className="p-10">
            <h2 className="mb-4 text-xl font-medium text-center md:text-2xl">
              {t("changeCommissionRate")}
            </h2>
            <Form>
              <form
                onSubmit={handleSubmit(() =>
                  toast.success("Commission updated (mock)")
                )}
                className="space-y-6"
              >
                <Controller
                  name="passengerRate"
                  control={control}
                  rules={{ required: t("contentRequired") }}
                  render={({ field }) => (
                    <FormItem>
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("passengerRate")}
                      </label>
                      <Input
                        {...field}
                        className="no-focus text-red font-bold min-h-[56px] dark:bg-gray-800 dark:text-white bg-[#F9F9F9]"
                      />
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.passengerRate?.message}
                      </span>
                    </FormItem>
                  )}
                />

                <Controller
                  name="driverRate"
                  control={control}
                  rules={{ required: t("contentRequired") }}
                  render={({ field }) => (
                    <FormItem>
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("driverRate")}
                      </label>
                      <Input
                        {...field}
                        className="no-focus text-red font-bold min-h-[56px] dark:bg-gray-800 dark:text-white bg-[#F9F9F9]"
                      />
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.driverRate?.message}
                      </span>
                    </FormItem>
                  )}
                />

                <div className="flex justify-center gap-6">
                  <Button type="submit" className="w-[200px] text-white">
                    {t("add")}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setOpenModal(false)}
                    className="bg-red hover:bg-red w-[200px] text-white"
                  >
                    {t("cancel")}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ResponsiveDialog>

        {/* Top Up Modal */}
        <ResponsiveDialog open={openModalCharge} setOpen={setOpenModalCharge}>
          <div className="p-10">
            <h2 className="mb-4 text-xl font-medium text-center md:text-2xl">
              {t("topUpBalance")}
            </h2>
            <p className="mb-4">
              {t("user")}: {selectedUser?.fullName || "Not selected"} (
              {filter === "drivers" ? t("driver") : t("passenger")})
            </p>
            <Form>
              <form onSubmit={handleSubmit(handleTopUp)} className="space-y-6">
                <Controller
                  name="amount"
                  control={control}
                  rules={{ required: t("contentRequired") }}
                  render={({ field }) => (
                    <FormItem>
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("amount")}
                      </label>
                      <Input
                        {...field}
                        type="number"
                        placeholder={t("enterAmount")}
                        className="min-h-[56px] dark:bg-gray-800 dark:text-white bg-[#F9F9F9]"
                      />
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.amount?.message}
                      </span>
                    </FormItem>
                  )}
                />

                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("notes")}
                      </label>
                      <textarea
                        {...field}
                        rows={4}
                        className="w-full rounded-md px-3 py-2 dark:bg-gray-800 dark:text-white bg-[#F9F9F9]"
                      />
                    </FormItem>
                  )}
                />

                <Controller
                  name="notify"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                        />
                        <label className="font-semibold text-[#717171] dark:text-white">
                          {t("notifyUser")}
                        </label>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-6">
                  <Button
                    type="button"
                    onClick={() => setOpenModalCharge(false)}
                    className="bg-transparent border border-[#888888] text-[#888888] hover:bg-transparent"
                  >
                    {t("cancel")}
                  </Button>
                  <Button type="submit" className="text-white">
                    {t("confirmTopUp")}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ResponsiveDialog>

        {/* Deduct Modal */}
        <ResponsiveDialog
          open={openModalDiscount}
          setOpen={setOpenModalDiscount}
        >
          <div className="p-10">
            <h2 className="mb-4 text-xl font-medium text-center md:text-2xl">
              {t("deductBalance")}
            </h2>
            <p className="mb-4">
              {t("user")}: {selectedUser?.fullName || "Not selected"} (
              {filter === "drivers" ? t("driver") : t("passenger")})
            </p>
            <Form>
              <form onSubmit={handleSubmit(handleDeduct)} className="space-y-6">
                <Controller
                  name="amount"
                  control={control}
                  rules={{ required: t("contentRequired") }}
                  render={({ field }) => (
                    <FormItem>
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("amount")}
                      </label>
                      <Input
                        {...field}
                        type="number"
                        placeholder={t("enterAmount")}
                        className="min-h-[56px] dark:bg-gray-800 dark:text-white bg-[#F9F9F9]"
                      />
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.amount?.message}
                      </span>
                    </FormItem>
                  )}
                />

                <Controller
                  name="reason"
                  control={control}
                  rules={{ required: t("contentRequired") }}
                  render={({ field }) => (
                    <FormItem>
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("deductionReason")}
                      </label>
                      <Input
                        {...field}
                        placeholder={t("selectDeductionReason")}
                        className="min-h-[56px] dark:bg-gray-800 dark:text-white bg-[#F9F9F9]"
                      />
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.reason?.message}
                      </span>
                    </FormItem>
                  )}
                />

                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("notes")}
                      </label>
                      <textarea
                        {...field}
                        rows={4}
                        className="w-full rounded-md px-3 py-2 dark:bg-gray-800 dark:text-white bg-[#F9F9F9]"
                      />
                    </FormItem>
                  )}
                />

                <Controller
                  name="notify"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                        />
                        <label className="font-semibold text-[#717171] dark:text-white">
                          {t("notifyUser")}
                        </label>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-6">
                  <Button
                    type="button"
                    onClick={() => setOpenModalDiscount(false)}
                    className="bg-transparent border border-[#888888] text-[#888888] hover:bg-transparent"
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#EC373B] text-white hover:bg-[#EC373B]"
                  >
                    {t("confirmDeduction")}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ResponsiveDialog>

        {/* Send Notification Modal */}
        <ResponsiveDialog open={openModalNotif} setOpen={setOpenModalNotif}>
          <div className="p-10">
            <h2 className="mb-4 text-xl font-medium text-center md:text-2xl">
              {t("sendNotification")}
            </h2>
            <p className="mb-4">
              {t("user")}: {selectedUser?.fullName || "Not selected"} (
              {filter === "drivers" ? t("driver") : t("passenger")})
            </p>
            <Form>
              <form
                onSubmit={handleSubmit(handleSendNotification)}
                className="space-y-6"
              >
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: t("contentRequired") }}
                  render={({ field }) => (
                    <FormItem>
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("notificationTitle")}
                      </label>
                      <Input
                        {...field}
                        placeholder={t("enterNotificationTitle")}
                        className="min-h-[56px] dark:bg-gray-800 dark:text-white bg-[#F9F9F9]"
                      />
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.title?.message}
                      </span>
                    </FormItem>
                  )}
                />

                <Controller
                  name="body"
                  control={control}
                  rules={{ required: t("contentRequired") }}
                  render={({ field }) => (
                    <FormItem>
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("notificationContent")}
                      </label>
                      <textarea
                        {...field}
                        rows={4}
                        className="w-full rounded-md px-3 py-2 dark:bg-gray-800 dark:text-white bg-[#F9F9F9]"
                      />
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.body?.message}
                      </span>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-6">
                  <Button
                    type="button"
                    onClick={() => setOpenModalNotif(false)}
                    className="bg-transparent border border-[#888888] text-[#888888] hover:bg-transparent"
                  >
                    {t("cancel")}
                  </Button>
                  <Button type="submit" className="text-white">
                    {t("sendNotificationNow")}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ResponsiveDialog>
      </div>
    </div>
  );
};

export default Payments;
