import React, { useState, useEffect, useRef } from 'react';
import checkIcon from "../../assets/green-check.png";
import arrowDownIcon from "../../assets/arrow-down.png";
import keyboardLeftIcon from "../../assets/keyboard-left.png";
import keyboardRightIcon from "../../assets/keyboard-right.png";
import selectionCartIcon from "../../assets/selection-cart.png";
import shoppingCartIcon from "../../assets/shopping_cart.png";
import { Header } from "../../components/common/Header"

export const SelectPlans = () => {
  const [selectedCard, setSelectedCard] = useState(1); // Pro is at index 1
  const [selectedPrefix, setSelectedPrefix] = useState(700);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [currentPrefixPage, setCurrentPrefixPage] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const planCards = [
    {
      name: 'SINGLE',
      price: '$2.08',
      period: '/month per .ID',
      included: 1,
      redirects: '50,000',
      priceSubtext: '$25/year',
    },
    {
      name: 'PRO',
      price: '$1.24',
      period: '/month per .ID',
      included: 10,
      redirects: '50,000',
      priceSubtext: '$149/year',
    },
    {
      name: 'GOLD',
      price: '$0.66',
      period: '/month per .ID',
      included: 25,
      redirects: '50,000',
      priceSubtext: '$199/year',
    },
    {
      name: 'Elite',
      price: '$0.50',
      period: '/month per .ID',
      included: 50,
      redirects: '50,000',
      priceSubtext: '$299/year',
    }
  ];

  // Scroll to show PRO card by default with 10% of adjacent cards visible
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const containerWidth = container.clientWidth;
      const cardWidth = containerWidth * 0.8; // 80% width cards
      const gap = 16; // 1rem = 16px gap

      // Calculate scroll position to center the PRO card with 10% of adjacent cards visible
      const targetScrollPosition = selectedCard * (cardWidth + gap) - (containerWidth * 0.1);

      container.scrollTo({
        left: Math.max(0, targetScrollPosition),
        behavior: 'smooth'
      });
    }
  }, []); // Run only on mount

  const prefixNumbers = [100, 200, 300, 600, 700, 800, 900, 400, 500, 200, 150, 300];
  const prefixesPerPage = 6;
  const maxPages = Math.ceil(prefixNumbers.length / prefixesPerPage);

  const getCurrentPrefixes = () => {
    const startIndex = currentPrefixPage * prefixesPerPage;
    return prefixNumbers.slice(startIndex, startIndex + prefixesPerPage);
  };

  const getAvailableNumbers = (prefix: number) => {
    const numbers = [];
    for (let i = 0; i <= 90; i += 10) {
      numbers.push(prefix + i);
    }
    return numbers;
  };

  const generatePhoneNumbers = (baseNumber: number) => {
    return [
      `${baseNumber}-0001`,
      `${baseNumber}-0011`,
      `${baseNumber}-9901`,
      `${baseNumber}-1009`
    ];
  };

  const handlePrefixPrev = () => {
    setCurrentPrefixPage(prev => Math.max(0, prev - 1));
  };

  const handlePrefixNext = () => {
    setCurrentPrefixPage(prev => Math.min(maxPages - 1, prev + 1));
  };

  const handleNumberSelect = (number: any) => {
    setSelectedNumber(number);
  };

  const handleCardSelect = (index: number) => {
    setSelectedCard(index);

    // Scroll to the selected card with 10% of adjacent cards visible
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const containerWidth = container.clientWidth;
      const cardWidth = containerWidth * 0.8; // 80% width cards
      const gap = 16; // 1rem = 16px gap

      // Calculate scroll position to center the selected card with 10% of adjacent cards visible
      const targetScrollPosition = index * (cardWidth + gap) - (containerWidth * 0.1);

      container.scrollTo({
        left: Math.max(0, targetScrollPosition),
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mt-[26px] flex flex-col justify-center">
      <Header />

      <div className="mb-8">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide snap-x snap-mandatory"
        >
          {planCards.map((card, index) => (
            <div
              key={index}
              onClick={() => handleCardSelect(index)}
              className={`flex-shrink-0 w-[85%] p-4 bg-white rounded-[10px] cursor-pointer transition-all snap-center ${selectedCard === index ? 'border-4 border-[#E8618C]' : 'border border-gray-200'
                }`}
            >
              <div className="relative text-center">
                <h3 className="font-semibold text-[24px] text-[#242524]">{card.name}</h3>
                <div className="mt-[14px] text-[32px] text-[#379AE6] font-medium leading-tight">{card.price}<span className="text-[14px] text-[#6B7280] ml-2">{card.period}</span></div>
                <p className="text-[14px] text-[#6B7280] leading-tight">{card.priceSubtext}</p>
                <div className="mt-[42px] flex justify-between items-center px-2 leading-tight">
                  <p className='text-[16px] text-[#374151]'>Included .ID</p>
                  <p className='text-[32px] text-[#379AE6] font-semibold'>{card.included}</p>
                </div>
                <div className="mt-1 flex justify-between items-center px-2 leading-tight">
                  <p className='text-[16px] text-[#374151]'>Total Redirects</p>
                  <p className='text-[16px] text-[#242524] font-semibold'>{card.redirects}</p>
                </div>

                <div className='flex gap-x-2 mt-[24px] px-2'>
                  <div className='flex items-center'>
                    <img src={checkIcon} className='w-6 h-6' />
                  </div>
                  <p className='text-[14px] text-[#374151]'>Advanced Analytics</p>
                </div>

                <div className='flex gap-x-2 mt-[8px] px-2 pb-8'>
                  <div className='flex items-center'>
                    <img src={checkIcon} className='w-6 h-6' />
                  </div>
                  <p className='text-[14px] text-[#374151]'>Plan Upgradeable</p>
                </div>


                <button className="absolute -bottom-[36px] left-0 right-0 w-full bg-[#4285F4] text-white py-2 px-4 rounded-[10px] text-[20px] font-medium">
                  Select Prefix to Start
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Choose Prefix Number */}
      <div className="">
        <div className='flex justify-center -mt-6'>
          <img src={arrowDownIcon} className='w-12 h-12' />
        </div>
        <h2 className="text-[38px] text-[#1F54B0] font-semibold text-center px-4">Choose Prefix Number</h2>

        {/* Prefix Grid with Navigation */}
        <div className="flex items-center justify-center mt-[44px]">
          <button
            onClick={handlePrefixPrev}
            disabled={currentPrefixPage === 0}
            className="p-2 disabled:opacity-30"
          >
            <img src={keyboardLeftIcon} className='w-10 h-10' />
          </button>

          <div className="grid grid-cols-3 gap-[18px] px-6">
            {getCurrentPrefixes().map((prefix) => (
              <button
                key={prefix}
                onClick={() => setSelectedPrefix(prefix)}
                className={`w-20 h-12 px-8 py-3 flex items-center justify-center rounded-lg font-semibold text-[24px] transition-all ${selectedPrefix === prefix
                  ? 'bg-[#4285F4] text-white'
                  : 'bg-white text-[#374151] border-4 border-[#D1D5DB]'
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
            <img src={keyboardRightIcon} className='w-10 h-10' />
          </button>
        </div>
      </div>

      {/* Available Numbers */}
      <div className="">
        <div className='flex justify-center mt-3'>
          <img src={arrowDownIcon} className='w-12 h-12' />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {getAvailableNumbers(selectedPrefix).map((number) => (
            <button
              key={number}
              onClick={() => handleNumberSelect(number)}
              className={`flex-shrink-0 px-3 py-1 rounded-full font-medium text-[24px] transition-all ${selectedNumber === number
                ? 'text-[#EF4444] border border-red-300'
                : 'bg-[#E0F2FE] text-[#4285F4]'
                }`}
            >
              {number}
            </button>
          ))}
        </div>
      </div>

      {/* Phone Number Options */}
      {selectedNumber && (
        <>
          <div className='flex justify-center'>
            <img src={arrowDownIcon} className='w-12 h-12' />
          </div>
          <div className="space-y-3 grid grid-cols-2 gap-x-8 px-4">
            {generatePhoneNumbers(selectedNumber).map((phoneNumber, index) => (
              <div className='grid grid-cols-1'>
                <div className='border border-[#D1D5DB] rounded-[5px] flex items-center justify-between px-2 py-1'>
                  <p className='text-[24px] font-medium text-[#374151]'>{phoneNumber}</p>
                  <div className='flex items-center'>
                    <img src={selectionCartIcon} className='w-6 h-6' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="text-center">
        <button className='inline-block bg-[#4285F4] text-white text-[20px] rounded-[10px] px-4 py-2 mt-6'>
          Regenerate
        </button>
      </div>

      <div className='mt-[18px] px-4'>
        <div className='relative bg-white border border-[#D1D5DB] rounded-[5px]'>
          <input
            type='text'
            placeholder='733 -(Search available .ID)'
            className='w-full px-3 py-3 pr-12 rounded-[5px] text-[24px] border-none outline-none placeholder-gray-400'
          />
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
            <img src={selectionCartIcon} alt="Cart" className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="text-center mt-[32px] mb-[32px] flex justify-center items-center">
        <button className="flex items-center justify-center gap-2 bg-[#036937] text-white text-[24px] py-2 px-6 rounded-[10px]">
          <img src={shoppingCartIcon} alt="cart" className="w-10 h-10" />
          View cart
        </button>
      </div>

    </div>
  )
}