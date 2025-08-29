import { Routes, Route, useLocation } from 'react-router-dom';
import { HomePage } from "./pages/HomePage";
import { Login } from './pages/Auth/Login';
import { Registration } from './pages/Auth/Registration';
import { MyAccount } from './pages/Account/MyAccount';
import { FooterMenus } from './components/footerMenus/FooterMenus';
import { SelectPlans } from './pages/BuyId/SelectPlans';
import { IdManagement } from './pages/IdManagement/IdManagement';
import { RedirectCredit } from './pages/buyCredit/RedirectCredit';
import { UpgradePlans } from './pages/upgradePlans/UpgradePlans';

function App() {
  const location = useLocation();

  // Hide footer on login & registration pages
  const hideFooter =
    location.pathname === "/login" || location.pathname === "/registration" || location.pathname === "/buyId" || location.pathname === "/buyId/cart" || location.pathname === "/id-management" || location.pathname === "/buy-credit" || location.pathname === "/upgrade-plans";

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/registration' element={<Registration />} />
        <Route path='/my-account' element={<MyAccount />} />
        <Route path="/buyId" element={<SelectPlans />} />
        <Route path="/id-management" element={<IdManagement />} />
        <Route path="/buy-credit" element={<RedirectCredit />} />
        <Route path="/upgrade-plans" element={<UpgradePlans />} />
      </Routes>
      {!hideFooter && <FooterMenus />}
    </>
  );
}

export default App
