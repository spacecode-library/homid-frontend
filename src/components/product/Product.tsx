import React, { useEffect, useState } from 'react';
import InfoIcon from "../../assets/info.png";
import CloseIcon from "../../assets/close.png";
import BookmarkIcon from "../../assets/bookmark.png";
import AsteriskIcon from "../../assets/asterisk.png";

import KMartImg from "../../assets/kmart.png";
import BurgerKingImg from "../../assets/burgerKing.png";
import NavigateLogo from "../../assets/navigate.png";
import { subscriptionService } from '../../services/Subscriptions';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

interface SearchResult {
  id?: string;
  homId?: string;
  imageUrl: string;
  productName: string;
  productUrl?: string;
  description?: string;
  price?: number;
  websiteInfo?: string;
  websiteUrl?: string;
}

interface Product {
  imageUrl: string;
  name: string;
  count: string;
  url: string;
  id: string;
}

interface ProductItem {
  name: string;
  url: string;
  logo: string;
  brand: string;
}

interface FavouriteFolder {
  id: string;
  name: string;
  items?: Product[];
}

interface ProductProps {
  searchResult: SearchResult;
  numericId: string;
  onClose: () => void;
}

export const Product: React.FC<ProductProps> = ({ searchResult, numericId, onClose }) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [allFav, setAllFav] = useState<FavouriteFolder[]>([]);
  const [isLoadingFavourites, setIsLoadingFavourites] = useState<boolean>(false);
  const [isAddingToFavourite, setIsAddingToFavourite] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const navigate = useNavigate();
  const products: ProductItem[] = [
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

  useEffect(() => {
    if (!showPopup) return;
    const getGavouriteList = async () => {
      try {
        setIsLoadingFavourites(true);
        const res = await subscriptionService.getFavouriteFolder();
        setAllFav(res?.data);
      } catch (error) {
        console.error("Error fetching favourites:", error);
        toast.error("Failed to load favourite folders");
      } finally {
        setIsLoadingFavourites(false);
      }
    }
    getGavouriteList();
  }, [showPopup])

  const handleAddTofavourite = async (id: string) => {
    try {
      setIsAddingToFavourite(true);
      const obj = {
        "homIdentifier": searchResult?.id,
        "homId": searchResult?.homId
      }
      const res = await subscriptionService.postAddTofavouriteCard(id, obj);
      if (res?.success) {
        setShowPopup(false);
        toast.success(res?.message);
        // navigate("/favourites");
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.error("Error adding to favourite:", error);
      toast.error("Failed to add to favourite");
    } finally {
      setIsAddingToFavourite(false);
    }
  }

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
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
        toast.success("Connected successfully!");
      } else {
        toast.error("Failed to connect");
      }
    } catch (error) {
      console.error("Error connecting:", error);
      toast.error("Failed to connect");
    } finally {
      setIsConnecting(false);
    }
  }

  const getLayoutClasses = (itemCount: number): string => {
    switch (itemCount) {
      case 1:
        return "w-full h-full flex justify-center items-center";
      case 2:
        return "w-full h-full grid grid-cols-2 gap-1";
      case 3:
        return "flex flex-wrap justify-center items-center gap-2";
      default: // 4 or more
        return "grid grid-cols-2 gap-2 place-items-center";
    }
  };

  const getImageSize = (itemCount: number): string => {
    switch (itemCount) {
      case 1:
        return "w-full h-full object-cover rounded-[12px]";
      case 2:
        return "w-full h-full object-cover rounded-[8px]";
      case 3:
        return "w-[30px] h-[30px]";
      default: // 4 or more
        return "w-[30px] h-[30px]";
    }
  };

  // Loader Component for popup
  const PopupLoader = () => (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A73E8FF]"></div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto space-y-2 bg-white">
      {/* Main Product Card */}
      <div className="bg-white rounded-[12px] border-4 border-[#87D6FF] p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <img src={InfoIcon} className='w-6 h-6' />
          </div>
          <div onClick={onClose}>
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
            <p className='text-[20px] text-center font-semibold text-[#1F2937] leading-tight'>
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
              <div onClick={() => setShowPopup(true)}>
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
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className='mt-[14px] text-white text-[20px] bg-[#3AB9F4] rounded-[20px] px-10 disabled:opacity-50 flex items-center'>
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : (
                'Connect'
              )}
            </button>
          </div>

          {
            showPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white w-full max-w-md mx-4 rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-[#1A73E8FF]">Your Favourite List</h3>
                    <button
                      onClick={() => setShowPopup(false)}
                      className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                      type="button"
                      aria-label="Close"
                      disabled={isAddingToFavourite}
                    >
                      ×
                    </button>
                  </div>

                  {isLoadingFavourites ? (
                    <PopupLoader />
                  ) : (
                    <div className="grid grid-cols-3 gap-[10px] py-[10px]">
                      {allFav.map((favouritesItem: FavouriteFolder) => {
                        const items = favouritesItem?.items || [];
                        const itemCount = items.length;
                        const displayItems = itemCount > 4 ? items.slice(0, 4) : items;

                        return (
                          <div
                            key={favouritesItem.id}
                            className={`flex flex-col cursor-pointer ${isAddingToFavourite ? 'opacity-50 pointer-events-none' : ''}`}
                            onClick={() => !isAddingToFavourite && handleAddTofavourite(favouritesItem.id)}
                          >
                            <div className="rounded-[20px] border-2 border-[#00E5FFFF] p-4 flex justify-center items-center h-[110px]">
                              <div className={getLayoutClasses(itemCount)}>
                                {displayItems.map((product: Product, index: number) => (
                                  <img
                                    key={index}
                                    src={product.imageUrl}
                                    alt=""
                                    className={`${getImageSize(itemCount)} object-contain`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-[14px] font-normal text-[#1A73E8FF] text-center">
                              {favouritesItem.name}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {isAddingToFavourite && (
                    <div className="flex justify-center items-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1A73E8FF] mr-2"></div>
                      <span className="text-[#1A73E8FF]">Adding to favourite...</span>
                    </div>
                  )}

                </div>
              </div>
            )
          }
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

      {/* Toast Notification */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};