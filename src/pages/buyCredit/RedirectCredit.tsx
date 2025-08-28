import faqIcon from "../../assets/faq.png";
import { AnswerArrow } from "../../assets/IconsComponent/AnswerArrow";
import { CircleTickIcon } from "../../assets/IconsComponent/CircleTickIcon";

export const RedirectCredit = () => {
  const creditPackages = [
    {
      id: 1,
      redirects: "50,000",
      price: "$5.99",
      pricePerRedirect: "$0.00012 per redirect",
      color: "yellow",
      isBestValue: false,
      progressValue: 30
    },
    {
      id: 2,
      redirects: "500,000",
      price: "$39.99",
      pricePerRedirect: "$0.00008 per redirect",
      color: "blue",
      isBestValue: true,
      progressValue: 85
    },
    {
      id: 3,
      redirects: "1,000,000",
      price: "$69.99",
      pricePerRedirect: "$0.00007 per redirect",
      color: "green",
      isBestValue: false,
      progressValue: 90
    }
  ];

  const faqData = [
    { question: "What's Expiration date of the Redirect Credits?", answer: "Redirect Credits do not expire as long as your subscription is active(or has at least One Active .ID in the account)" },
    { question: "What happens to unused Credits when the .ID Subscription is Expired?", answer: "Redirect Credits will expire after 30 days from the date of your Subscription Expires" },
    { question: "Can I transfer the Credits to other person?", answer: "Redirect Credits are not transferrable" },
    { question: "Can the Credits be set to use on Selected .ID?", answer: "Redirect Credits are used towards all redirects processed within One Account" },
  ]

  const getColorClasses = (color: string, isBestValue: boolean) => {
    const colorMap = {
      yellow: "#FFF64CFF",
      blue: "#4CD8FFFF",
      green: "#3AF463FF"
    };

    return {
      progressBar: colorMap[color as keyof typeof colorMap],
      border: isBestValue ? "border-4 border-[#5C94EAFF]" : "border border-[#D9D9D9FF]"
    };
  };

  return (
    <div className="bg-white px-[40px] py-[44px]">
      <p className="text-[28px] text-[#333333FF] font-semibold">Buy Additional Redirect Credits</p>
      <div className="inline-block h-[84px] rounded-[16px] border-4 border-[#7F55E0FF] mt-[32px]">
        <p className="flex items-center text-[24px] font-medium text-[#0066CCFF] pl-[22px] pr-[62px]">Redirect credit balance: <span className="text-[48px] font-bold text-[#E54B4BFF] ml-[60px]">1,012</span></p>
      </div>

      {/* card */}

      <div className="grid grid-cols-3 gap-x-5 mt-10">
        {creditPackages.map((pkg) => {
          const { progressBar, border } = getColorClasses(pkg.color, pkg.isBestValue);

          return (
            <div key={pkg.id} className={`relative bg-white rounded-[8px] px-4 py-6 shadow-sm ${border} flex-1`}>
              {pkg.isBestValue && (
                <div className="absolute -top-5 right-9">
                  <span className="bg-[#5C94EAFF] text-white px-3 py-1 text-[12px] font-bold rounded-t-[0px] rounded-b-[6px]">
                    BEST VALUE
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-[32px] font-bold text-[#333333FF]">{pkg.redirects}</h3>
                <p className="text-[14px] font-normal text-[#666666FF]">Redirects</p>

                {/* Dynamic Progress bar */}
                <div className="w-full bg-[#E5E7EBFF] rounded-full h-[10px] mt-[10px]">
                  <div
                    className={`h-[10px] rounded-full transition-all duration-500 ease-in-out`}
                    style={{ width: `${pkg.progressValue}%`, background: progressBar }}
                  ></div>
                </div>

                <div className="mt-4 text-[28px] font-bold text-[#0066CCFF]">{pkg.price}</div>
                <p className="mt-1 text-[12px] font-normal text-[#666666FF]">{pkg.pricePerRedirect}</p>

                <button className="inline-block mt-[18px] bg-[#5C94EAFF] text-white rounded-[6px] text-[16px] font-medium px-7 py-3">
                  Buy This
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="flex gap-x-[140px]">
        <div className="mt-[16px] flex items-center">
          <img src={faqIcon} className="w-[210px] h-[252px]" />
        </div>
        <div className="mt-[60px]">
          {
            faqData.map((faq) => (
              <div className="flex flex-col">
                <div className="flex gap-x-[10px]">
                  <div className="w-5 h-5 flex items-center">
                    <CircleTickIcon />
                  </div>
                  <p className="text-[18px] font-semibold text-[#333333FF]">{faq.question}</p>
                </div>

                <div className="flex gap-x-2 mt-[10px] ml-[26px]">
                  <div className="flex items-start w-5 h-5">
                    <AnswerArrow />
                  </div>
                  <p className="text-[16px] font-normal text-[#666666FF] mb-[10px]">{faq.answer}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}