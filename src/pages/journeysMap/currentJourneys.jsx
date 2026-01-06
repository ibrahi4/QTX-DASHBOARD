import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setJourney } from "@/services/reducers/journey"; // تأكد من المسار
import { ResponsiveDialog } from "@/components/shared/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { CiSearch } from "react-icons/ci";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { HiDotsHorizontal } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import NotAttendedCard from "./notAttendedCard";
import JourneyCard from "./journyCard";
import SeeDetails from "./seeDetails";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "./styles.css";
import { toast } from "react-hot-toast";
import Loading from "@/components/feedback/Loading";
import { getAllRides } from "@/services/adminService";

// إصلاح أيقونات Leaflet الافتراضية
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// أيقونة النبض المخصصة
const customIcon = new L.DivIcon({
  html: `
    <div class="pulse-wrapper">
      <div class="pulse-dot"></div>
    </div>
  `,
  className: "",
  iconAnchor: [12, 12],
});

// التحقق من صحة الإحداثيات
const isInvalidCoordinates = (start, end) => {
  return (
    !start?.latitude ||
    !start?.longitude ||
    !end?.latitude ||
    !end?.longitude ||
    start.latitude === 0 ||
    start.longitude === 0 ||
    end.latitude === 0 ||
    end.longitude === 0
  );
};

// كومبوننت الـ FlyTo للخريطة
function FlyToMarker({ position, map }) {
  useEffect(() => {
    if (map && position && position.length > 0) {
      const bounds = L.latLngBounds(position);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, duration: 1.5 });
    }
  }, [position, map]);

  return null;
}

