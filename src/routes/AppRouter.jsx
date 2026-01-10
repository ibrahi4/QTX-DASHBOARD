import { Route, Routes } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import Home from "@/pages/Home";
import Journeys from "@/pages/Journeys";
import Payments from "@/pages/Payments";
import DiscountCodes from "@/pages/DiscountCodes";
import Supports from "@/pages/support/Supports";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import AddJourney from "@/pages/AddJourney";
import AddCites from "@/pages/AddCites";
import Passengers from "@/pages/Passengers";
import Drivers from "@/pages/Drivers";
import CurrentJourneys from "@/pages/journeysMap/currentJourneys";
import PassengerInfo from "@/pages/passengerInfo";
import DriversInfo from "@/pages/driversInfo";
import AddAD from "@/pages/addAD";

import JourneyDetails from "@/pages/journeysMap/journeyDetials";
import Login from "@/pages/Login";
// import { useEffect } from "react";
// import Cookies from "js-cookie"
// import i18n from "@/lib/i18n";

function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/journeys" element={<Journeys />} />
        <Route path="/heat-map" element={<CurrentJourneys />} />
        <Route path="/journey-details/:id" element={<JourneyDetails />} />
        <Route path="/add-journey" element={<AddJourney />} />
        <Route path="/settings/add-ad" element={<AddAD />} />
        {/* <Route path="/settings/cities" element={<Cities />} /> */}

        <Route path="/users/passengers" element={<Passengers />} />
        <Route path="/users/passengers/:id" element={<PassengerInfo />} />
        <Route path="/users/drivers" element={<Drivers />} />
        <Route path="/users/drivers/:id" element={<DriversInfo />} />

        <Route path="/payments" element={<Payments />} />
        <Route path="/discount-codes" element={<DiscountCodes />} />
        <Route path="/supports" element={<Supports />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings/" element={<Settings />} />
        <Route path="/add-cites" element={<AddCites />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
