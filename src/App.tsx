import { Routes, Route, useLocation } from "react-router-dom";
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
import { Favourites } from "./pages/Favourites/Favourites";

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
    location.pathname === "/upgrade-plans";

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        {/* Private Routes */}
        <Route
          path="/my-account"
          element={
            <PrivateRoute>
              <MyAccount />
            </PrivateRoute>
          }
        />
        <Route
          path="/buyId"
          element={
            <PrivateRoute>
              <SelectPlans />
            </PrivateRoute>
          }
        />
        <Route
          path="/id-management"
          element={
            <PrivateRoute>
              <IdManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/buy-credit"
          element={
            <PrivateRoute>
              <RedirectCredit />
            </PrivateRoute>
          }
        />
        <Route
          path="/upgrade-plans"
          element={
            <PrivateRoute>
              <UpgradePlans />
            </PrivateRoute>
          }
        />
        <Route
          path="/favourites"
          element={
            <PrivateRoute>
              <Favourites />
            </PrivateRoute>
          }
        />
      </Routes>

      {!hideFooter && <FooterMenus />}
    </>
  );
}

export default App;
