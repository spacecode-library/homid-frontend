import profileImg from "../../assets/profileImg.png";
import MyAccountIcon from "../../assets/myAccount.png";
import FavouritesIcon from "../../assets/favourites.png";
import HistoryIcon from "../../assets/history.png";
import ShoppingBagIcon from "../../assets/shopping_bag.png";
import SignOutIcon from "../../assets/logout.png";
import { Header } from "../../components/common/Header";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth";
import { useEffect, useState, useRef } from "react";
import { subscriptionService } from "../../services/Subscriptions";
import { Edit } from "lucide-react";

interface userInfoProp {
  firstName: string,
  email: string
}

export const MyAccount: React.FC = () => {
  const [userInfo, setUserInfo] = useState<userInfoProp | null>(null);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoader(true);
    const formData = new FormData()
    formData.append('profileImage', file)

    try {
      const res = await subscriptionService.postProfileImage(formData);
      if (res?.success) {
        setLoader(false);
        setSelectedImage(res?.data?.imageUrl);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setLoader(false);
    }

  };

  // Add this function to trigger file input
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

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
    { icon: FavouritesIcon, menuName: "Favourites", link: "/favourites" },
    { icon: HistoryIcon, menuName: "History", link: "/history" },
    { icon: ShoppingBagIcon, menuName: "Buy an .ID", link: "/buyId" },
    { icon: ShoppingBagIcon, menuName: "ID Management", link: "/id-management" },
    { icon: SignOutIcon, menuName: "Sign out", action: handleLogout },
  ];

  useEffect(() => {
    const userInfo = async () => {
      const res = await subscriptionService.getUsersInfo();
      setUserInfo(res?.data);
      setSelectedImage(res?.data?.profileImage);
    }
    userInfo();
  }, [])

  const Loader = () => (
    <div className="absolute inset-0 flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A73E8FF]"></div>
    </div>
  );

  return (
    <div className="flex flex-col justify-center mt-[50px]">
      <Header />

      <div className="flex flex-col justify-center items-center">
        <div className="flex items-center gap-x-4 mt-[18px]">
          <div className="relative w-[160px] h-[160px]">

            {loader ? (
              <Loader />
            ) : (
              <img
                src={selectedImage || profileImg}
                alt="Profile"
                className="w-full h-full rounded-full object-cover bg-[#CED0F8] cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleImageClick}
              />
            )}

            <div
              className="absolute inset-0 rounded-full bg-black bg-opacity-0 hover:bg-opacity-20 transition-all cursor-pointer flex items-center justify-center"
              onClick={handleImageClick}
            >
              <Edit className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-[18px] font-bold text-[#171A1F]">{userInfo?.firstName}</p>
            <p className="text-[14px] text-[#9095A0]">{userInfo?.email}</p>
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
