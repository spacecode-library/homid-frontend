import flag1Icon from "../../assets/flag1.png";
import flag2Icon from "../../assets/flag2.png";
import flag3Icon from "../../assets/flag3.png";
import globeIcon from "../../assets/globeIcon.svg";

export const Global = () => {
  const flagIcons = [flag1Icon, flag2Icon, flag3Icon];
  return (
    <div className="px-[30px] py-4">
      {/* First Row - Country Registration */}
      <div className="flex items-start gap-8 mb-8">
        {/* ID Number */}
        <div className="text-blue-600 font-medium text-lg">
          884-1234
        </div>

        {/* Registration Section */}
        <div className="flex-1">
          <div className="flex items-start gap-8">
            {/* Text and Price */}
            <div className="flex flex-col">
              <p className="text-gray-700 text-base mb-4 min-w-[180px]">
                Register this .ID in<br />
                these Countries:
              </p>

              {/* Price */}
              <div className="flex flex-col">
                <div className="text-4xl font-normal text-gray-800">$ 1.24</div>
                <div className="text-base text-gray-600">/month/Country</div>
              </div>
            </div>


            <div className="ml-[60px]">
              {/* Country Flags */}
              <div className="flex gap-2 mb-4">
                {flagIcons.map((flag, idx) => (
                  <div key={idx} className="flex items-center">
                    <img src={flag} className="w-[30px] h-[30px]" alt={`Flag ${idx + 1}`} />
                  </div>
                ))}
              </div>

              <div className="flex items-center">
                {/* Search Input */}
                <div className="flex flex-col">
                  <div>
                    <input
                      type="text"
                      placeholder="Select Max 20"
                      className="w-full max-w-[170px] px-4 py-1 border border-[#BCC1CAFF] rounded-md text-sm placeholder-[#BCC1CAFF] focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    />
                  </div>
                  <div className="flex items-center">
                    <p className="text-base text-gray-700 leading-tight">
                      Search Countries you wish to Register your .ID
                    </p>

                    <div className="flex items-center gap-6 ml-[80px]">
                      <div className="text-base text-gray-700">
                        Total: <span className="ml-8">$ 1.24/mo</span>
                      </div>
                      <button className="px-4 py-1 text-sm font-medium text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50 transition-colors">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separator */}
      <hr className="border-gray-200 mb-6" />

      {/* Second Row - Global Registration */}
      <div className="flex items-center gap-8">
        {/* Globe Icon */}
        <div className="w-12 h-12 flex items-center justify-center">
          <img src={globeIcon} className="w-[34px] h-[34px]"/>
        </div>

        {/* Global Registration Content */}
        <div className="flex items-center gap-12 flex-1">
          {/* Global Registrations */}
          <div className="flex flex-col ml-[35px]">
            <p className="text-base text-gray-700 mb-1">Global Registrations</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-normal text-gray-800">$ 99</span>
              <span className="text-base text-gray-600">/month</span>
            </div>
          </div>

          {/* Global Coverage Registration */}
          <div className="flex items-center gap-8 flex-1 ml-[72px]">
            <div className="flex flex-col">
              <p className="text-base text-gray-700">Global Coverage Registration</p>
            </div>

            <div className="text-base text-gray-700 ml-[240px]">
              $99/month
            </div>

            <button className="px-4 py-1 text-sm font-medium text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50 transition-colors">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}