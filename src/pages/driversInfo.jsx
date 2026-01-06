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
} from "../services/adminService";

const DriversInfo = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // Separate rejection states for each document section
  const [showRejectPersonal, setShowRejectPersonal] = useState(false);
  const [showRejectLicense, setShowRejectLicense] = useState(false);
  const [showRejectCarDocs, setShowRejectCarDocs] = useState(false);

  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch driver details
  useEffect(() => {
    const fetchDriver = async () => {
      if (!id) return;

      try {
        const res = await getDriverById(id);
        setDriver(res.data || res);
      } catch (err) {
        toast.error(t("failedToLoadDriver") || "Failed to load driver data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [id]);

  // Open image in modal
  const openImage = (imgUrl) => {
    if (imgUrl) {
      setSelectedImage(imgUrl);
      setOpenImageModal(true);
    }
  };

  // Approve driver (applies to all sections)
  const handleApprove = async () => {
    try {
      await approveDriver(id);
      toast.success(t("driverApproved") || "Driver approved successfully");
      setDriver({ ...driver, status: "accepted" });
    } catch (err) {
      toast.error(t("approveFailed") || "Failed to approve driver");
    }
  };

  // Reject driver with reason
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error(t("reasonRequired") || "Please provide a rejection reason");
      return;
    }

    try {
      await rejectDriver(id, rejectionReason);
      toast.success(t("driverRejected") || "Driver rejected and reason sent");
      setDriver({ ...driver, status: "rejected" });
      setRejectionReason("");
      setShowRejectPersonal(false);
      setShowRejectLicense(false);
      setShowRejectCarDocs(false);
    } catch (err) {
      toast.error(t("rejectFailed") || "Failed to reject driver");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container py-20 text-center text-xl">
        {t("loading") || "Loading..."}
      </div>
    );
  }

  // Driver not found
  if (!driver) {
    return (
      <div className="container py-20 text-center text-red-500 text-xl">
        {t("driverNotFound") || "Driver not found"}
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
              src={driver.profileImg || "/assets/driver.png"}
              alt="Driver profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-primary-1"
            />
            <h2 className="text-2xl font-bold">
              {driver.fullName || "Not specified"}
            </h2>
            <p className="text-[#888888] dark:text-gray-400">
              {driver.currentLocation?.city || driver.city || "Not specified"}
            </p>
            <span
              className={`px-5 py-2 rounded-lg font-medium text-sm ${
                driver.status === "accepted"
                  ? "bg-[#E6F4EF] text-[#11A849]"
                  : driver.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {driver.status === "accepted"
                ? t("accepted") || "Accepted"
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
                  ? new Date(driver.createdAt).toLocaleDateString()
                  : "-"}
              </p>
            </div>
            <div>
              <h2 className="text-[#717171] dark:text-gray-300">
                {t("address")}
              </h2>
              <p className="font-bold">{driver.address || "Not specified"}</p>
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
              <h2 className="font-bold text-xl">
                {driver.carType || "Not specified"}
              </h2>
              <p className="text-[#888888] dark:text-gray-400 text-lg">
                {driver.carNumber || "-"}
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
        {/* Personal Information */}
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
                  className="w-36 h-24 object-cover rounded-lg brightness-75"
                />
                <LuEye className="absolute inset-0 m-auto text-white text-3xl" />
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
                  className="w-36 h-24 object-cover rounded-lg brightness-75"
                />
                <LuEye className="absolute inset-0 m-auto text-white text-3xl" />
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
                {t("sendToDriver")}
              </Button>
            </>
          ) : (
            <div className="flex gap-4 mt-8">
              <Button onClick={handleApprove} className="flex-1 text-white">
                {t("approve")}
              </Button>
              <Button
                onClick={() => setShowRejectPersonal(true)}
                variant="outline"
                className="flex-1 border-red-600 text-red-600"
              >
                {t("reject")}
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
                  className="w-36 h-24 object-cover rounded-lg brightness-75"
                />
                <LuEye className="absolute inset-0 m-auto text-white text-3xl" />
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
                  className="w-36 h-24 object-cover rounded-lg brightness-75"
                />
                <LuEye className="absolute inset-0 m-auto text-white text-3xl" />
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
                {t("sendToDriver")}
              </Button>
            </>
          ) : (
            <div className="flex gap-4 mt-8">
              <Button onClick={handleApprove} className="flex-1 text-white">
                {t("approve")}
              </Button>
              <Button
                onClick={() => setShowRejectLicense(true)}
                variant="outline"
                className="flex-1 border-red-600 text-red-600"
              >
                {t("reject")}
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
            {driver.carLicenseFront && (
              <div
                className="relative cursor-pointer"
                onClick={() => openImage(driver.carLicenseFront)}
              >
                <img
                  src={driver.carLicenseFront}
                  alt="Car License Front"
                  className="w-36 h-24 object-cover rounded-lg brightness-75"
                />
                <LuEye className="absolute inset-0 m-auto text-white text-3xl" />
              </div>
            )}
            {driver.carLicenseBack && (
              <div
                className="relative cursor-pointer"
                onClick={() => openImage(driver.carLicenseBack)}
              >
                <img
                  src={driver.carLicenseBack}
                  alt="Car License Back"
                  className="w-36 h-24 object-cover rounded-lg brightness-75"
                />
                <LuEye className="absolute inset-0 m-auto text-white text-3xl" />
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
                {t("sendToDriver")}
              </Button>
            </>
          ) : (
            <div className="flex gap-4 mt-8">
              <Button onClick={handleApprove} className="flex-1 text-white">
                {t("approve")}
              </Button>
              <Button
                onClick={() => setShowRejectCarDocs(true)}
                variant="outline"
                className="flex-1 border-red-600 text-red-600"
              >
                {t("reject")}
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
