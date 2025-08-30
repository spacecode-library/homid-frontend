import KMartImg from "../../assets/kmart.png";
import BurgerKingImg from "../../assets/burgerKing.png";
import addIcon from "../../assets/add.png";
import { Header } from "../../components/common/Header"

export const Favourites = () => {
  const favouritesList = [
    {
      favouritesListName: "Local Shops",
      products: [
        { img: KMartImg, name: "Mosquito Zapper - Zap..", count: "1", url: "https://www.walmart.com", id: "987-1234" },
        { img: BurgerKingImg, name: "Tyleno - 4 in 1 ...", count: "4", url: "https://www.shoptoday.com/dt-ref?0123", id: "010-1010" },
        { img: KMartImg, name: "Crest - Teeth Whitening...", count: "2", url: "https://www.amazon.com/dental-crest", id: "555-8888" },
      ]
    },
    {
      favouritesListName: "Online Shopping",
      products: [
        { img: KMartImg, name: "Mosquito Zapper - Zap..", count: "1", url: "https://www.walmart.com", id: "987-1234" },
        { img: BurgerKingImg, name: "Tyleno - 4 in 1 ...", count: "4", url: "https://www.shoptoday.com/dt-ref?0123", id: "010-1010" },
        { img: KMartImg, name: "Crest - Teeth Whitening...", count: "2", url: "https://www.amazon.com/dental-crest", id: "555-8888" }
      ]
    },
    {
      favouritesListName: "Clothings",
      products: [
        { img: KMartImg, name: "Mosquito Zapper - Zap..", count: "1", url: "https://www.walmart.com", id: "987-1234" },
        { img: BurgerKingImg, name: "Tyleno - 4 in 1 ...", count: "4", url: "https://www.shoptoday.com/dt-ref?0123", id: "010-1010" },
        { img: KMartImg, name: "Crest - Teeth Whitening...", count: "2", url: "https://www.amazon.com/dental-crest", id: "555-8888" }
      ]
    },
    {
      favouritesListName: "Auto",
      products: [
        { img: KMartImg, name: "Mosquito Zapper - Zap..", count: "1", url: "https://www.walmart.com", id: "987-1234" },
        { img: BurgerKingImg, name: "Tyleno - 4 in 1 ...", count: "4", url: "https://www.shoptoday.com/dt-ref?0123", id: "010-1010" },
        { img: KMartImg, name: "Crest - Teeth Whitening...", count: "2", url: "https://www.amazon.com/dental-crest", id: "555-8888" }
      ]
    },
  ]
  return (
    <div className="mt-[26px] flex flex-col justify-center">
      <Header />

      <div className="grid grid-cols-3 gap-[10px] px-6 py-[10px]">
        {favouritesList.map((favouritesItem) => (
          <div className="flex flex-col">
            <div className="rounded-[20px] border-2 border-[#00E5FFFF] p-4 flex justify-center items-center">
              <div className="flex flex-wrap gap-[16px] justify-between">
                {favouritesItem.products.map((product, index) => (
                  <img
                    key={index}
                    src={product.img}
                    className="w-[30px] h-[30px] object-contain"
                  />
                ))}
              </div>
            </div>
            <p className="text-[14px] font-normal text-[#1A73E8FF] text-center">
              {favouritesItem.favouritesListName}
            </p>
          </div>
        ))}

        {/* Add button as a grid item card */}
        <div className="flex items-center -mt-[16px] ml-[40px]">
          <button className="bg-[#1A73E8FF] rounded-full flex justify-center items-center p-4">
            <img src={addIcon} className="w-[40px] h-[40px]" />
          </button>
        </div>
      </div>

    </div>
  )
}