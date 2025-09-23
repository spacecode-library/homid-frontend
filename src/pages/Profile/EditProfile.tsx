import { Mail, MapPin, User } from "lucide-react";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { subscriptionService } from "../../services/Subscriptions";
import toast from "react-hot-toast";

export const EditProfile: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<{ countryCode: string; number: string }>({
    countryCode: "",
    number: "",
  });

  useEffect(() => {
    const getUsersInfo = async () => {
      const res = await subscriptionService.getUsersInfo();
      if (res.success) {
        const data = res.data;
        setFirstName(data?.firstName);
        setLastName(data?.lastName);
        setEmail(data?.email);
        setAddress(data?.address);
        setPhone({
          countryCode: data?.dialCode,
          number: data?.phone
        })
      }
    }
    getUsersInfo();
  }, [])

  const handleUpdate = async () => {
    const obj = {
      firstName: firstName,
      lastName: lastName,
      address: address,
      dialCode: phone.countryCode,
      phone: phone.number
    }

    setIsLoading(true);
    try {
      const res = await subscriptionService.updateProfile(obj);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-2xl space-y-8">
        <div>
          <h2
            className="mt-6 text-center text-[34px] font-bold"
            style={{ color: '#1F54B0' }}
          >
            Update Profile
          </h2>
        </div>

        <div className="mt-8 space-y-6">

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-[20px] font-medium mb-1"
                style={{ color: '#1F54B0' }}
              >
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="appearance-none block w-full pl-10 pr-3 py-3 border placeholder-gray-500 text-gray-900 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  style={{ borderColor: '#1F54B0' }}
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-[20px] font-medium mb-1"
                style={{ color: '#1F54B0' }}
              >
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="appearance-none block w-full pl-10 pr-3 py-3 border placeholder-gray-500 text-gray-900 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  style={{ borderColor: '#1F54B0' }}
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-[20px] font-medium mb-1"
              style={{ color: '#1F54B0' }}
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <Mail className="h-5 w-5 text-gray-600" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="appearance-none block w-full pl-10 pr-3 py-3 border placeholder-gray-500 text-gray-900 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                style={{ borderColor: '#1F54B0' }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="email"
              className="block text-[20px] font-medium mb-1"
              style={{ color: '#1F54B0' }}
            >
              Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <MapPin className="h-5 w-5 text-gray-600" />
              </div>
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="address"
                className="appearance-none block w-full pl-10 pr-3 py-3 border placeholder-gray-500 text-gray-900 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                style={{ borderColor: '#1F54B0' }}
                placeholder="Enter your addreess"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone"
              className="block text-[20px] font-medium mb-1"
              style={{ color: "#1F54B0" }}
            >
              Phone Number
            </label>
            <PhoneInput
              country={"us"}
              value={phone.number}
              onChange={(value: string, data: any) =>
                setPhone({ countryCode: data.dialCode, number: value.replace(`+${data.dialCode}`, "") })
              }
              inputProps={{
                name: "phone",
                required: true,
                disabled: isLoading,
                className: "w-full pl-14 py-3 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
              }}
              containerClass="relative"
              buttonClass="absolute left-0 top-0 h-full flex items-center"
              inputStyle={{ borderColor: "#1F54B0" }}
              enableSearch
              countryCodeEditable={false}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="button"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-[20px] font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              style={{ backgroundColor: '#1F54B0' }}
              onClick={handleUpdate}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </div>
              ) : (
                'Update Profile'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}