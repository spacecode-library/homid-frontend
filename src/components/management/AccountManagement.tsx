import circleUserIcon from "../../assets/CircleUserRound.svg";
import { MySubscriptions } from "./MySubscriptions";
import RedirectCreditDashboard from "./RedirectCreditDashboard";

export const AccountManagement = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-4">
          <p className="text-[30px] font-semibold text-[##111827FF]">My Account</p>
          <p className="text-[14px] font-normal text-[##6B7280FF]">Usage Summary</p>
        </div>
        <div className="flex items-center">
          <img src={circleUserIcon} className="w-8 h-8" />
        </div>
      </div>

      <div className="flex justify-between bg-white rounded-[8px] shadow-sm py-[20px] px-[42px] mt-[30px] w-full">
        <div className="w-[45%]">
          <MySubscriptions />
        </div>

        <div className="w-[45%]">
          <RedirectCreditDashboard />
        </div>
      </div>
    </div>
  )
}