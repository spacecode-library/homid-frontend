import { Link } from "react-router-dom";
import CloseIcon from "../assets/close.png";

interface NotFoundProp {
  onClose: () => void;
}

export const NotFoundId: React.FC<NotFoundProp> = ({ onClose }) => {
  return (
    <div className="max-w-md mx-auto space-y-2 bg-white">
      <div className="bg-white rounded-[12px] border-4 border-[#87D6FF] p-4">

        <div onClick={onClose} className="flex justify-end">
          <img src={CloseIcon} className='w-6 h-6' />
        </div>

        <div className="mt-[20px]">
          <p className="text-[20px] font-semibold text-[#1F2937FF] text-center">No Matching .ID Found</p>
          <p className="mt-10 text-[20px] font-semibold text-[#379AE6FF] text-center"><span className="text-[#1F2937FF]">*</span><Link to={"/buyId"}>Available for Registration</Link></p>
        </div>

        <div className="flex justify-center pb-[42px]">
          <button
            onClick={onClose}
            className='mt-[44px] text-white text-[20px] bg-[#3AB9F4] rounded-[20px] px-10 disabled:opacity-50 flex items-center'>Close</button>
        </div>
      </div>
    </div>
  )
}