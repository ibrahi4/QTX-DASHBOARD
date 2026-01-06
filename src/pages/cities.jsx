/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import CitiesPagination from "@/components/shared/cities/pagination";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { RiEditLine } from "react-icons/ri";
import { MapContainer, TileLayer } from "react-leaflet";
import { FaRegMap } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import Loading from "@/components/feedback/Loading";
import LottieHandler from "@/components/feedback/lottieHandler/LottieHandler";
import {
  updateCityFeatures,
  getAllCitiesWithRegions,
} from "@/services/adminService";

const Cities = () => {
  const { t } = useTranslation();

  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const res = await getAllCitiesWithRegions();
        const data = res.data || res || [];
        console.log("Fetched cities:", data);

        setCities(data);
        if (data.length > 0) {
          setSelectedCity(data[0]);
        }
      } catch (err) {
        console.error("Failed to load cities:", err);
        setError(t("failedToLoad") || "Failed to load cities");
        toast.error(t("failedToLoad") || "Failed to load cities");
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [t]);

  // تحديث ميزة في المدينة
  const handleToggleFeature = async (cityId, featureKey, value) => {
    try {
      await updateCityFeatures(cityId, { [featureKey]: value });
      toast.success(t("updated") || "Updated successfully");

      // تحديث البيانات محليًا
      setCities((prev) =>
        prev.map((city) =>
          city._id === cityId
            ? { ...city, features: { ...city.features, [featureKey]: value } }
            : city
        )
      );
    } catch (err) {
      toast.error(t("updateFailed") || "Update failed");
    }
  };

  return (
    <main className="container py-8">
      <div className="p-4 mt-8 space-y-5">
        {/* Pagination */}
        <section className="bg-white rounded-[20px] p-4 shadow-main dark:bg-gray-900 flex items-center justify-between">
          <p>
            {t("view")} 1 {t("to")} 5 {t("from")} 12 {t("result")}
          </p>
          <CitiesPagination
            handlePagination={() => {}}
            data={{ last_page: 5 }}
          />
        </section>

        {/* City Features */}
        <section>
          <h2 className="my-4 text-lg font-bold">{t("cityFeatures")}</h2>

          {loading ? (
            <div className="text-center py-10">
              <Loading type="spinner" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {cities.map((c) => (
                <div
                  key={c._id || c.id}
                  className="bg-white dark:bg-gray-900 rounded-[10px] p-5 shadow"
                >
                  <div className="flex items-center justify-between my-5">
                    <span className="font-medium">{c.name}</span>
                    <span
                      className={`p-1 px-2 text-sm rounded-full ${
                        c.isActive
                          ? "text-green bg-green/10"
                          : "text-red-600 bg-red-100"
                      }`}
                    >
                      {c.isActive ? t("active") : t("inactive")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 my-4">
                    <Label className="text-sm font-medium text-gray-700 dark:text-white whitespace-nowrap">
                      {t("enableRatings")}
                    </Label>
                    <Switch
                      checked={c.features?.ratings ?? true}
                      onCheckedChange={(checked) =>
                        handleToggleFeature(c._id || c.id, "ratings", checked)
                      }
                      className="data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-[#11A849]"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 my-4">
                    <Label className="text-sm font-medium text-gray-700 dark:text-white whitespace-nowrap">
                      {t("enableDigitalPayments")}
                    </Label>
                    <Switch
                      checked={c.features?.payments ?? true}
                      onCheckedChange={(checked) =>
                        handleToggleFeature(c._id || c.id, "payments", checked)
                      }
                      className="data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-[#11A849]"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 my-4">
                    <Label className="text-sm font-medium text-gray-700 dark:text-white whitespace-nowrap">
                      {t("enablePromotions")}
                    </Label>
                    <Switch
                      checked={c.features?.promotions ?? true}
                      onCheckedChange={(checked) =>
                        handleToggleFeature(
                          c._id || c.id,
                          "promotions",
                          checked
                        )
                      }
                      className="data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-[#11A849]"
                    />
                  </div>

                  <div className="py-3 border-t border-[#888888] dark:border-gray-700">
                    <button
                      onClick={() => setSelectedCity(c)}
                      className="flex items-center justify-center w-full gap-2 py-1 border rounded-lg dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      <HiOutlineLocationMarker />
                      {t("workZonesManagement")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Work Zones Management */}
        {selectedCity && (
          <section>
            <h2 className="my-4 text-lg font-bold">
              {t("workZonesManagement")} - {selectedCity.name}
            </h2>
            <div className="bg-white rounded-[20px] flex flex-wrap gap-4 p-4 shadow-main dark:bg-gray-900 justify-between">
              {/* Map */}
              <div className="order-2 w-full md:order-1 md:w-1/2">
                <MapContainer
                  center={[
                    selectedCity.coordinates?.lat || 24.7136,
                    selectedCity.coordinates?.lng || 46.6753,
                  ]}
                  zoom={11}
                  style={{
                    height: "300px",
                    width: "100%",
                    borderRadius: "10px",
                  }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </MapContainer>

                <button className="flex items-center justify-center gap-2 px-4 py-2 my-4 w-full text-white bg-primary-1 rounded-lg hover:bg-primary-1/90 transition">
                  <FaRegMap />
                  {t("defineNewZone")}
                </button>
              </div>

              {/* Regions List */}
              <div className="order-1 w-full md:order-2 md:w-1/2">
                {selectedCity.regions?.length > 0 ? (
                  selectedCity.regions.map((r) => (
                    <div
                      key={r._id || r.id}
                      className="bg-[#F9F9F9] dark:bg-gray-800 mb-4 rounded-[10px] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{r.name}</span>
                        <div className="flex items-center gap-3">
                          <RiEditLine className="text-primary-1 cursor-pointer text-lg" />
                          <RiDeleteBin5Line className="text-red cursor-pointer text-lg" />
                        </div>
                      </div>
                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            {t("priceMultiplier")}
                          </span>
                          <span>{r.multiplier || 1}x</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            {t("minFare")}
                          </span>
                          <span>{r.minFare || "15 ريال"}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <LottieHandler type="empty" message={t("noRegions")} />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default Cities;
