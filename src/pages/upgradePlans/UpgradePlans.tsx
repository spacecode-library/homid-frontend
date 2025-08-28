export const UpgradePlans = () => {
  const plans = [
    {
      id: 1,
      name: "PRO",
      price: "$1.24",
      period: "/month per .ID",
      yearlyPrice: "$149/year",
      includedIds: "10",
      totalRedirects: "50,000",
      features: [
        "Advanced Analytics",
        "Plan Upgradeable"
      ],
      buttonText: "Current Plan",
      isCurrentPlan: true,
      badge: null
    },
    {
      id: 2,
      name: "GOLD",
      price: "$0.66",
      period: "/month per .ID",
      yearlyPrice: "$199/year",
      includedIds: "25",
      totalRedirects: "50,000",
      features: [
        "Advanced Analytics",
        "Plan Upgradeable"
      ],
      buttonText: "Select",
      isCurrentPlan: false,
      badge: "Add 15 .IDs",
    },
    {
      id: 3,
      name: "ELITE",
      price: "$0.50",
      period: "/month per .ID",
      yearlyPrice: "$299/year",
      includedIds: "50",
      totalRedirects: "50,000",
      features: [
        "Advanced Analytics",
        "Priority Support"
      ],
      buttonText: "Select",
      isCurrentPlan: false,
      badge: "Add 40 .IDs"
    }
  ];

  return (
    <div className="bg-white px-[40px] py-[44px]">
      <p className="text-[60px] font-bold text-[#1F54B0FF] text-center">Upgrade Plans</p>

      {/* Dynamic Cards */}
      <div className="mt-[60px] grid grid-cols-3 gap-x-10">
        {plans.map((plan, index) => (
          <div key={plan.id} className="relative">
            {/* Badge */}
            {plan.badge && (
              <div className="absolute -top-3 -right-1 z-10">
                <span className={`text-[16px] font-medium text-[#82BDAC] bg-[#FFF87FFF] rounded-[16px] px-4 py-1`}>
                  {plan.badge}
                </span>
              </div>
            )}

            {/* Card */}
            <div className={`relative p-5 rounded-[8px] border border-[#D1D5DBFF] ${index === 0 ? "bg-[#FFF87FFF]" : "bg-white"}`}>

              {/* Header */}
              <div className="text-center">
                <h2 className="text-[32px] font-semibold text-[#242524FF] leading-tight">{plan.name}</h2>

                {/* Price */}
                <div className="">
                  <span className="text-[32px] font-bold text-[#379AE6FF] leading-tight">{plan.price}</span>
                  <span className="text-[14px] font-normal text-[#6B7280FF] leading-tight ml-2">{plan.period}</span>
                </div>
                <p className="text-[14px] font-normal text-[#6B7280FF] leading-tight">{plan.yearlyPrice}</p>
              </div>

              {/* Stats */}
              <div className="mt-[42px]">
                <div className="flex justify-between leading-tight">
                  <span className="text-[16px] font-normal text-[#374151FF]">Included .ID</span>
                  <span className="text-[32px] font-semibold text-[#379AE6FF]">{plan.includedIds}</span>
                </div>

                <div className="flex justify-between">
                  <div className="flex items-center">
                    <span className="text-[16px] text-[#374151FF] font-normal">Total Redirects</span>
                  </div>
                  <span className="text-[16px] font-semibold text-[#242524FF]">{plan.totalRedirects}</span>
                </div>
              </div>

              {/* Features */}
              <div className="mt-6 pb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[14px] font-normal text-[#374151FF]">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <button className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-white w-[230px] text-center py-1 font-medium text-[20px] rounded-[6px] ${index === 0 ? "bg-[#171A1FFF]" : "bg-[#4285F4FF]"}`}>
                {plan.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};