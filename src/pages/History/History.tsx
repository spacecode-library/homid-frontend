import NavigateIcon from "../../assets/navigate.png";
import StarIcon from "../../assets/star.png";
import { Header } from "../../components/common/Header"

export const History = () => {
  const historyData = [
    {
      date: "2025 - June, 1st, Wednesday",
      items: [
        {
          img: "https://cdn-icons-png.flaticon.com/512/732/732200.png",
          name: "Mosquito Zapper - Zap Bugs ...",
          url: "https://www.walmart.com",
          time: "00:00 am",
          id: "987-1234",
        },
        {
          img: "https://cdn-icons-png.flaticon.com/512/888/888879.png",
          name: "Mosquito Zapper - Zap Bugs ...",
          url: "https://www.walmart.com",
          time: "00:00 am",
          id: "767-1234",
        },
        {
          img: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
          name: "Mosquito Zapper - Zap Bugs ...",
          url: "https://www.walmart.com",
          time: "00:00 am",
          id: "561-1234",
        },
      ],
    },
    {
      date: "2025 - May, 31st, Wednesday",
      items: [
        {
          img: "https://cdn-icons-png.flaticon.com/512/888/888859.png",
          name: "Mosquito Zapper - Zap Bugs ...",
          url: "https://www.walmart.com",
          time: "00:00 am",
          id: "987-1234",
        },
        {
          img: "https://cdn-icons-png.flaticon.com/512/888/888846.png",
          name: "Mosquito Zapper - Zap Bugs ...",
          url: "https://www.walmart.com",
          time: "00:00 am",
          id: "767-1234",
        },
      ],
    },
  ];
  return (
    <div className="mt-[26px]">
      <Header />
      <div className="px-7 mt-[14px] flex flex-col space-y-6">
        {historyData.map((section, i) => (
          <div key={i} className="flex flex-col space-y-3">
            {/* Date */}
            <p className="text-[16px] text-[#1A73E8FF] font-normal">
              {section.date}
            </p>

            {/* Items */}
            {section.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-4 border-b border-[#E0E0E0] pb-3 px-[18px]"
              >
                <img src={item.img} className="w-[32px] h-[32px]" />

                <div className="flex flex-col flex-1">
                  <p className="text-[16px] font-medium text-[#000000FF] truncate">
                    {item.name}
                  </p>
                  <p className="text-[14px] text-[#6B7280FF]">{item.url}</p>
                  <div className="flex justify-between">
                    <p className="text-[12px] text-[#000000FF]">{item.time}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-[14px] font-bold text-[#00AEFFFF]">
                        .<span className="text-[#1F54B0FF]">ID</span> {item.id}
                      </p>
                      <img src={NavigateIcon} className="w-[14px] h-[14px] cursor-pointer" />
                      <img src={StarIcon} className="w-[14px] h-[14px] cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}