function CurrentJourneys() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const mapRef = useRef(null);
  const markerRefs = useRef({});

  const [flyToPosition, setFlyToPosition] = useState(null);
  const [filter, setFilter] = useState("inProgress");
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  // جلب الرحلات الحقيقية من الـ backend
  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getAllRides(); // /admin/rides أو /admin/journeys/current
        const rides = res.data?.rides || res.data || res || [];

        const mappedJourneys = rides.map((ride) => ({
          id: ride._id || ride.id,
          status: ride.status || "pending", // inProgress, completed, cancelled, notAttended
          driver: ride.driver?.fullName || t("unknownDriver"),
          rating: ride.driver?.rating || 0,
          starting_city:
            ride.pickupLocation?.city || ride.fromCity || t("unknown"),
          starting_position: {
            latitude:
              ride.pickupLocation?.coordinates?.[1] || ride.pickupLat || 0,
            longitude:
              ride.pickupLocation?.coordinates?.[0] || ride.pickupLng || 0,
          },
          ending_city:
            ride.dropoffLocation?.city || ride.toCity || t("unknown"),
          ending_position: {
            latitude:
              ride.dropoffLocation?.coordinates?.[1] || ride.dropoffLat || 0,
            longitude:
              ride.dropoffLocation?.coordinates?.[0] || ride.dropoffLng || 0,
          },
          rideDetails: ride, // للاستخدام في SeeDetails
        }));

        setJourneys(mappedJourneys);
      } catch (err) {
        console.error("Failed to fetch current journeys:", err);
        setError(t("failedToLoadJourneys") || "Failed to load journeys");
        toast.error(t("failedToLoadJourneys") || "Failed to load journeys");
        setJourneys([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJourneys();
  }, [t]);

  // فلترة الرحلات حسب الحالة والبحث
  const filteredJourneys = journeys.filter((j) => {
    const matchesFilter = j.status === filter;
    const matchesSearch =
      searchValue === "" ||
      j.driver?.toLowerCase().includes(searchValue.toLowerCase()) ||
      j.starting_city?.toLowerCase().includes(searchValue.toLowerCase()) ||
      j.ending_city?.toLowerCase().includes(searchValue.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getFilterLabel = () => {
    switch (filter) {
      case "inProgress":
        return "inProgressAlt";
      case "cancelled":
        return "canceledAlt";
      case "completed":
        return "completedAlt";
      case "notAttended":
        return "notAttendedAlt";
      default:
        return "inProgressAlt";
    }
  };

  return (
    <div
      style={{ height: "90%", width: "98%" }}
      className="absolute !my-4 mx-2 overflow-hidden rounded-lg"
    >
      <MapContainer
        center={[35.5648, 44.011]} // مركز افتراضي (العراق)
        zoom={8}
        style={{ height: "100%", width: "100%", zIndex: 1, direction: "ltr" }}
        zoomControl={false}
        whenCreated={(map) => (mapRef.current = map)}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Fly to selected journey */}
        <FlyToMarker position={flyToPosition?.position} map={mapRef.current} />

        {/* رسم الماركرز والخطوط للرحلات المفلترة */}
        {filteredJourneys.map((j) => {
          const start = j.starting_position;
          const end = j.ending_position;

          if (isInvalidCoordinates(start, end)) return null;

          return (
            <React.Fragment key={j.id}>
              {/* نقطة البداية */}
              <Marker
                position={[start.latitude, start.longitude]}
                icon={customIcon}
                ref={(ref) => {
                  if (ref) markerRefs.current[`${j.id}-start`] = ref;
                }}
              >
                <Popup>
                  <div className="text-center">
                    <img
                      src="/assets/carMap.png"
                      alt="car"
                      className="mx-auto mb-2 w-8"
                    />
                    <div className="font-medium">{j.starting_city}</div>
                    <div className="text-sm text-gray-600">{j.driver}</div>
                  </div>
                </Popup>
              </Marker>

              {/* نقطة النهاية */}
              <Marker
                position={[end.latitude, end.longitude]}
                icon={customIcon}
              >
                <Popup>
                  <div className="text-center font-medium">{j.ending_city}</div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        {/* الخط عند اختيار رحلة */}
        {flyToPosition && flyToPosition.position && (
          <Polyline
            positions={flyToPosition.position}
            pathOptions={{ weight: 4, color: "#3b82f6", opacity: 0.8 }}
          />
        )}
      </MapContainer>

      {/* Sidebar - قائمة الرحلات */}
      {!flyToPosition && (
        <div className="p-4 overflow-auto bg-white dark:bg-gray-800 rounded-md absolute rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2 h-[90%] z-[2] w-[380px] shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">
              {t(getFilterLabel())} ({filteredJourneys.length})
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HiDotsHorizontal className="text-xl" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setFilter("notAttended")}>
                  {t("notAttendedAlt")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("inProgress")}>
                  {t("inProgressAlt")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("completed")}>
                  {t("completedAlt")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("cancelled")}>
                  {t("canceledAlt")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* شريط البحث */}
          <section className="relative mb-4">
            <CiSearch
              size={22}
              className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-[#888888] dark:text-gray-400"
            />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              type="text"
              placeholder={t("search")}
              className="pl-10 pr-4 py-2 bg-[#F5F7FA] dark:bg-gray-900 border-none rounded-md focus:ring-2 focus:ring-primary-500"
            />
          </section>

          {/* حالة التحميل */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loading type="spinner" />
            </div>
          )}

          {/* حالة الخطأ */}
          {error && (
            <div className="text-center py-10 text-red-500">{error}</div>
          )}

          {/* قائمة الرحلات */}
          {!loading && !error && (
            <section className="space-y-3 overflow-y-auto max-h-[calc(100%-120px)]">
              {filteredJourneys.length > 0 ? (
                filteredJourneys.map((j) => {
                  const start = j.starting_position;
                  const end = j.ending_position;
                  const valid = !isInvalidCoordinates(start, end);

                  const journeyData = {
                    id: j.id,
                    position: valid
                      ? [
                          [start.latitude, start.longitude],
                          [end.latitude, end.longitude],
                        ]
                      : null,
                    start: j.starting_city,
                    end: j.ending_city,
                    status: j.status,
                    driver: j.driver,
                    rideDetails: j.rideDetails,
                  };

                  return (
                    <div key={j.id}>
                      {j.status === "notAttended" ? (
                        <Link
                          onClick={() => dispatch(setJourney(journeyData))}
                          to={`/journey-details/${j.id}`}
                        >
                          <NotAttendedCard j={j} />
                        </Link>
                      ) : (
                        <JourneyCard
                          j={j}
                          data={journeyData}
                          setFlyToPosition={setFlyToPosition}
                          valid={valid}
                          markerRefs={markerRefs}
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-gray-500">
                  {t("noJourneysFound") || "لا توجد رحلات حالية"}
                </div>
              )}
            </section>
          )}
        </div>
      )}

      {/* تفاصيل الرحلة المختارة */}
      {flyToPosition && (
        <SeeDetails
          flyToPosition={flyToPosition}
          setFlyToPosition={setFlyToPosition}
        />
      )}
    </div>
  );
}

export default CurrentJourneys;
