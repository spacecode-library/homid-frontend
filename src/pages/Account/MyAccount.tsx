import profileImg from "../../assets/profileImg.png";
import MyAccountIcon from "../../assets/myAccount.png";
import FavouritesIcon from "../../assets/favourites.png";
import HistoryIcon from "../../assets/history.png";
import ShoppingBagIcon from "../../assets/shopping_bag.png";
import SignOutIcon from "../../assets/logout.png";
import { Header } from "../../components/common/Header";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth";

export const MyAccount = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login"); // redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const accountMenues = [
    { icon: MyAccountIcon, menuName: "Edit profile", link: "" },
    { icon: FavouritesIcon, menuName: "Favourites", link: "" },
    { icon: HistoryIcon, menuName: "History", link: "" },
    { icon: ShoppingBagIcon, menuName: "Buy an .ID", link: "/buyId" },
    { icon: ShoppingBagIcon, menuName: "ID Management", link: "/id-management" },
    { icon: SignOutIcon, menuName: "Sign out", action: handleLogout },
  ];

  return (
    <div className="flex flex-col justify-center mt-[50px]">
      <Header />

      <div className="flex flex-col justify-center items-center">
        <div className="flex items-center gap-x-4 mt-[18px]">
          <div className="relative w-[160px] h-[160px]">
            <img
              src={profileImg}
              alt="Profile"
              className="w-full h-full rounded-full object-cover bg-[#CED0F8]"
            />
          </div>
          <div>
            <p className="text-[18px] font-bold text-[#171A1F]">User name</p>
            <p className="text-[14px] text-[#9095A0]">example@gmail.com</p>
          </div>
        </div>

        {/* Menu Section */}
        <div className="mt-6 w-full px-10">
          {accountMenues.map((menu, index) => (
            <div
              key={index}
              className={`flex items-center gap-x-3 py-3 cursor-pointer ${index !== accountMenues.length - 1
                ? "border-b border-[#DEE1E6]"
                : ""
                }`}
              onClick={menu.action} // call action if available
            >
              {menu.link ? (
                <Link to={menu.link} className="flex items-center gap-x-3 w-full">
                  <img
                    src={menu.icon}
                    alt={menu.menuName}
                    className="w-[26px] h-[26px]"
                  />
                  <p className="text-[26px] font-medium text-[#3E6CBB]">
                    {menu.menuName}
                  </p>
                </Link>
              ) : (
                <>
                  <img
                    src={menu.icon}
                    alt={menu.menuName}
                    className="w-[26px] h-[26px]"
                  />
                  <p className="text-[26px] font-medium text-[#3E6CBB]">
                    {menu.menuName}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
