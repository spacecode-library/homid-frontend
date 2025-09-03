import React, { useState } from "react";
import { motion } from "framer-motion";
import shopCartIcon from "../assets/shop-cart.png";
import closeIcon from "../assets/close-small.png";
import exitIcon from "../assets/exit-icon.png";
import enterIcon from "../assets/enter.png";
import { subscriptionService } from "../services/Subscriptions";

type CartProps = {
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPhoneNumbers: string[];
  onRemovePhoneNumber: (phoneNumber: string) => void;
  selectedPlan: {
    name: string;
    price: string;
    period: string;
    included: number;
    redirects: string;
    priceSubtext: string;
  };
};

export const Cart: React.FC<CartProps> = ({
  setShowCart,
  selectedPhoneNumbers,
  onRemovePhoneNumber,
  selectedPlan
}) => {
  console.log("selectedPlan", selectedPlan)
  const planId = selectedPlan.name.toLowerCase();
  const [loading, setLoading] = useState(false);

  // const handleCheckoutPlan = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await subscriptionService.createSubscription(planId);
  //     if (res.success) {
  //       const billingRes = await subscriptionService.createBillingPortalSession();
  //       if (billingRes.success) {
  //         window.open(billingRes.data.url, "_blank");
  //         setLoading(false)
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const handleInsertId = async () => {
    setLoading(true)
    try {
      const cleanedNumbers = selectedPhoneNumbers.map(num => num.replace(/-/g, ""));
      const obj = {
        "ids": cleanedNumbers,
        "countryCode": "US",
        "planId": planId,
        "totalId": selectedPlan.included
      }
      const res = await subscriptionService.insertCartId(obj);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }


  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "tween", duration: 0.4 }}
      className="fixed top-0 right-0 h-full w-[400px] z-50 overflow-y-auto"
    >
      <div className="relative">
        <div className="border-4 border-[#BAF3EB] rounded-[10px] bg-[#FFF87F] p-3">
          <div className="flex justify-between items-center border-b-2 border-[#DEE1E6] py-3">
            <div className="flex items-center gap-x-[18px]">
              <div className="flex items-center">
                <img src={shopCartIcon} className="w-8 h-8" />
              </div>
              <p className="text-[24px] text-[#171A1F] font-medium">Cart</p>
            </div>

            {/* <p className="text-[24px] text-[#FF0000] font-medium">Side Widget</p> */}
            <div className="flex items-center" onClick={() => setShowCart(false)}>
              <img src={closeIcon} className="w-10 h-10" />
            </div>
          </div>

          <div className="mt-3">
            <p className="text-[24px] text-[#171A1F] font-semibold text-center">Plan Applied</p>
            <p className="text-[40px] font-semibold text-[#4285F4] text-center">{selectedPlan.name}</p>
            <p className="text-[#4285F4] text-[32px] font-medium text-center">
              {selectedPlan.price}
              <span className="ml-2 text-[#6B7280] text-[16px]">{selectedPlan.period}</span>
            </p>
            <p className="text-[#6B7280] text-[20px] font-medium text-center">{selectedPlan.priceSubtext}</p>

            <div className="flex px-10 justify-between items-center mt-[22px] border-b border-[#DEE1E6] pb-[14px] leading-tight">
              <p className="text-[24px] text-[#242524] font-semibold">Included .ID</p>
              <p className="text-[48px] text-[#4285F4] font-semibold">{selectedPlan.included}</p>
            </div>

            <div className="relative">
              <div className="flex justify-center items-center mt-2 border-b border-[#DEE1E6] pb-[14px] leading-tight">
                <p className="text-[20px] text-[#242524] font-medium">
                  <span className="text-[30px] text-[#379AE6]">{selectedPhoneNumbers.length}</span> of{" "}
                  <span className="text-[30px] text-[#DE3B40]">{selectedPlan.included}</span> Selected
                </p>
              </div>

              {/* Exit Icon */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowCart(false)}
              >
                <img src={exitIcon} className="w-11 h-11" />
              </div>
            </div>


            <div className="mt-4 grid grid-cols-2 gap-x-[18px] gap-y-[14px]">
              {selectedPhoneNumbers.map((phoneNumber) => (
                <div key={phoneNumber} className="bg-[#DCFCE7] rounded-full py-1 px-4 flex justify-between items-center">
                  <p className="text-[18px] text-[#166534]">{phoneNumber}</p>
                  <div className="flex items-center cursor-pointer" onClick={() => onRemovePhoneNumber(phoneNumber)}>
                    <img src={closeIcon} className="w-8 h-8" />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pb-2">
              <button
                disabled={loading}
                // onClick={handleCheckoutPlan}
                onClick={handleInsertId}
                className={`mx-auto flex items-center justify-center gap-x-4 bg-[#4285F4] text-white text-[20px] font-medium py-3 px-10 rounded-[10px] mt-[34px] transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}>
                {
                  loading ? <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Checkout...
                  </div> : 'Checkout'
                }

                <img src={enterIcon} className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};