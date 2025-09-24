import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HomePage } from "./pages/HomePage";
import { Login } from "./pages/Auth/Login";
import { Registration } from "./pages/Auth/Registration";
import { MyAccount } from "./pages/Account/MyAccount";
import { FooterMenus } from "./components/footerMenus/FooterMenus";
import { SelectPlans } from "./pages/BuyId/SelectPlans";
import { IdManagement } from "./pages/IdManagement/IdManagement";
import { RedirectCredit } from "./pages/buyCredit/RedirectCredit";
import { UpgradePlans } from "./pages/upgradePlans/UpgradePlans";
import PrivateRoute from "./components/PrivateRoute"; // ⬅️ import
import PublicUserRoute from "./components/PublicUserRoute";
import { Favourites } from "./pages/Favourites/Favourites";
import { FavouritesDetails } from "./pages/Favourites/FavouritesDetails";
import { History } from "./pages/History/History";
import { Admin } from "./pages/Admin/Admin";
import { EditProfile } from "./pages/Profile/EditProfile";
import { AdminAnalytics } from "./pages/Admin/AdminAnalytics";
import { Traffic } from "./pages/Admin/Traffic";
import { CountryTraffic } from "./pages/Admin/CountryTraffic";

function App() {
  const location = useLocation();

  // Hide footer on certain pages
  const hideFooter =
    location.pathname === "/login" ||
    location.pathname === "/registration" ||
    location.pathname === "/buyId" ||
    location.pathname === "/buyId/cart" ||
    location.pathname === "/id-management" ||
    location.pathname === "/buy-credit" ||
    location.pathname === "/upgrade-plans" ||
    location.pathname === "/admin" ||
    location.pathname === "/admin-analytics" ||
    location.pathname === "/traffic" ||
    location.pathname === "/country-traffic"

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicUserRoute>
              <HomePage />
            </PublicUserRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        {/* User-only Routes (regular users, not admins) */}
        <Route
          path="/my-account"
          element={
            <PrivateRoute userOnly>
              <MyAccount />
            </PrivateRoute>
          }
        />
        <Route
          path="/buyId"
          element={
            <PrivateRoute userOnly>
              <SelectPlans />
            </PrivateRoute>
          }
        />
        <Route
          path="/id-management"
          element={
            <PrivateRoute userOnly>
              <IdManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/buy-credit"
          element={
            <PrivateRoute userOnly>
              <RedirectCredit />
            </PrivateRoute>
          }
        />
        <Route
          path="/upgrade-plans"
          element={
            <PrivateRoute userOnly>
              <UpgradePlans />
            </PrivateRoute>
          }
        />
        <Route
          path="/favourites"
          element={
            <PrivateRoute userOnly>
              <Favourites />
            </PrivateRoute>
          }
        />
        <Route
          path="/favourites/:id"
          element={
            <PrivateRoute userOnly>
              <FavouritesDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute userOnly>
              <History />
            </PrivateRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <PrivateRoute userOnly>
              <EditProfile />
            </PrivateRoute>
          }
        />

        {/* Admin-only Route */}
        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly>
              <Admin />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin-analytics"
          element={
            <PrivateRoute adminOnly>
              <AdminAnalytics />
            </PrivateRoute>
          }
        />

        <Route
          path="/traffic"
          element={
            <PrivateRoute adminOnly>
              <Traffic />
            </PrivateRoute>
          }
        />

        <Route
          path="/country-traffic"
          element={
            <PrivateRoute adminOnly>
              <CountryTraffic />
            </PrivateRoute>
          }
        />
      </Routes>


      <Toaster
        position="top-right"  // 👈 default position
        toastOptions={{
          duration: 3000,
          style: {
            zIndex: 999999, // avoids modal overlap issues
          },
        }}
      />

      {!hideFooter && <FooterMenus />}
    </>
  );
}

export default App;
