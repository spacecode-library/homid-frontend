import React, { useState } from "react";
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


type Status = "Active" | "Inactive";

interface Row {
  id: number;
  status: Status;
}

export const TopPerforming = () => {
  const [row, setRow] = useState<Row>({
    id: 1,
    status: "Inactive",
  });

  const handleStatusToggle = () => {
    setRow((prevRow) => ({
      ...prevRow,
      status: prevRow.status === "Active" ? "Inactive" : "Active",
    }));
  };

  const getStatusToggleColor = (): string => {
    return row.status === "Active" ? "bg-green-500" : "bg-red-500";
  };

  const topPerformingData = [
    {
      id: "070-1234",
      status: "Active",
      brand: "Ralph Rauern",
      product: "Women's Summer Skinny Jeans v",
      url: "https://www.amazon.com/ref?0123",
      redirects: "180,631",
      progressWidth: "75%",
      countries: [
        { flag: flag1Icon, percent: "62%", },
        { flag: flag2Icon, percent: "25%", },
        { flag: flag3Icon, percent: "13%", }
      ],
      startDate: "01/JAN/2025",
      stopDate: "31/DEC/2026",
      demographics: "Women clothing, age 20-40",
      totalEarnings: "$16,731.24",
      brandIcon: brand1Icon
    },
    {
      id: "070-5678",
      status: "Active",
      brand: "Nike Sports",
      product: "Men's Running Shoes Pro Max",
      url: "https://www.nike.com/ref?5678",
      redirects: "245,892",
      progressWidth: "85%",
      countries: [
        { flag: flag1Icon, percent: "45%", },
        { flag: flag2Icon, percent: "30%", },
        { flag: flag3Icon, percent: "25%", }
      ],
      startDate: "15/FEB/2025",
      stopDate: "15/FEB/2027",
      demographics: "Men sports, age 18-35",
      totalEarnings: "$22,456.89",
      brandIcon: brand2Icon
    },
    {
      id: "070-9012",
      status: "Paused",
      brand: "Apple Tech",
      product: "iPhone 15 Pro Max 256GB",
      url: "https://www.apple.com/ref?9012",
      redirects: "156,743",
      progressWidth: "60%",
      countries: [
        { flag: flag1Icon, percent: "40%", },
        { flag: flag2Icon, percent: "35%", },
        { flag: flag3Icon, percent: "25%", }
      ],
      startDate: "10/MAR/2025",
      stopDate: "10/MAR/2026",
      demographics: "Tech enthusiasts, age 25-45",
      totalEarnings: "$18,923.67",
      brandIcon: brand3Icon
    }
  ];


  const getStatusStyle = (status: any) => {
    return status === "Active"
      ? "text-[#22C55EFF]"
      : "text-yellow-700";
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="mt-[42px] text-[24px] font-semibold text-[#111827]">Top Performing .ID</p>

        <div className="flex items-center gap-2 mt-[42px]">
          <button
            onClick={handleStatusToggle}
            className={`w-12 h-6 ${getStatusToggleColor()} rounded-full relative transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${row.status === "Active" ? "focus:ring-green-500" : "focus:ring-red-500"
              }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 transition-transform duration-200 ease-in-out ${row.status === "Active"
                  ? "transform translate-x-6"
                  : "transform translate-x-0.5"
                }`}
            ></div>
          </button>

          {/* Show label beside toggle */}
          <span className="text-sm font-medium">{row.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-5">
        {topPerformingData.map((card, index) => (
          <div key={card.id} className="bg-white rounded-[8px] shadow-sm border border-[ #E5E7EBFF] p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[40px] font-bold text-[#2563EBFF]">.<span className='text-[#374151FF]'>ID</span> {card.id}</h3>
              <span className={`${getStatusStyle(card.status)} text-[14px] font-normal`}>
                {card.status}
              </span>
            </div>

            {/* Product Info */}
            <div className="flex items-start mt-3">
              <div className={`w-10 h-10  rounded-full flex items-center justify-center bg-white`}>
                <img src={card.brandIcon} className='w-10 h-10' />
              </div>
              <div className="leading-tight ml-2">
                <p className="text-[16px] font-semibold text-[#1F2937FF]">{card.brand}</p>
                <p className="text-[16px] font-semibold text-[#1F2937FF] mt-[2px]">{card.product}</p>
                <p className="text-[14px] font-normal text-[#3B82F6FF] cursor-pointer mt-[2px]">
                  {card.url}
                </p>
                <p className="text-[14px] text-[#4B5563FF] font-normal mt-[2px]">{card.redirects} Redirects</p>
              </div>
            </div>

            <div className="w-full bg-[#E5E7EBFF] rounded-full h-[10px] mt-6">
              <div className="bg-[#3B82F6FF] h-[10px] rounded-full" style={{ width: card.progressWidth }}></div>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <p className="text-[14px] text-[#4B5563FF] font-normal text-nowrap">Top Performing Countries:</p>
              <div className="flex items-center gap-x-1">
                {card.countries.map((country, idx) => (
                  <div key={idx} className="flex items-center gap-x-1">
                    <div className='flex items-center'>
                      <img src={country.flag} className='w-[30px] h-[30px]' />
                    </div>
                    <span className="text-[14px] text-[#374151FF] font-normal">{country.percent}</span>
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
                  <span className="text-[14px] text-[#374151FF] font-normal">{card.startDate}</span>
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
                  <span className="text-[14px] text-[#374151FF] font-normal">{card.stopDate}</span>
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
                  <span className="text-[14px] text-[#374151FF] font-normal">{card.demographics}</span>
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
                <span className="text-[14px] font-bold text-[#1F2937FF]">{card.totalEarnings}</span>
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
      </div>
    </div>
  );
};
