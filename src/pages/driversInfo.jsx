/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ResponsiveDialog } from "@/components/shared/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { LuEye } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import {
  getDriverById,
  approveDriver,
  rejectDriver,
} from "@/services/adminService";
import Loading from "@/components/feedback/Loading";

const DriversInfo = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // حالات رفض منفصلة لكل قسم (شخصي - رخصة - أوراق السيارة)
  const [showRejectPersonal, setShowRejectPersonal] = useState(false);
  const [showRejectLicense, setShowRejectLicense] = useState(false);
  const [showRejectCarDocs, setShowRejectCarDocs] = useState(false);

  const [rejectionReason, setRejectionReason] = useState("");

  // جلب بيانات السائق حسب الـ ID من الـ URL
  useEffect(() => {
    if (!id) {
      setError("No driver ID provided");
      setLoading(false);
      return;
    }

    const fetchDriver = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getDriverById(id);
        const driverData = res.data || res;
        console.log("Fetched driver data:", driverData);
        // معالجة البيانات الفعلية مع fallback لكل حقل
        setDriver({
          ...driverData,
          profileImg: driverData.profileImg || "/assets/driver.png",
          fullName: driverData.fullName || "غير محدد",
          phone: driverData.phone || "-",
          email: driverData.email || "-",
          city:
            driverData.city || driverData.currentLocation?.city || "غير محدد",
          status: driverData.status || "pending",
          vehicleType:
            driverData.vehicleType ||
            driverData.driverProfile?.vehicleName ||
            "-",
          vehiclePlateNumber:
            driverData.vehiclePlateNumber ||
            driverData.driverProfile?.vehiclePlateNumber ||
            "-",
          licenseFront: driverData.driverProfile?.licenseFront,
          licenseBack: driverData.driverProfile?.licenseBack,
          carRegFront: driverData.driverProfile?.carRegFront,
          carRegBack: driverData.driverProfile?.carRegBack,
          nationalIdFront: driverData.driverProfile?.nationalIdFront,
          nationalIdBack: driverData.driverProfile?.nationalIdBack,
          createdAt: driverData.createdAt,
          licenseExpiry: driverData.driverProfile?.licenseExpiry || "-",
        });
      } catch (err) {
        console.error("Failed to fetch driver:", err);
        setError(t("failedToLoadDriver") || "Failed to load driver data");
        toast.error(t("failedToLoadDriver") || "Failed to load driver data");
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [id, t]);

  // فتح صورة في مودال
  const openImage = (imgUrl) => {
    if (imgUrl) {
      setSelectedImage(imgUrl);
      setOpenImageModal(true);
    }
  };

  // قبول السائق (لكل الأقسام)
  const handleApprove = async () => {
    try {
      await approveDriver(id);
      toast.success(t("driverApproved") || "Driver approved successfully");
      setDriver((prev) => ({ ...prev, status: "active" }));
    } catch (err) {
      toast.error(t("approveFailed") || "Failed to approve driver");
    }
  };

  // رفض السائق مع السبب
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error(t("reasonRequired") || "Please provide a rejection reason");
      return;
    }

    try {
      await rejectDriver(id, rejectionReason);
      toast.success(t("driverRejected") || "Driver rejected successfully");
      setDriver((prev) => ({ ...prev, status: "rejected" }));
      setRejectionReason("");
      setShowRejectPersonal(false);
      setShowRejectLicense(false);
      setShowRejectCarDocs(false);
    } catch (err) {
      toast.error(t("rejectFailed") || "Failed to reject driver");
    }
  };

  // حالة التحميل
  if (loading) {
    return (
      <div className="container py-20 flex justify-center items-center min-h-screen">
        <Loading type="spinner" />
      </div>
    );
  }

  // حالة الخطأ أو عدم وجود بيانات
  if (error || !driver) {
    return (
      <div className="container py-20 text-center text-red-500 text-xl min-h-screen flex items-center justify-center">
        {error || t("driverNotFound") || "Driver not found"}
      </div>
    );
  }

  return (
    <main className="container py-8 space-y-8">
      {/* General Information Section */}
      <section className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-b dark:border-gray-700">
          <div className="space-y-6">
            <div>
              <h2 className="text-[#717171] dark:text-gray-300">
                {t("phone")}
              </h2>
              <p className="font-bold text-lg">{driver.phone || "-"}</p>
            </div>
            <div>
              <h2 className="text-[#717171] dark:text-gray-300">
                {t("email")}
              </h2>
              <p className="font-bold">{driver.email || "-"}</p>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <img
              src={driver.profileImg}
              alt="Driver profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-primary-1"
            />
            <h2 className="text-2xl font-bold">
              {driver.fullName || "Not specified"}
            </h2>

            <span
              className={`px-5 py-2 rounded-lg font-medium text-sm ${
                driver.status === "active" || driver.status === "accepted"
                  ? "bg-[#E6F4EF] text-[#11A849]"
                  : driver.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {driver.status === "active" || driver.status === "accepted"
                ? t("approved") || "Accepted"
                : driver.status === "pending"
                ? t("pending") || "Pending"
                : t("rejected") || "Rejected"}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-[#717171] dark:text-gray-300">
                {t("joinDate")}
              </h2>
              <p className="font-bold">
                {driver.createdAt
                  ? new Date(driver.createdAt).toLocaleDateString("ar-EG")
                  : "-"}
              </p>
            </div>
            <div>
              <h2 className="text-[#717171] dark:text-gray-300">
                {t("address")}
              </h2>
              <p className="font-bold">
                {driver.destinationFilter.address || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="flex flex-wrap items-center justify-between gap-6 py-8">
          <div className="flex items-center gap-5">
            <img
              src="/assets/car.png"
              alt="Vehicle"
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div>
              <h2 className="font-bold text-xl">{driver.vehicleType || "-"}</h2>
              <p className="text-[#888888] dark:text-gray-400 text-lg">
                {driver.vehiclePlateNumber || "-"}
              </p>
            </div>
          </div>
          <p className="bg-[#F8F8F8] dark:bg-gray-800 px-6 py-3 rounded-lg font-medium text-lg">
            {driver.carYear || "-"}
          </p>
          <span className="font-medium text-[#717171] dark:text-white text-lg">
            {driver.carColor || "-"}
          </span>
        </div>
      </section>

      {/* Document Sections */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Personal Information - National ID */}
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <h2 className="text-xl font-bold pb-3 border-b dark:border-gray-700">
            {t("personalInfo")}
          </h2>

          <h3 className="mt-5 font-medium text-[#717171] dark:text-gray-400">
            {t("nationalID")}
          </h3>

          <div className="flex flex-wrap gap-4 my-5">
            {driver.nationalIdFront && (
              <div
                className="relative cursor-pointer"
                onClick={() => openImage(driver.nationalIdFront)}
              >
                <img
                  src={driver.nationalIdFront}
                  alt="National ID Front"
                  className="w-36 h-24 object-cover rounded-lg brightness-75 hover:brightness-100 transition"
                />
                <LuEye className="absolute inset-0 m-auto text-white text-3xl opacity-0 hover:opacity-100 transition" />
              </div>
            )}
            {driver.nationalIdBack && (
              <div
                className="relative cursor-pointer"
                onClick={() => openImage(driver.nationalIdBack)}
              >
                <img
                  src={driver.nationalIdBack}
                  alt="National ID Back"
                  className="w-36 h-24 object-cover rounded-lg brightness-75 hover:brightness-100 transition"
                />
                <LuEye className="absolute inset-0 m-auto text-white text-3xl opacity-0 hover:opacity-100 transition" />
              </div>
            )}
          </div>

          {showRejectPersonal ? (
            <>
              <h3 className="font-medium text-[#717171] dark:text-gray-400">
                {t("rejectionReason")}
              </h3>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 mt-2 rounded-lg bg-[#F8F8F8] dark:bg-gray-800 h-24 resize-none"
                placeholder={
                  t("writeRejectionReason") || "Write rejection reason..."
                }
              />
              <Button onClick={handleReject} className="w-full mt-4 text-white">
                {t("sendToDriver") || "Send to driver"}
              </Button>
            </>
          ) : (
            <div className="flex gap-4 mt-8">
              <Button onClick={handleApprove} className="flex-1 text-white">
                {t("approve") || "Approve"}
              </Button>
              <Button
                onClick={() => setShowRejectPersonal(true)}
                variant="outline"
                className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
              >
                {t("reject") || "Reject"}
              </Button>
            </div>
          )}
        </div>

        {/* Driver License */}
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <h2 className="text-xl font-bold pb-3 border-b dark:border-gray-700">
            {t("driverLicense")}
          </h2>

          <div className="flex flex-wrap gap-4 my-5">
            {driver.licenseFront && (
              <div
                className="relative cursor-pointer"
                onClick={() => openImage(driver.licenseFront)}
              >
                <img
                  src={driver.licenseFront}
                  alt="License Front"
                  className="w-36 h-24 object-cover rounded-lg brightness-75 hover:brightness-100 transition"
                />
                <LuEye className="absolute inset-0 m-auto text-white text-3xl opacity-0 hover:opacity-100 transition" />
              </div>
            )}
            {driver.licenseBack && (
              <div
                className="relative cursor-pointer"
                onClick={() => openImage(driver.licenseBack)}
              >
                <img
                  src={driver.licenseBack}
                  alt="License Back"
                  className="w-36 h-24 object-cover rounded-lg brightness-75 hover:brightness-100 transition"
                />
                <LuEye className="absolute inset-0 m-auto text-white text-3xl opacity-0 hover:opacity-100 transition" />
              </div>
            )}
          </div>

          <p className="p-3 bg-[#F8F8F8] dark:bg-gray-800 rounded-lg">
            {t("licenseExpiryDate")}: {driver.licenseExpiry || "-"}
          </p>

          {showRejectLicense ? (
            <>
              <h3 className="font-medium text-[#717171] dark:text-gray-400 mt-4">
                {t("rejectionReason")}
              </h3>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 mt-2 rounded-lg bg-[#F8F8F8] dark:bg-gray-800 h-24 resize-none"
                placeholder={
                  t("writeRejectionReason") || "Write rejection reason..."
                }
              />
              <Button onClick={handleReject} className="w-full mt-4 text-white">
                {t("sendToDriver") || "Send to driver"}
              </Button>
            </>
          ) : (
            <div className="flex gap-4 mt-8">
              <Button onClick={handleApprove} className="flex-1 text-white">
                {t("approve") || "Approve"}
              </Button>
              <Button
                onClick={() => setShowRejectLicense(true)}
                variant="outline"
                className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
              >
                {t("reject") || "Reject"}
              </Button>
            </div>
          )}
        </div>

        {/* Car Documents */}
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <h2 className="text-xl font-bold pb-3 border-b dark:border-gray-700">
            {t("carDocs")}
          </h2>

          <div className="flex flex-wrap gap-4 my-5">
            {driver.carRegFront && (
              <div
                className="relative cursor-pointer"
                onClick={() => openImage(driver.carRegFront)}
              >
                <img
                  src={driver.carRegFront}
                  alt="Car Registration Front"
                  className="w-36 h-24 object-cover rounded-lg brightness-75 hover:brightness-100 transition"
                />
                <LuEye className="absolute inset-0 m-auto text-white text-3xl opacity-0 hover:opacity-100 transition" />
              </div>
            )}
            {driver.carRegBack && (
              <div
                className="relative cursor-pointer"
                onClick={() => openImage(driver.carRegBack)}
              >
                <img
                  src={driver.carRegBack}
                  alt="Car Registration Back"
                  className="w-36 h-24 object-cover rounded-lg brightness-75 hover:brightness-100 transition"
                />
                <LuEye className="absolute inset-0 m-auto text-white text-3xl opacity-0 hover:opacity-100 transition" />
              </div>
            )}
          </div>

          {showRejectCarDocs ? (
            <>
              <h3 className="font-medium text-[#717171] dark:text-gray-400 mt-4">
                {t("rejectionReason")}
              </h3>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 mt-2 rounded-lg bg-[#F8F8F8] dark:bg-gray-800 h-24 resize-none"
                placeholder={
                  t("writeRejectionReason") || "Write rejection reason..."
                }
              />
              <Button onClick={handleReject} className="w-full mt-4 text-white">
                {t("sendToDriver") || "Send to driver"}
              </Button>
            </>
          ) : (
            <div className="flex gap-4 mt-8">
              <Button onClick={handleApprove} className="flex-1 text-white">
                {t("approve") || "Approve"}
              </Button>
              <Button
                onClick={() => setShowRejectCarDocs(true)}
                variant="outline"
                className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
              >
                {t("reject") || "Reject"}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Image Zoom Modal */}
      <ResponsiveDialog open={openImageModal} setOpen={setOpenImageModal}>
        <div className="p-4 max-w-4xl mx-auto">
          <img
            src={selectedImage}
            alt="Enlarged document"
            className="w-full max-h-screen object-contain rounded-lg shadow-2xl"
          />
        </div>
      </ResponsiveDialog>
    </main>
  );
};

export default DriversInfo;
