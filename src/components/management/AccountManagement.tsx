import circleUserIcon from "../../assets/CircleUserRound.svg";
import { CircleCrossIcon } from "../../assets/IconsComponent/CircleCrossIcon";
import { CircleTickIcon } from "../../assets/IconsComponent/CircleTickIcon";

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

      <div className="flex bg-white rounded-[8px] shadow-sm py-[20px] px-[42px] mt-[30px] gap-x-24 w-full">
        <div>
          <div className="flex">
            <p className="text-[14px] font-bold text-[#171A1FFF]">My Subscriptions:</p>
            <p className="ml-[67px] text-[16px] font-medium text-[#374151FF]">SINGLE: 0</p>
            <p className="ml-[23px] text-[16px] font-medium text-[#374151FF]">PRO: 0</p>
            <p className="ml-[32px] text-[16px] font-bold text-[#2563EBFF]">GOLD: 1</p>
            <p className="ml-[28px] text-[16px] font-medium text-[#374151FF]">ELITE: 0</p>
          </div>

          <div className="mt-[24px] flex items-center ml-[8px] leading-tight">
            <div className="">
              <p className="text-[14px] font-bold text-[#171A1FFF] leading-tight">Purchased .ID</p>
              <p className="text-[80px] font-bold text-[#2563EBFF] leading-tight">25</p>
            </div>

            <div className="flex flex-col items-center ml-[44px]">
              <div className="flex items-center">
                <p className="text-[14px] font-normal text-[#6B7280FF] leading-tight">URL Configured .ID</p>
                <p className="text-[40px] font-bold text-[#242524FF] leading-tight ml-[30px]">21</p>
                <div className="flex items-center ml-2">
                  <CircleTickIcon />
                </div>
              </div>

              <div className="flex items-center">
                <p className="text-[14px] font-normal text-[#6B7280FF] leading-tight">URL Unconfigured .ID</p>
                <p className="text-[40px] font-bold text-[#242524FF] leading-tight ml-[14px]">04</p>
                <div className="flex items-center">
                  <CircleCrossIcon />
                </div>
              </div>
            </div>

            <button className="h-[96px] rounded-[8px] shadow-sm bg-[#2563EBFF] text-white px-5 ml-[45px] hover:bg-[#0F3FA6FF] text-[20px] font-bold">Upgrade</button>
          </div>
        </div>

        <div>
          <div className="">
            <div className="flex items-center gap-x-[104px]">
              <p className="text-[14px] font-bold text-[#171A1F] underline">
                Redirect Credit
              </p>

              <div className="flex items-center space-x-3">
                <button className="text-[14px] font-normal text-[#6B7280] hover:text-gray-800">
                  7 days
                </button>
                <button className="text-[14px] font-normal text-[#6B7280] hover:text-gray-800">
                  30 days
                </button>
                <button className="text-[14px] font-normal text-[#6B7280] hover:text-gray-800">
                  6 months
                </button>
                <button className="text-[12px] font-medium rounded-[6px] text-white bg-[#2563EB] px-4 py-1 hover:bg-blue-700">
                  1 year
                </button>
              </div>
            </div>

            <div className="mt-[24px] leading-tight">
              <div className="flex justify-between items-center">
                <p className="text-[14px] font-normal text-[#6B7280FF]">Purchased</p>
                <p className="text-[32px] font-bold text-[#374151FF]">1,250,000</p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-[14px] font-normal text-[#6B7280FF]">Used Counts</p>
                <p className="text-[32px] font-bold text-[#DE3B40FF]">250,000</p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-[14px] font-normal text-[#6B7280FF]">Remaining Counts</p>
                <p className="text-[32px] font-bold text-[#379AE6FF]">1,000,000</p>
              </div>
            </div>

            {/* <button className="h-[96px] rounded-[8px] shadow-sm bg-[#2563EBFF] text-white px-5 ml-[45px] hover:bg-[#0F3FA6FF] text-[20px] font-bold">Buy Credits</button> */}
          </div>
        </div>
      </div>
    </div>
  )
}