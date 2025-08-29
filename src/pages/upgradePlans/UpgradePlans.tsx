import { useState } from 'react';
import blueCartIcon from "../../assets/blue-cart.png";
import arrowDownIcon from "../../assets/arrow-down.png";
import keyboardLeftIcon from "../../assets/keyboard-left.png";
import keyboardRightIcon from "../../assets/keyboard-right.png";
import selectionCartIcon from "../../assets/selection-cart.png";
import closeIcon from "../../assets/close-small.png";

export const UpgradePlans = () => {
  const [selectedPrefix, setSelectedPrefix] = useState(700);
  const [selectedNumber, setSelectedNumber] = useState(710);
  const [selectedSpecificNumber, setSelectedSpecificNumber] = useState(711);
  const [selectedPhoneNumbers, setSelectedPhoneNumbers] = useState<string[]>([]);
  const [currentPrefixPage, setCurrentPrefixPage] = useState(0);

  // Generate more prefix numbers for demonstration
  const prefixNumbers = [100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 110, 220, 330, 440, 550, 660, 770, 880, 990, 123];
  const prefixesPerPage = 10; // Changed from 9 to 10
  const maxPages = Math.ceil(prefixNumbers.length / prefixesPerPage);

  const getCurrentPrefixes = () => {
    const startIndex = currentPrefixPage * prefixesPerPage;
    return prefixNumbers.slice(startIndex, startIndex + prefixesPerPage);
  };

  const getAvailableNumbers = (prefix: number) => {
    const numbers = [];
    // Generate numbers by adding increments of 10: if prefix is 700, generate 710, 720, 730, etc.
    for (let i = 10; i <= 90; i += 10) {
      numbers.push(prefix + i);
    }
    return numbers;
  };

  const getSpecificNumbers = (baseNumber: number) => {
    const numbers = [];
    // Generate numbers by adding 1 to 9: if baseNumber is 720, generate 721, 722, 723, etc.
    for (let i = 1; i <= 9; i++) {
      numbers.push(baseNumber + i);
    }
    return numbers;
  };

  const generatePhoneNumbers = (baseNumber: number) => {
    // Generate phone numbers that start with the specific selected number
    return [
      `${baseNumber} - 0001`,
      `${baseNumber} - 1001`,
      `${baseNumber} - 0011`,
      `${baseNumber} - 0901`,
      `${baseNumber} - 1009`,
      `${baseNumber} - 2001`,
      `${baseNumber} - (Search available .ID)`
    ];
  };

  const handlePrefixPrev = () => {
    setCurrentPrefixPage(prev => Math.max(0, prev - 1));
  };

  const handlePrefixNext = () => {
    setCurrentPrefixPage(prev => Math.min(maxPages - 1, prev + 1));
  };

  const handleNumberSelect = (number: number) => {
    setSelectedNumber(number);
    // When selecting a number like 620, automatically select the first specific number (621)
    setSelectedSpecificNumber(number + 1);
  };

  const handleSpecificNumberSelect = (specificNumber: number) => {
    setSelectedSpecificNumber(specificNumber);
  };

  const handlePhoneNumberToggle = (phoneNumber: string) => {
    setSelectedPhoneNumbers(prev =>
      prev.includes(phoneNumber)
        ? prev.filter(num => num !== phoneNumber)
        : [...prev, phoneNumber]
    );
  };

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

      <p className='mt-[100px] text-[32px] font-normal text-[#1F54B0FF] text-center'>Choose the Prefix Number</p>

      {/* Prefix Selection - Changed to 5x2 grid */}
      <div className="flex items-center justify-center mt-[40px]">
        <div className='flex items-center gap-4'>
          <div className='bg-[#BAF3EBFF] rounded-[6px] px-3 py-1 text-[14px] text-[#DE3B40FF] font-medium'>
            Start here
          </div>
          <button
            onClick={handlePrefixPrev}
            disabled={currentPrefixPage === 0}
            className="p-2 disabled:opacity-30"
          >
            <img src={keyboardLeftIcon} className='w-8 h-8' />
          </button>
        </div>

        {/* Changed from grid-cols-3 to grid-cols-5 and added rows-2 for 5x2 layout */}
        <div className="grid grid-cols-5 grid-rows-2 gap-[12px] px-6">
          {getCurrentPrefixes().map((prefix) => (
            <button
              key={prefix}
              onClick={() => {
                setSelectedPrefix(prefix);
                // When selecting a new prefix, auto-select the first available number (prefix + 10)
                const firstNumber = prefix + 10;
                setSelectedNumber(firstNumber);
                setSelectedSpecificNumber(firstNumber + 1);
              }}
              className={`w-16 h-10 px-4 py-2 flex items-center justify-center rounded-md font-semibold text-[18px] transition-all ${selectedPrefix === prefix
                ? 'bg-[#4285F4] text-white'
                : 'bg-white text-[#374151FF] border border-[#D1D5DB]'
                }`}
            >
              {prefix}
            </button>
          ))}
        </div>

        <button
          onClick={handlePrefixNext}
          disabled={currentPrefixPage === maxPages - 1}
          className="p-2 disabled:opacity-30"
        >
          <img src={keyboardRightIcon} className='w-8 h-8' />
        </button>
      </div>

      {/* Available Numbers Row */}
      <div className="mt-2">
        <div className='flex justify-center'>
          <img src={arrowDownIcon} className='w-8 h-8' />
        </div>
        <div className="flex justify-center gap-2 mt-[24px]">
          {getAvailableNumbers(selectedPrefix).map((number) => (
            <button
              key={number}
              onClick={() => handleNumberSelect(number)}
              className={`px-4 py-1 rounded-full font-medium text-[24px] transition-all min-w-[50px] ${selectedNumber === number
                ? 'border border-[#EF4444FF] text-[#EF4444FF]'
                : 'bg-[#E0F2FEFF] text-[#4285F4FF]'
                }`}
            >
              {number}
            </button>
          ))}
        </div>
      </div>

      {/* Specific Numbers Row */}
      <div className="mt-2">
        <div className='flex justify-center'>
          <img src={arrowDownIcon} className='w-8 h-8' />
        </div>
        <div className="flex justify-center gap-2 mt-[24px]">
          {getSpecificNumbers(selectedNumber).map((number) => (
            <button
              key={number}
              onClick={() => handleSpecificNumberSelect(number)}
              className={`px-4 py-1 rounded-full font-medium text-[24px] min-w-[50px] transition-all ${selectedSpecificNumber === number
                ? 'border border-[#EF4444FF] text-[#EF4444FF]'
                : 'bg-[#E0F2FEFF] text-[#4285F4FF] border border-[#7F55E0FF]'
                }`}
            >
              {number}
            </button>
          ))}
        </div>
      </div>

      {/* Phone Number Options */}
      <div className="mt-2">
        <div className='flex justify-center'>
          <img src={arrowDownIcon} className='w-8 h-8' />
        </div>

        <div className="max-w-4xl mx-auto flex gap-4 items-start mt-[24px]">
          {/* Parent container for rows */}
          <div className="flex-1">
            {/* First Row - 4 cards */}
            <div className="relative grid grid-cols-4 gap-4">
              {generatePhoneNumbers(selectedSpecificNumber).slice(0, 4).map((phoneNumber, index) => {
                const isSelected = selectedPhoneNumbers.includes(phoneNumber);

                return (
                  <div
                    key={index}
                    className={`relative border border-[#D1D5DBFF] rounded-[4px] flex flex-col items-center justify-between px-3 py-2 bg-white 
        ${isSelected ? "border-[3px] border-[#E8618CFF]" : ""}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <p className="text-[24px] font-normal text-[#374151FF]">{phoneNumber}</p>
                      <div className="flex items-center">
                        <button onClick={() => handlePhoneNumberToggle(phoneNumber)}>
                          <img src={selectionCartIcon} className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute -top-7 left-1/2 transform -translate-x-1/2">
                        <div className="bg-[#BBF7D0FF] rounded-[4px] px-2">
                          <span className="text-[10px] font-normal text-[#15803DFF]">
                            Added to Cart
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>


            {/* Second Row - 2 cards + wider input field */}
            <div className="relative grid grid-cols-4 gap-4 mt-[10px]">
              {generatePhoneNumbers(selectedSpecificNumber).slice(4, 6).map((phoneNumber, index) => {
                const isSelected = selectedPhoneNumbers.includes(phoneNumber);

                return (
                  <div
                    key={index + 4}
                    className={`relative border border-[#D1D5DBFF] rounded-[4px] flex items-center justify-between px-3 py-2 bg-white  ${isSelected ? "border-[3px] border-[#E8618CFF]" : ""}`}
                  >
                    <p className="text-[24px] font-normal text-[#374151FF]">{phoneNumber}</p>

                    <div className="flex items-center gap-2">
                      <button onClick={() => handlePhoneNumberToggle(phoneNumber)}>
                        <img src={selectionCartIcon} className="w-5 h-5" />
                      </button>
                    </div>

                    {isSelected && (
                      <div className="absolute -top-7 left-1/2 transform -translate-x-1/2">
                        <div className="bg-[#BBF7D0FF] rounded-[4px] px-2">
                          <span className="text-[10px] font-normal text-[#15803DFF]">
                            Added to Cart
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}


              <div className='border border-[#D1D5DBFF] rounded-[4px] flex items-center justify-between px-3 bg-white col-span-2 placeholder-slate-200'>
                <input
                  type='text'
                  placeholder={`${selectedSpecificNumber} -(Search available .ID)`}
                  className='flex-1 text-[24px] border-none outline-none placeholder-gray-400'
                />
                <button>
                  <img src={selectionCartIcon} className='w-5 h-5' />
                </button>
              </div>
            </div>
          </div>

          {/* Regenerate Button - separate parent */}
          <div className="flex items-center">
            <button className='bg-[#4285F4FF] text-white text-[16px] rounded-[6px] px-6 py-2 font-medium whitespace-nowrap'>
              Regenerate
            </button>
          </div>
        </div>
      </div>

      {/* My Cart Section */}
      <div className="mt-[100px] max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-5">
          <img src={blueCartIcon} alt="cart" className="w-9 h-9" />
          <h3 className="text-[48px] font-normal text-[#242524FF] mr-[250px]">My Cart</h3>
        </div>

        <div className="flex mt-5 gap-x-11">
          {/* Selected Items */}
          <div className="flex-1 border-4 border-[#E8618CFF] rounded-[4px] py-4">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {selectedPhoneNumbers.slice(0, 9).map((phoneNumber, index) => (
                <div key={index} className="flex items-center gap-x-2 bg-[#DCFCE7FF] rounded-full text-[18px] font-normal text-[#166534FF] px-4">
                  {phoneNumber.split(' - ')[0]} - {phoneNumber.split(' - ')[1]}

                  <img src={closeIcon} className='w-6 h-6 cursor-pointer' onClick={() => handlePhoneNumberToggle(phoneNumber)} />
                </div>
              ))}
            </div>

            <div className="mt-[32px] flex items-center">
              <div className="flex-grow border-t-[3px] border-[#9095A0FF]"></div>
              <span className="px-3 text-[16px] font-normal text-[#242524FF]">
                Previously Purchased .ID
              </span>
              <div className="flex-grow border-t-[3px] border-[#9095A0FF]"></div>
            </div>

            <div className="flex flex-wrap gap-2 text-[14px] text-[#166534FF] mt-2">
              <span className="bg-[#DEE1E6FF] px-2 py-1 rounded-[6px] text-center">733 - 1001</span>
              <span className="bg-[#DEE1E6FF] px-2 py-1 rounded-[6px] text-center">733 - 0011</span>
              <span className="bg-[#DEE1E6FF] px-2 py-1 rounded-[6px] text-center">710 - 1001</span>
              <span className="bg-[#DEE1E6FF] px-2 py-1 rounded-[6px] text-center">733 - 1001</span>
              <span className="bg-[#DEE1E6FF] px-2 py-1 rounded-[6px] text-center">733 - 1001</span>
              <span className="bg-[#DEE1E6FF] px-2 py-1 rounded-[6px] text-center">710 - 1001</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="relative rounded-[6px] border border-[#000000FF] w-fit">
            <div className='absolute right-0 -top-[52px]'>
              <p className='text-[20px] font-bold text-[#FF0000FF]'>Add <span className='text-[32px] text-[#379AE6FF]'>15</span> .IDs</p>
            </div>
            <div className="p-[18px] leading-tight space-y-1">
              <div className="flex justify-between w-full min-w-[236px]">
                <p className="text-[14px] font-normal text-[#242524FF]">Plan Applied</p>
                <p className="text-[24px] font-semibold text-[#4285F4FF]">GOLD</p>
              </div>

              <div className="flex justify-between w-full min-w-[236px]">
                <p className="text-[14px] font-normal text-[#242524FF]">No. of .ID Added</p>
                <p className="text-[24px] font-semibold text-[#4285F4FF]">3</p>
              </div>

              <div className="flex justify-between items-start w-full min-w-[236px]">
                <p className="text-[14px] font-normal text-[#242524FF]">Price per .ID</p>
                <p className="text-[14px] font-semibold text-[#242524FF] text-right">
                  $1.24 <br />
                  <span className="text-[10px] font-semibold text-[#6B7280FF]">/month per .ID</span>
                </p>
              </div>

              <div className="flex justify-between items-start w-full min-w-[236px]">
                <p className="text-[14px] font-normal text-[#242524FF]">Annual Payment</p>
                <p className="text-[24px] font-semibold text-[#4285F4FF] text-right">
                  $149 <br />
                  <span className="text-[10px] font-semibold text-[#6B7280FF]">/year</span>
                </p>
              </div>
            </div>

            {/* Checkout Button */}
            <button className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 rounded-[6px] text-white text-[14px] font-medium bg-[#4285F4FF] px-8 py-2">
              Checkout
            </button>
          </div>

        </div>
      </div>

      <div className='border border-[#FFD700FF] rounded-[6px] bg-[#FFFACDFF] max-w-4xl mx-auto mt-6'>
        <div className='flex gap-x-2 p-4'>
          <div className="flex items-start mt-1">
            <img src={blueCartIcon} alt="cart" className="w-6 h-6" />
          </div>
          <p className='text-[18px] font-normal text-[#374151FF]'>Add or Remove .ID - Subscription Plan will auto apply per Qty of .ID added to Cart <br /> .ID are auto generated and randomly added to the Car - Feel Free to Edit(Add or Remove)</p>
        </div>
      </div>
    </div>
  );
};