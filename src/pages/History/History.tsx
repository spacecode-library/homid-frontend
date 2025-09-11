import { useEffect, useState } from "react";
import NavigateIcon from "../../assets/navigate.png";
import StarIcon from "../../assets/star.png";
import { Header } from "../../components/common/Header"
import { subscriptionService } from "../../services/Subscriptions";

interface Mapping {
  imageUrl: string;
  productName: string;
  websiteUrl: string;
  formattedHomId: string;
}

interface SearchItem {
  time: string;
  mapping: Mapping;
}

interface HistorySection {
  date: string;
  searches: SearchItem[];
}

export const History = () => {
  const [historyData, setHistoryData] = useState<HistorySection[]>([]);

  useEffect(() => {
    const homeIdHistory = async () => {
      const res = await subscriptionService.getHistory();
      setHistoryData(res?.data?.history || []);
    }
    homeIdHistory();
  }, [])

  const handleNavigate = async (url: any, numericId: any) => {
    const digits = numericId.replace(/\D/g, '');
    const obj = {
      homId: digits
    }
    const res = await subscriptionService.postHomIdRedirect(obj);
    if (res?.success) {
      window.open(url, "_blank");
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const year = date.getFullYear();

    // Month name
    const month = date.toLocaleString("en-US", { month: "long" });

    // Day with suffix (1st, 2nd, 3rd, 4th, etc.)
    const day = date.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";

    // Weekday name
    const weekday = date.toLocaleString("en-US", { weekday: "long" });

    return `${year} - ${month}, ${day}${suffix}, ${weekday}`;
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";

    const [hoursStr, minutes] = timeString.split(":");
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // convert 0 to 12

    return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  };


  const Loader = () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A73E8FF]"></div>
    </div>
  );


  return (
    <div className="mt-[26px]">
      <Header />
      <div className="px-7 mt-[14px] flex flex-col space-y-6">
        {historyData.length > 0 ? (historyData.map((section, i) => (
          <div key={i} className="flex flex-col space-y-3">
            {/* Date */}
            <p className="text-[16px] text-[#1A73E8FF] font-normal">
              {formatDate(section?.date)}
            </p>

            {/* Items */}
            {section?.searches?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-4 border-b border-[#E0E0E0] pb-3 px-[18px]"
              >
                <img src={item?.mapping?.imageUrl} className="w-[32px] h-[32px]" />

                <div className="flex flex-col flex-1">
                  <p className="text-[16px] font-medium text-[#000000FF] truncate">
                    {item?.mapping?.productName
                      ? (item?.mapping?.productName.length > 26
                        ? `${item?.mapping?.productName.substring(0, 26)}...`
                        : item?.mapping?.productName
                      )
                      : ''
                    }
                  </p>
                  <p className="text-[14px] text-[#6B7280FF]">
                    {item?.mapping?.websiteUrl
                      ? (item?.mapping?.websiteUrl.length > 26
                        ? `${item?.mapping?.websiteUrl.substring(0, 26)}...`
                        : item?.mapping?.websiteUrl
                      )
                      : ''
                    }
                  </p>
                  <div className="flex justify-between">
                    <p className="text-[12px] text-[#000000FF]"> {formatTime(item.time)}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-[14px] font-bold text-[#00AEFFFF]">
                        .<span className="text-[#1F54B0FF]">ID</span> {item?.mapping?.formattedHomId}
                      </p>
                      <button onClick={() => handleNavigate(item?.mapping?.websiteUrl, item?.mapping?.formattedHomId)}>
                        <img src={NavigateIcon} className="w-[14px] h-[14px] cursor-pointer" />
                      </button>
                      <img src={StarIcon} className="w-[14px] h-[14px] cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))) : (
          <Loader />
        )}
      </div>
    </div>
  )
}