import { Header } from "../../components/common/Header"
import NavigateIcon from "../../assets/navigate.png";
import CloseIcon from "../../assets/close.png";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { subscriptionService } from "../../services/Subscriptions";
import toast from 'react-hot-toast';

interface FavouriteItem {
  id: string;
  homId: string;
  formattedHomId: string;
  productName: string;
  websiteInfo: string;
  websiteUrl: string;
  imageUrl: string;
}

interface FavouriteListData {
  id: string;
  name: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  items: FavouriteItem[];
}

export const FavouritesDetails = () => {
  const [favouriteList, setFavouriteList] = useState<FavouriteListData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const fetchFavourites = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const res = await subscriptionService.getFavouritesById(id);
      console.log("resjhdaj", res?.data)
      setFavouriteList(res?.data);
    } catch (error) {
      console.error("Error fetching favourites:", error);
      toast.error("Failed to load favourites");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchFavourites();
  }, [id])

  const handleDelete = async (itemId: string) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await subscriptionService.deleteFavouritesItem(id, itemId);
      if (res?.success) {
        toast.success("Item deleted successfully!");
        // Refetch the data after successful deletion
        await fetchFavourites();
      } else {
        toast.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  }

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

  // Loader Component
  const Loader = () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A73E8FF]"></div>
    </div>
  );

  return (
    <div className="mt-[26px] flex flex-col justify-center">
      <div className="flex space-x-2 px-5">
        <button
          onClick={() => navigate('/favourites')}
          className="text-[16px] font-bold text-[#1A73E8FF]"
        >
          Favourites
        </button>

        <span className="text-[16px] font-medium text-[#1A73E8FF]">&gt;</span>

        <span className="text-[16px] font-normal text-[#1464C8FF]">
          {favouriteList[0]?.name || ""}
        </span>
      </div>

      <div className="mt-[21px]">
        <Header />
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[10px] flex flex-col space-y-5 px-5">
          {favouriteList[0]?.items?.length > 0 ? (
            favouriteList?.[0]?.items?.map((favourite, index) => (
              <div key={index} className="flex border-b border-[#DDDDDDFF] pb-[10px]">
                {/* Image */}
                <img src={favourite?.imageUrl} className="w-[64px] h-[64px]" />

                {/* Right side */}
                <div className="flex flex-col flex-1 ml-4 leading-none">
                  {/* Name + Count */}
                  <div className="flex justify-between items-start leading-none">
                    <p className="text-[18px] font-medium text-[#000000FF]">
                      {favourite?.productName && favourite.productName.length > 23
                        ? `${favourite.productName.substring(0, 23)}...`
                        : favourite?.productName
                      }
                    </p>
                    <p className="text-[36px] font-bold text-[#1464C8FF]">
                      1
                    </p>
                  </div>

                  {/* URL */}
                  <p className="text-[14px] font-normal text-[#888888FF] -mt-2">
                    {favourite?.websiteUrl && favourite.websiteUrl.length > 23
                      ? `${favourite.websiteUrl.substring(0, 23)}...`
                      : favourite?.websiteUrl
                    }
                  </p>

                  {/* ID + Actions */}
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center">
                      <p className="flex text-[24px] font-bold text-[#00AEFFFF]">
                        .<span className="text-[#1F54B0FF]">ID</span>{" "}
                        <span className="ml-3 flex flex-nowrap">{favourite?.formattedHomId}</span>
                      </p>
                      <button
                        onClick={() => handleNavigate(favourite?.websiteUrl, favourite?.formattedHomId)}
                      >
                        <img src={NavigateIcon} className="w-6 h-6 ml-[18px]" />
                      </button>
                    </div>
                    <button onClick={() => handleDelete(favourite?.id)}>
                      <img src={CloseIcon} className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))) : (
            <p className="text-[#379AE6] text-[16px] flex items-center justify-center h-[60vh]">No Items added here</p>
          )}
        </div>
      )}
    </div>
  )
}