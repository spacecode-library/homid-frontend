import { useState } from 'react';
import shopCartIcon from "../../assets/shop-cart.png";
import closeIcon from "../../assets/close-small.png";
import arrowDownIcon from "../../assets/arrow-down.png";
import keyboardLeftIcon from "../../assets/keyboard-left.png";
import keyboardRightIcon from "../../assets/keyboard-right.png";
import selectionCartIcon from "../../assets/selection-cart.png";
import shoppingCartIcon from "../../assets/shopping_cart.png";

export const Cart = () => {
  const [selectedPrefix, setSelectedPrefix] = useState(700);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [currentPrefixPage, setCurrentPrefixPage] = useState(0);


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

  return (
    <div className="p-4">
      <div className="border-4 border-[#BAF3EB] rounded-[10px] bg-[#FFF87F] p-3">
        <div className="flex justify-between items-center border-b-2 border-[#DEE1E6] py-3">
          <div className="flex items-center gap-x-[18px]">
            <div className="flex items-center">
              <img src={shopCartIcon} className="w-8 h-8" />
            </div>
            <p className="text-[24px] text-[#171A1F] font-medium">Cart</p>
          </div>

          <p className="text-[24px] text-[#FF0000] font-medium">Side Widget</p>
        </div>

        <div className="mt-3">
          <p className="text-[24px] text-[#171A1F] font-semibold text-center">Plan Applied</p>
          <p className="text-[40px] font-semibold text-[#4285F4] text-center">Pro</p>
          <p className="text-[#4285F4] text-[32px] font-medium text-center">$1.24<span className="ml-2 text-[#6B7280] text-[16px]">/month per .ID</span></p>
          <p className="text-[#6B7280] text-[20px] font-medium text-center">$149/year</p>

          <div className="flex px-10 justify-between items-center mt-[22px] border-b border-[#DEE1E6] pb-[14px] leading-tight">
            <p className="text-[24px] text-[#242524] font-semibold">Included .ID</p>
            <p className="text-[48px] text-[#4285F4] font-semibold">10</p>
          </div>

          <div className="flex justify-center items-center mt-2 border-b border-[#DEE1E6] pb-[14px] leading-tight">
            <p className="text-[20px] text-[#242524] font-medium"><span className="text-[30px] text-[#379AE6]">7</span> of <span className="text-[30px] text-[#DE3B40]">10</span> Selected</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-x-[18px] gap-y-[14px]">
            {
              ["733 - 1001", "733 - 0077", "710 - 1001", "488 - 0077", "733 - 0011", "633 - 0077", "123 - 0077"].map((id) => (
                <div className="bg-[#DCFCE7] rounded-full py-2 px-4 flex justify-between items-center">
                  <p className="text-[18px] text-[#166534]">{id}</p>

                  <div className="flex items-center">
                    <img src={closeIcon} className="w-8 h-8" />
                  </div>
                </div>
              ))
            }
          </div>

          <div className="text-center pb-2">
            <button className="bg-[#4285F4] text-white text-[20px] font-medium py-3 px-14 rounded-[10px] mt-[34px]">Checkout</button>
          </div>
        </div>
      </div>

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