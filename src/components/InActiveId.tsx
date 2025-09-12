import CloseIcon from "../assets/close.png";
import KMartImg from "../assets/kmart.png";
import BurgerKingImg from "../assets/burgerKing.png";
import NavigateLogo from "../assets/navigate.png";

interface InActiveIdProps {
  onClose: () => void;
}

interface ProductItem {
  name: string;
  url: string;
  logo: string;
  brand: string;
}

export const InActiveId: React.FC<InActiveIdProps> = ({ onClose }) => {
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

  return (
    <div className="max-w-md mx-auto space-y-2 bg-white">
      <div className="bg-white rounded-[12px] border-4 border-[#87D6FF] p-4">

        <div onClick={onClose} className="flex justify-end">
          <img src={CloseIcon} className='w-6 h-6' />
        </div>

        <div className="flex flex-col px-[40px] mt-4">
          <p className="text-[20px] font-semibold text-[#FF0000FF] text-center">Inactive:</p>
          <p className="text-[20px] font-semibold text-[#FF0000FF] text-center">The registered .ID is Not Activated or Deactivated by the registered owner</p>
        </div>

        <div className="flex justify-center pb-[42px]">
          <button
            onClick={onClose}
            className='mt-[46px] text-white text-[20px] bg-[#3AB9F4] rounded-[20px] px-10 disabled:opacity-50 flex items-center'>Close</button>
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
  )
}