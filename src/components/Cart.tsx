import React from "react";
import { motion } from "framer-motion";
import shopCartIcon from "../assets/shop-cart.png";
import closeIcon from "../assets/close-small.png";
import exitIcon from "../assets/exit-icon.png";

type CartProps = {
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Cart: React.FC<CartProps> = ({ setShowCart }) => {
  return (
     <motion.div
      initial={{ x: "100%" }}       // start off screen (right)
      animate={{ x: 0 }}            // slide in
      exit={{ x: "100%" }}          // slide out
      transition={{ type: "tween", duration: 0.4 }}
      className="fixed top-0 right-0 h-full w-[400px] z-50"
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
                <div className="bg-[#DCFCE7] rounded-full py-1 px-4 flex justify-between items-center">
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

      <div className="absolute left-0 top-1/2" onClick={() => setShowCart(false)}>
        <img src={exitIcon} className="w-11 h-11" />
      </div>
    </div>
    </motion.div>
  )
}