import React, { useState } from 'react';

type TimePeriod = '7 days' | '30 days' | '6 months' | '1 year';

interface CreditData {
  purchased: string;
  used: string;
  remaining: string;
}

export const RedirectCreditDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1 year');

  const creditData: CreditData = {
    purchased: '1,250,000',
    used: '250,000',
    remaining: '1,000,000'
  };

  const timePeriods: TimePeriod[] = ['7 days', '30 days', '6 months', '1 year'];

  const handlePeriodSelect = (period: TimePeriod): void => {
    setSelectedPeriod(period);
  };

  const handleBuyCredits = (): void => {
    // Handle buy credits action
    console.log('Buy credits clicked');
  };

  return (
    <div className="flex bg-white justify-end">
      {/* Left Column - Labels */}
      <div className="flex flex-col items-start mr-24">
        <p className="text-[14px] font-bold text-[#171A1FFF] underline mb-8">
          Redirect Credit
        </p>

        <div className="flex flex-col gap-4 mt-5">
          <p className="text-[14px] font-normal text-[#6B7280FF] leading-tight">
            Purchased
          </p>
          <p className="text-[14px] font-normal text-[#6B7280FF] leading-tight">
            Used Counts
          </p>
          <p className="text-[14px] font-normal text-[#6B7280FF] leading-tight">
            Remaining Counts
          </p>
        </div>
      </div>

      {/* Right Column - Data and Controls */}
      <div className="flex flex-col">
        {/* Time Period Buttons */}
        <div className="flex items-center space-x-2 mb-6">
          {timePeriods.map((period) => (
            <button
              key={period}
              onClick={() => handlePeriodSelect(period)}
              className={`text-[14px] font-normal px-4 py-1 rounded-[6px] transition-colors ${selectedPeriod === period
                ? 'text-white bg-[#2563EB] font-medium text-[12px] hover:bg-blue-700'
                : 'text-[#6B7280FF] hover:text-gray-800'
                }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Credit Numbers and Buy Button Container */}
        <div className="flex items-start gap-x-14 ml-6">
          {/* Credit Numbers */}
          <div className="flex flex-col items-center">
            <p className="text-[32px] font-bold text-[#374151FF] leading-tight">
              {creditData.purchased}
            </p>
            <p className="text-[32px] font-bold text-[#DE3B40FF] leading-tight">
              {creditData.used}
            </p>
            <p className="text-[32px] font-bold text-[#379AE6FF] leading-tight">
              {creditData.remaining}
            </p>
          </div>

          {/* Buy Credits Button */}
          <button
            onClick={handleBuyCredits}
            className="h-[100px] w-[120px] rounded-[8px] shadow-sm bg-[#2563EBFF] text-white hover:bg-[#0F3FA6] text-[20px] font-bold transition-colors"
          >
            Buy <br />Credits
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedirectCreditDashboard;