
import React, { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import brand1Icon from "../../assets/brand1.png";
import brand2Icon from "../../assets/brand2.png";
import brand3Icon from "../../assets/brand3.png";
import flag1Icon from "../../assets/flag1.png";
import flag2Icon from "../../assets/flag2.png";
import flag3Icon from "../../assets/flag3.png";
import calendarIcon from "../../assets/calendar.svg";
import shoppingIcon from "../../assets/shopping.svg";
import refreshIcon from "../../assets/refresh.svg";
import shareIcon from "../../assets/share.svg";
import dollarIcon from "../../assets/dollar.svg";
import youtubeIcon from "../../assets/youtube.png";
import instagramIcon from "../../assets/instagram.png";
import tiktokIcon from "../../assets/tiktok.png";
import bellIcon from "../../assets/bell.svg";
import fileTextIcon from "../../assets/file-text.svg";
import barChartIcon from "../../assets/chart.svg";
import { subscriptionService } from "../../services/Subscriptions";
import { DotsLoader } from "../../DotsLoader";

interface topLiveIdsProps {
  rank: number;
  numericId: string;
  redirectCreditsUsed: number;
  earning: number;
  productName: string;
  websiteUrl: string;
  imageUrl: string;
  youtube: boolean;
  instagram: boolean;
  tiktok: boolean;
  linkedin: boolean;
  facebook: boolean;
  twitter: boolean;
  startdate: string;
  enddate: string;
  status: "pending" | "active" | "completed" | string;
  countryCode: string;
  count: number;
  percentage: number;

  traffic: {
    totalTraffic: number;
    countryBreakdown: {
      countryCode: string;
      count: number;
      percentage: number;
    }[];
  };
}



export const LiveTopPerforming: React.FC = () => {
  const [topPerformingData, setTopPerformingData] = useState<topLiveIdsProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTopPerformingLiveIds = async () => {
      try {
        setIsLoading(true);
        const res = await subscriptionService.getTopIds();
        if (res?.success) {
          setTopPerformingData(res?.data);
        }
        console.log(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    getTopPerformingLiveIds();
  }, [])

  const getStatusStyle = (status: any) => {
    return status === "Live"
      ? "text-[#22C55EFF]"
      : "text-yellow-700";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      {
        isLoading ? (
          <div className="bg-white rounded-[8px] shadow-sm border border-[#E5E7EBFF] p-4 mt-5">
            <DotsLoader />
            <p className="text-center text-[#6B7280FF] text-[14px] font-normal">Loading top performing IDs...</p>
          </div>
        ) :
          topPerformingData?.length > 0 ? (
            <div className="grid grid-cols-3 gap-6 mt-5">
              {topPerformingData?.map((card, index) => (
                <div key={index} className="bg-white rounded-[8px] shadow-sm border border-[#E5E7EBFF] p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[40px] font-bold text-[#2563EBFF]">.<span className='text-[#374151FF]'>ID</span> {card.numericId.replace(/(.{4})(?=.)/g, "$1-")}</h3>
                    <span className={`${getStatusStyle(card?.status)} text-[14px] font-normal`}>
                      {card?.status}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="flex items-start mt-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white`}>
                      <img src={card.imageUrl} className='w-10 h-10' />
                    </div>
                    <div className="leading-tight ml-2">
                      {/* <p className="text-[16px] font-semibold text-[#1F2937FF]">{card.brand}</p> */}
                      <p className="text-[16px] font-semibold text-[#1F2937FF] mt-[2px]"> {card.productName.length > 29
                        ? card.productName.slice(0, 29) + "..."
                        : card.productName}</p>
                      <a href={card.websiteUrl} target="_blank" rel="noopener noreferrer">
                        <p className="text-[14px] font-normal text-[#3B82F6FF] cursor-pointer mt-[2px]">
                          {card.websiteUrl.length > 30
                            ? card.websiteUrl.slice(0, 30) + "..."
                            : card.websiteUrl}
                        </p>
                      </a>
                      <p className="text-[14px] text-[#4B5563FF] font-normal mt-[2px]">{card.redirectCreditsUsed} Redirects</p>
                    </div>
                  </div>

                  <div className="w-full bg-[#E5E7EBFF] rounded-full h-[10px] mt-6">
                    <div className="bg-[#3B82F6FF] h-[10px] rounded-full" style={{ width: "65%" }}></div>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <p className="text-[14px] text-[#4B5563FF] font-normal text-nowrap">Top Performing Countries:</p>
                    <div className="flex items-center gap-x-1">
                      {card?.traffic.countryBreakdown.length > 0 &&
                        card?.traffic.countryBreakdown.map((country, idx) => (
                          <div key={idx} className="flex items-center gap-x-1">
                            <div className="flex items-center">
                              <ReactCountryFlag
                                countryCode={country.countryCode}
                                svg
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "4px",
                                }}
                                title={country.countryCode}
                              />
                            </div>
                            <span className="text-[14px] text-[#374151FF] font-normal">
                              {country.percentage}%
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="space-y-2 mt-[30px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-2">
                        <div className='flex items-center'>
                          <img src={calendarIcon} className='w-4 h-4' />
                        </div>
                        <span className="text-[14px] text-[#374151FF] font-normal">Start Date</span>
                      </div>
                      <div className='flex items-center gap-x-2'>
                        <span className="text-[14px] text-[#374151FF] font-normal">{formatDate(card.startdate)}</span>
                        <div className='flex items-center'>
                          <img src={calendarIcon} className='w-4 h-4' />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-2">
                        <div className='flex items-center'>
                          <img src={calendarIcon} className='w-4 h-4' />
                        </div>
                        <span className="text-[14px] text-[#374151FF] font-normal">Stop Date</span>
                      </div>
                      <div className='flex items-center gap-x-2'>
                        <span className="text-[14px] text-[#374151FF] font-normal">{formatDate(card.enddate)}</span>
                        <div className='flex items-center'>
                          <img src={calendarIcon} className='w-4 h-4' />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-2">
                        <div className='flex items-center'>
                          <img src={shoppingIcon} className='w-4 h-4' />
                        </div>
                        <span className="text-[14px] text-[#374151FF] font-normal">Tech enthusiasts, age 25-45</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-2">
                        <div className='flex items-center'>
                          <img src={refreshIcon} className='w-4 h-4' />
                        </div>
                        <span className="text-[14px] text-[#374151FF] font-normal">Renew Contract</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className='flex items-center'>
                          <img src={shareIcon} className='w-4 h-4' />
                        </div>
                        <span className="text-[14px] text-[#374151FF] font-normal">Posted Social Medias</span>
                      </div>
                      <div className="flex gap-x-4">
                        <div className="flex items-center">
                          <img src={youtubeIcon} className='w-[22px] h-[22px]' />
                        </div>
                        <div className="flex items-center">
                          <img src={instagramIcon} className='w-[22px] h-[22px]' />
                        </div>
                        <div className="flex items-center">
                          <img src={tiktokIcon} className='w-[22px] h-[22px]' />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className='flex items-center'>
                          <img src={dollarIcon} className='w-4 h-4' />
                        </div>
                        <span className="text-[14px] text-[#374151FF] font-normal">Total Earnings</span>
                      </div>
                      <span className="text-[14px] font-bold text-[#1F2937FF]">{card.earning}</span>
                    </div>
                  </div>

                  <hr className='mt-[22px] mb-[16px]' />

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center px-5">
                    <div className='flex items-center'>
                      <img src={bellIcon} className='w-5 h-5' />
                    </div>
                    <div className='flex items-center'>
                      <img src={fileTextIcon} className='w-5 h-5' />
                    </div>
                    <div className='flex items-center'>
                      <img src={calendarIcon} className='w-5 h-5' />
                    </div>
                    <div className='flex items-center'>
                      <img src={shareIcon} className='w-5 h-5' />
                    </div>
                    <div className='flex items-center'>
                      <img src={dollarIcon} className='w-5 h-5' />
                    </div>
                    <div className='flex items-center'>
                      <img src={barChartIcon} className='w-5 h-5' />
                    </div>
                  </div>
                </div>
              ))}
            </div>) : (
            <div className="bg-white rounded-[8px] shadow-sm border border-[#E5E7EBFF] p-4 mt-5">
              <p className="text-center">No Active Id's</p>
            </div>
          )
      }
    </div>
  )
}