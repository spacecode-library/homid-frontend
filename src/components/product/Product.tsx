import React from 'react';
import InfoIcon from "../../assets/info.png";
import CloseIcon from "../../assets/close.png";
import BookmarkIcon from "../../assets/bookmark.png";
import AsteriskIcon from "../../assets/asterisk.png";

import KMartImg from "../../assets/kmart.png";
import BurgerKingImg from "../../assets/burgerKing.png";
import NavigateLogo from "../../assets/navigate.png";
import { subscriptionService } from '../../services/Subscriptions';

interface SearchResult {
  imageUrl: string;
  productName: string;
  productUrl?: string;
  description?: string;
  price?: number;
  websiteInfo?: string;
  websiteUrl?: string;
}

interface ProductItem {
  name: string;
  url: string;
  logo: string;
  brand: string;
}

interface ProductProps {
  searchResult: SearchResult;
  numericId: string;
}

export const Product: React.FC<ProductProps> = ({ searchResult, numericId }) => {
  const products = [
    {
      name: "Summer Outdoor Patio w/ Sunshade Sail Canopy",
      url: "https://www.kmart.com",
      logo: KMartImg,
      brand: "Kmart"
    },
    {
      name: "Summer Outdoor Patio w/ Sunshade Sail Canopy",
      url: "https://www.kmart.com",
      logo: BurgerKingImg,
      brand: "BMW"
    },
    {
      name: "Summer Outdoor Patio w/ Sunshade Sail Canopy",
      url: "https://www.kmart.com",
      logo: KMartImg,
      brand: "Burger King"
    }
  ];

  const handleConnect = async () => {
    const digits = numericId.replace(/\D/g, '');
    const obj = {
      homId: digits
    }
    const res = await subscriptionService.postHomIdRedirect(obj);
    if (res?.success) {
      window.open(searchResult.websiteUrl, "_blank");
      const obj = {
        "homId": digits
      }
      const storeHistory = await subscriptionService.postHistory(obj)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-2 bg-white">
      {/* Main Product Card */}
      <div className="bg-white rounded-[12px] border-4 border-[#87D6FF] p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <img src={InfoIcon} className='w-6 h-6' />
          </div>
          <div>
            <img src={CloseIcon} className='w-6 h-6' />
          </div>
        </div>

        {/* Main Product */}
        <div className="flex flex-col justify-center items-center">

          <div className='rounded-full -mt-8 w-[48px] h-[48px] overflow-hidden bg-[#1F54B0]'>
            <img
              src={searchResult?.imageUrl}
              className='w-full h-full object-cover'
              alt="Product"
            />
          </div>

          <div className='mt-[10px] flex flex-col justify-center items-center px-4'>
            <p className='text-[20px] text-center font-medium text-[#1F2937] leading-tight'>
              {searchResult?.productName
                ? (searchResult.productName.length > 40
                  ? `${searchResult.productName.substring(0, 40)}...`
                  : searchResult.productName
                )
                : ''
              }
            </p>
            <div className='flex justify-between items-center w-full'>
              <p className='text-[14px] text-[#6B7280] text-center w-full'>
                {searchResult?.websiteUrl
                  ? (searchResult.websiteUrl.length > 30
                    ? `${searchResult.websiteUrl.substring(0, 30)}...`
                    : searchResult.websiteUrl
                  )
                  : ''
                }
              </p>
              <div>
                <img src={BookmarkIcon} className='w-6 h-6' />
              </div>
            </div>
          </div>

          <div className='mt-5 flex flex-col justify-center items-center'>
            <p className='text-[14px] text-[#6B7280] px-4'>
              {searchResult?.websiteInfo
                ? (searchResult.websiteInfo.length > 140
                  ? `${searchResult.websiteInfo.substring(0, 140)}...`
                  : searchResult.websiteInfo
                )
                : ''
              }
            </p>
            {/* <a href={searchResult?.websiteUrl} target='_blank'> */}
            <button
              onClick={handleConnect}
              className='mt-[14px] text-white text-[20px] bg-[#3AB9F4] rounded-[20px] px-10'>Connect</button>
            {/* </a> */}
          </div>
        </div>

      </div>

      {/* Matching IDs Card */}
      <div className="bg-[#C3E1F8] rounded-[12px] border-4 border-[#00AEFF] p-4">
        <h4 className="text-[#1F54B0] font-medium text-[16px] text-center mb-4">
          Matching .ID from other countries
        </h4>

        <div className="space-y-3">
          {products.map((product, index) => (
            <div key={index} className="flex items-center p-3 border-b border-[#DDDDDD]">
              <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <img
                  src={product.logo}
                  alt={product.brand}
                  className="w-14 h-14 object-contain"
                />
              </div>
              <div className="flex-1 min-w-0 ml-[22px]">
                <h5 className="font-medium text-[18px] text-[#1F2937]">
                  {product.name}
                </h5>
                <p className="text-[#6B7280] text-[14px]">
                  {product.url}
                </p>
              </div>
              <button className="flex-shrink-0 ml-2">
                <img src={NavigateLogo} className='w-10 h-10' />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};