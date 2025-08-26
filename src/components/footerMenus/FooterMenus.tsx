import HomeIcon from "../../assets/home.png";
import SettingIcon from "../../assets/settings.png";
import HistoryIcon from "../../assets/history.png";
import FavouritesIcon from "../../assets/favourites.png";
import MyAccountIcon from "../../assets/myAccount.png";
import { Link } from "react-router-dom";

export const FooterMenus = () => {
  const menusItems = [
    { icon: HomeIcon, name: "Home", url: "/" },
    { icon: SettingIcon, name: "Settings", url: "/settings" },
    { icon: HistoryIcon, name: "History", url: "/history" },
    { icon: FavouritesIcon, name: "Favourites", url: "/favourites" },
    { icon: MyAccountIcon, name: "My Account", url: "/my-account" }
  ]

  return (
    <div className="z-10 fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2">
      <div className="w-full flex justify-between items-center ">
        {menusItems.map((item, index) => (
          <Link to={item.url}>
            <button
              key={index}
              className="flex flex-col items-center gap-1 py-2 px-3 min-w-0"
            >
              <img
                src={item.icon}
                alt={item.name}
                className="w-6 h-6"
              />
              <span className="text-[12px] text-[#1F54B0] font-medium text-center text-nowrap leading-tight">
                {item.name}
              </span>
            </button>
          </Link>
        ))}
      </div>
    </div>
  )
}