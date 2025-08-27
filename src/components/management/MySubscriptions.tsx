import { CircleCrossIcon } from "../../assets/IconsComponent/CircleCrossIcon";
import { CircleTickIcon } from "../../assets/IconsComponent/CircleTickIcon";

export const MySubscriptions = () => {
  return (
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
  )
}