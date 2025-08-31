import { Header } from "../../components/common/Header"
import KMartImg from "../../assets/kmart.png";
import BurgerKingImg from "../../assets/burgerKing.png";
import NavigateIcon from "../../assets/navigate.png";
import CloseIcon from "../../assets/close.png";
import { useParams } from "react-router-dom";

export const FavouritesDetails = () => {
  const favouritesList = [
    {
      id: "1",
      favouritesListName: "Local Shops",
      products: [
        { img: KMartImg, name: "Mosquito Zapper - Zap..", count: "1", url: "https://www.walmart.com", id: "987-1234" },
        { img: BurgerKingImg, name: "Tyleno - 4 in 1 ...", count: "4", url: "https://www.shoptoday.com/dt-ref?0123", id: "010-1010" },
        { img: KMartImg, name: "Crest - Teeth Whitening...", count: "2", url: "https://www.amazon.com/dental-crest", id: "555-8888" },
      ]
    },
    {
      id: "2",
      favouritesListName: "Online Shopping",
      products: [
        { img: KMartImg, name: "Mosquito Zapper - Zap..", count: "1", url: "https://www.walmart.com", id: "987-1234" },
        { img: BurgerKingImg, name: "Tyleno - 4 in 1 ...", count: "4", url: "https://www.shoptoday.com/dt-ref?0123", id: "010-1010" },
        { img: KMartImg, name: "Crest - Teeth Whitening...", count: "2", url: "https://www.amazon.com/dental-crest", id: "555-8888" }
      ]
    },
    {
      id: "3",
      favouritesListName: "Clothings",
      products: [
        { img: KMartImg, name: "Mosquito Zapper - Zap..", count: "1", url: "https://www.walmart.com", id: "987-1234" },
        { img: BurgerKingImg, name: "Tyleno - 4 in 1 ...", count: "4", url: "https://www.shoptoday.com/dt-ref?0123", id: "010-1010" },
        { img: KMartImg, name: "Crest - Teeth Whitening...", count: "2", url: "https://www.amazon.com/dental-crest", id: "555-8888" }
      ]
    },
    {
      id: "4",
      favouritesListName: "Auto",
      products: [
        { img: KMartImg, name: "Mosquito Zapper - Zap..", count: "1", url: "https://www.walmart.com", id: "987-1234" },
        { img: BurgerKingImg, name: "Tyleno - 4 in 1 ...", count: "4", url: "https://www.shoptoday.com/dt-ref?0123", id: "010-1010" },
        { img: KMartImg, name: "Crest - Teeth Whitening...", count: "2", url: "https://www.amazon.com/dental-crest", id: "555-8888" }
      ]
    },
  ]

  const { id } = useParams();

  const currentFavouritesData = favouritesList.find(
    (favourite) => favourite.id === id
  );
  console.log("currentFavouritesData", currentFavouritesData)
  return (
    <div className="mt-[26px] flex flex-col justify-center">
      <Header />

      <div className="mt-[10px] flex flex-col space-y-5 px-5">
        {currentFavouritesData?.products.map((favourite, index) => (
          <div key={index} className="flex border-b border-[#DDDDDDFF] pb-[10px]">
            {/* Image */}
            <img src={favourite.img} className="w-[64px] h-[64px]" />

            {/* Right side */}
            <div className="flex flex-col flex-1 ml-4 leading-none">
              {/* Name + Count */}
              <div className="flex justify-between items-start leading-none">
                <p className="text-[18px] font-medium text-[#000000FF]">
                  {favourite.name}
                </p>
                <p className="text-[36px] font-bold text-[#1464C8FF]">
                  {favourite.count}
                </p>
              </div>

              {/* URL */}
              <p className="text-[14px] font-normal text-[#888888FF] -mt-2">
                {favourite.url}
              </p>

              {/* ID + Actions */}
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center">
                  <p className="w-[160px] text-[24px] font-bold text-[#00AEFFFF]">
                    .<span className="text-[#1F54B0FF]">ID</span>{" "}
                    <span>{favourite.id}</span>
                  </p>
                  <img src={NavigateIcon} className="w-6 h-6 ml-[18px]" />
                </div>
                <img src={CloseIcon} className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}