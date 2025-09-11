import React, { useEffect, useState } from "react";
import { CountryCode, CountryCodeReverse } from "../../utils/CountryCode";
import {
  Search,
  ChevronDown,
  ExternalLink,
  X,
  Plus,
} from "lucide-react";

import {
  Youtube,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Music2,
  Pencil,
} from "lucide-react";
import gobalIcon from "../../assets/globalIcon.png";
import social1 from "../../assets/social1.png";
import social2 from "../../assets/social2.png";
import social3 from "../../assets/social3.png";
import social4 from "../../assets/social4.png";
import social5 from "../../assets/social5.png";
import social6 from "../../assets/social6.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TargetedAudience } from "./TargetedAudience";
import { Global } from "./Global";
import { subscriptionService } from "../../services/Subscriptions";
import { CountrySelectorRow } from "../CountrySelectorRow";
import { CountryMultiSelector } from "../CountryMultiSelector";
import { SocialMediaSelector } from "../SocialMediaSelector";
import toast from "react-hot-toast";

// Types
interface AccordionData {
  redirectUrl: string;
  artImage: string;
  websiteTitle: string;
  websiteDescription: string;
  brandOwner: string;
  websiteInfo: string;
  categories: string[];
  demographics: string;
}

interface Selections {
  ageGroup: string;
  gender: string;
  incomeLevel: string;
}

interface TableRow {
  id: string;
  targetUrl: string;
  productName: string;
  totalRedirects: string;
  status: "pending" | "approved" | "rejected" | "auto_approved";
  numericId: string;
  websiteUrl: string,
  redirectCreditsUsed: number;
  accordionData: AccordionData;
}

interface SocialMediaItem {
  id: string;
  name: string;
  icon: string;
  checked: boolean;
  socialLink?: string,
  customValue?: string;
}

export const MyIDsTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [globalExpandedRow, setGlobalExpandedRow] = useState<number | null>(null);
  const [currentId, setCurrentId] = useState<string>("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteInfo, setWebsiteInfo] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editWebsiteInfo, setEditWebsiteInfo] = useState("");
  const [aiWebSiteInfo, setAIWebsiteInfo] = useState("");
  const [isAdultWebsite, setIsAdultWebsite] = useState<null | boolean>(null);
  const [isPromotingOwnServices, setIsPromotingOwnServices] = useState<null | boolean>(null);
  const [isOwnerOrAdmin, setIsOwnerOrAdmin] = useState<null | boolean>(null);
  // States for Row #2
  const [value2, setValue2] = useState<string>("");
  const [selectedCountry2, setSelectedCountry2] = useState<string>("");
  const [isOpen2, setIsOpen2] = useState<boolean>(false);
  // States for Row #3
  const [value3, setValue3] = useState<string>("");
  const [selectedCountry3, setSelectedCountry3] = useState<string>("");
  const [isOpen3, setIsOpen3] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [stopDate, setStopDate] = useState<Date | null>(new Date());
  const [socialMediaData, setSocialMediaData] = useState<SocialMediaItem[]>([
    { id: 'youtube', name: 'YouTube', icon: social1, checked: false, socialLink: '' },
    { id: 'instagram', name: 'Instagram', icon: social2, checked: false, socialLink: '' },
    { id: 'tiktok', name: 'TikTok', icon: social3, checked: false, socialLink: '' },
    { id: 'facebook', name: 'Facebook', icon: social4, checked: false, socialLink: '' },
    { id: 'linkedin', name: 'LinkedIn', icon: social5, checked: false, socialLink: '' },
    { id: 'twitter', name: 'Twitter/X', icon: social6, checked: false, socialLink: '' },
    { id: 'other', name: 'Other', icon: '', checked: false, customValue: '', socialLink: '' }
  ]);
  const [totalEarning, setTotalEarning] = useState<number>(0);
  const [memo, setMemo] = useState<string>("");
  const [affiliateUrl, setAffiliateUrl] = useState<null | boolean>(null);
  const [isPaidPromotion, setIsPaidPromotion] = useState<null | boolean>(null);
  const [brandOwnerUrl, setBrandOwnerUrl] = useState<string>("");
  const [brandPromotion, setBrandPromotion] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selections, setSelections] = useState<Selections>({
    ageGroup: "Dropdown",
    gender: "Dropdown",
    incomeLevel: "Dropdown",
  });
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);


  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [productName, setProductName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [showAddTags, setShowAddTags] = useState(false);

  const [isReadUrl, setIsReadUrl] = useState<boolean>(false);
  const [isEditedSave, setIsEditedSave] = useState<boolean>(false);

  const [localStatusStates, setLocalStatusStates] = useState<Record<string, "pending" | "approved" | "rejected" | "auto_approved">>({});

  const resetForm = () => {
    setWebsiteUrl("");
    setWebsiteInfo("");
    setIsAdultWebsite(null);
    setIsPromotingOwnServices(null);
    setIsOwnerOrAdmin(null);

    setValue2("");
    setSelectedCountry2("");
    setIsOpen2(false);

    setValue3("");
    setSelectedCountry3("");
    setIsOpen3(false);

    setSelected([]);

    setStartDate(new Date());
    setStopDate(new Date());

    setSocialMediaData([
      { id: 'youtube', name: 'YouTube', icon: social1, checked: false, socialLink: '' },
      { id: 'instagram', name: 'Instagram', icon: social2, checked: false, socialLink: '' },
      { id: 'tiktok', name: 'TikTok', icon: social3, checked: false, socialLink: '' },
      { id: 'facebook', name: 'Facebook', icon: social4, checked: false, socialLink: '' },
      { id: 'linkedin', name: 'LinkedIn', icon: social5, checked: false, socialLink: '' },
      { id: 'twitter', name: 'Twitter/X', icon: social6, checked: false, socialLink: '' },
      { id: 'other', name: 'Other', icon: '', checked: false, customValue: '', socialLink: '' }
    ]);

    setTotalEarning(0);
    setMemo("");
    setAffiliateUrl(null);
    setIsPaidPromotion(null);
    setBrandOwnerUrl("");
    setBrandPromotion("");

    setSelectedFilters([]);

    setSelections({
      ageGroup: "Dropdown",
      gender: "Dropdown",
      incomeLevel: "Dropdown",
    });

    setTermsAccepted(false);

    setShowAddTags(false);
  }

  useEffect(() => {
    if (!currentId) return;
    resetForm();
    const getIdsPrefilledDetails = async () => {
      try {
        const res = await subscriptionService.getHomeIdsDetails(currentId);
        if (res.success) {
          const data = res.data;
          setWebsiteUrl(data?.websiteUrl);
          setWebsiteInfo(data.editInfo ? data.editInfo : data.websiteInfo);
          setIsAdultWebsite(data?.adultGambling);
          setIsPromotingOwnServices(data?.promotion);
          setIsOwnerOrAdmin(data?.ownerOrAdministrator);

          setValue2(data?.targetRegion2);
          setSelectedCountry2((data?.targetRegion2));

          setValue3(data?.targetRegion3);
          setSelectedCountry3(data?.targetRegion3);

          const filterCountry = data?.blockedCountries?.map((country: any) => (
            CountryCodeReverse[country?.countryCode]
          ))
          setSelected(filterCountry);

          setStartDate(data?.startDate);
          setStopDate(data?.endDate);

          setSocialMediaData(prevData =>
            prevData.map(item => {
              if (item.id === 'other') {
                return {
                  ...item,
                  checked: Boolean(data?.other),
                  customValue: data?.other || '',
                  socialLink: data?.otherLink || ''
                };
              } else {
                return {
                  ...item,
                  checked: Boolean(data?.[item.id]),
                  socialLink: data?.[`${item.id}Link`] || ''
                };
              }
            })
          );

          setTotalEarning(data?.earning);
          setMemo(data?.memo);
          setAffiliateUrl(data?.affiliate);
          setIsPaidPromotion(data?.paidPromotion);
          setBrandOwnerUrl(data?.paidPromotionLink);
          setBrandPromotion(data?.paidPromotionInfo);

          const extractTagName = data?.tag?.map((obj: any) => obj.tag);
          setSelectedFilters(extractTagName || []);

          setSelections({
            ageGroup: data?.ageGroup || "Dropdown",
            gender: data?.gender || "Dropdown",
            incomeLevel: data?.income || "Dropdown",
          });

          setTermsAccepted(data?.termCondition);
        }
      }
      catch (err) {
        console.error("Error fetching prefilled data:", err);
      }
    }
    getIdsPrefilledDetails();
  }, [currentId])


  useEffect(() => {
    const getListHomeIds = async () => {
      const res = await subscriptionService.homeIdsList();
      setTableData(res?.data?.homIds)
    }
    getListHomeIds();
  }, [loading])

  const availableCategories = [
    'Shopping', 'Consulting', 'Professional Services', 'Information',
    'Entertainment', 'Social Networking', 'Music', 'Education',
    'Medical Care', 'Kids', 'Adult', 'Game Business', 'Hobbies',
    'News', 'Banking', 'Legal', 'Business Services', 'Home Services',
    'Local Services', 'Religion', 'Politics', 'Government',
    'Professional Services', 'Real Estate', 'Online Casino(Gamble)', 'Lotto'
  ];


  const removeFilter = (tagName: string) => {
    setSelectedFilters(prev => (prev || []).filter(tag => tag !== tagName));
  };

  const addFilter = (category: string) => {
    setSelectedFilters(prev => [...(prev || []), category]);
    setShowAddTags(false);
  };

  const toggleAccordion = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const toggleGlobal = (index: number) => {
    setGlobalExpandedRow(globalExpandedRow === index ? null : index)
  }

  const getUiStatus = (status: "pending" | "approved" | "rejected" | "auto_approved", rowId?: string): "Active" | "Inactive" => {
    // Check if there's a local override for this row
    const localStatus = rowId ? localStatusStates[rowId] : undefined;
    const actualStatus = localStatus || status;

    if (actualStatus === "approved" || actualStatus === "auto_approved") {
      return "Active";
    }
    return "Inactive";
  };

  const getStatusColor = (status: "Active" | "Inactive"): string => {
    return status === "Active" ? "text-green-600" : "text-red-600";
  };

  const getStatusToggleColor = (status: "Active" | "Inactive"): string => {
    return status === "Active" ? "bg-green-500" : "bg-red-500";
  };

  const filteredData = tableData?.filter(
    (item) =>
      item?.numericId?.includes(searchTerm)
  );

  const cleanUrl = (url: string) => {
    try {
      const parsed = new URL(url); // fallback for relative

      if (parsed.hostname.includes("amazon.")) {
        const match = url.match(/(https:\/\/www\.amazon\.[^/]+\/[^/]+\/dp\/[A-Z0-9]+)/);
        return match ? match[1] : parsed.origin + parsed.pathname;
      }

      if (parsed.hostname.includes("flipkart.com")) {
        return parsed.origin + parsed.pathname;
      }

      return parsed.origin + parsed.pathname;
    } catch (err) {
      return url;
    }
  };

  const handleChange = (e: any) => {
    const inputVal = e.target.value.trim();
    setWebsiteUrl(cleanUrl(inputVal));
  };

  const handleExtractDataFromUrl = async () => {
    setIsReadUrl(true);
    try {
      const obj = {
        "url": websiteUrl
      }
      const res = await subscriptionService.extractDataBasedOnIUrl(obj);
      if (res?.success) {
        setWebsiteInfo(res?.data?.productDescription);
        setProductName(res?.data?.productName);
        setImageUrl(res?.data?.productImage);
        setEditWebsiteInfo("");
        toast.success(res?.message);
        setIsReadUrl(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleEdit = () => {
    // Initialize edit state with current displayed value
    setEditWebsiteInfo(websiteInfo);
    setIsEditMode(true);
  };

  const handleCancel = () => {
    // Reset edit state and exit edit mode
    setEditWebsiteInfo("");
    setIsEditMode(false);
    setIsEditMode(false);
  };

  const handleInfoSave = async () => {
    setIsEditedSave(true)
    const obj = {
      "message": websiteInfo + " " + editWebsiteInfo
    }
    const res = await subscriptionService.postChat(obj);
    if (res?.success) {
      setAIWebsiteInfo(res?.data?.response);
      setIsEditedSave(false);
      toast.success(res?.message);
    }

    if (isContentEdited()) {
      setWebsiteInfo(editWebsiteInfo);
    }
    setIsEditMode(false);
  };

  const isContentEdited = () => {
    return editWebsiteInfo !== "" && editWebsiteInfo !== websiteInfo;
  };

  const handleSave = async () => {
    setLoading(true);
    const toastId = toast.loading("Saving details...");
    try {
      const socialMediaSelection = socialMediaData.reduce((acc, item) => {
        if (item.id === "other") {
          // For 'other', store the custom value and link
          acc[item.id] = item.checked ? (item.customValue || "") : "";
          acc[`${item.id}Link`] = item.checked ? (item.socialLink || "") : "";
        } else {
          // For regular social media platforms
          acc[item.id] = item.checked;
          acc[`${item.id}Link`] = item.checked ? (item.socialLink || "") : "";
        }
        return acc;
      }, {} as Record<string, string | boolean>);

      const selectedCodes = selected.map((country) => CountryCode[country]);

      const obj = {
        "homIdId": currentId,
        "websiteUrl": websiteUrl,
        "websiteInfo": websiteInfo,
        "editInfo": editWebsiteInfo,
        "aiInfo": aiWebSiteInfo,
        "adultGambling": isAdultWebsite,
        "promotion": isPromotingOwnServices,
        "ownerOrAdministrator": isOwnerOrAdmin,
        "targetRegion1": "US",
        "targetRegion2": value2,
        "targetRegion3": value3,
        "startDate": startDate,
        "endDate": stopDate,
        ...socialMediaSelection,
        "earning": totalEarning,
        "memo": memo,
        "affiliate": affiliateUrl,
        "paidPromotion": isPaidPromotion,
        "paidPromotionLink": brandOwnerUrl,
        "paidPromotionInfo": brandPromotion,
        "tag": selectedFilters,
        "ageGroup": selections.ageGroup,
        "gender": selections.gender,
        "income": selections.incomeLevel,
        "termCondition": termsAccepted,
        "blockedCountry": selectedCodes,
        "productName": productName,
        "imageUrl": imageUrl

      }
      const res = await subscriptionService.homeIdsDetailsPost(obj);
      toast.dismiss(toastId);
      if (res?.success) {
        setLoading(false);
        toast.success(res?.message, {
          position: "top-right",
        })
      } else {
        setLoading(false);
        toast.error(res?.message, {
          position: "top-right"
        });
      }
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      toast.dismiss(toastId);
      toast.error(err?.response?.data?.message || "Something went wrong!", {
        position: "top-right"
      });
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: "pending" | "approved" | "rejected" | "auto_approved") => {
    try {
      // Determine new status based on current UI state
      const currentUiStatus = getUiStatus(currentStatus);
      const newStatus = currentUiStatus === "Active" ? "pending" : "approved";

      // Optimistically update local state for immediate UI feedback
      setLocalStatusStates(prev => ({
        ...prev,
        [id]: newStatus
      }));

      const res = await subscriptionService.updateStatus(id);

      // Update the main table data to reflect the change
      setTableData(prevData =>
        prevData.map(row =>
          row.id === id ? { ...row, status: newStatus } : row
        )
      );

    } catch (error) {
      console.error("Error toggling status:", error);

      // Revert local state on error
      setLocalStatusStates(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  return (
    <div className="mt-[52px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[24px] font-semibold text-[ #111827FF]">My .IDs</h1>

        {/* Search Bar */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search ID, Products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:rig-[#636AE8FF] focus:border-[#636AE8FF] w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[.7fr_1.5fr_1.5fr_1fr_1fr_.7fr_.6fr] gap-4 p-4 bg-white border-b font-semibold text-[#374151FF] text-[16px]">
          <div className="flex items-center gap-2">
            ID <ChevronDown className="w-4 h-4" />
          </div>
          <div>Target URL</div>
          <div>Product Name</div>
          <div className="flex items-center gap-2">
            Total Redirects <ChevronDown className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            Status <ChevronDown className="w-4 h-4" />
          </div>
          <div>Manage</div>
          <div>Global</div>
        </div>

        {/* Table Body */}
        {filteredData.map((row, index) => (
          <React.Fragment key={row.id}>
            {/* Main Row */}
            <div className="leading-tight grid grid-cols-[.7fr_1.5fr_1.5fr_1fr_1fr_.7fr_.6fr] gap-x-4 p-4 border-b hover:bg-gray-50 items-center">
              {/* ID */}
              <div className="text-[16px] font-medium text-[#2563EBFF]">{row?.numericId?.slice(0, 4)}-{row?.numericId?.slice(4)}</div>
              {/* Target URL */}
              <div className="flex items-center gap-2">
                <span
                  className="text-[16px] font-normal text-[#242524FF]"
                  title={row.websiteUrl || ''} // Shows full URL on hover
                >
                  {row.websiteUrl
                    ? (row.websiteUrl.length > 20
                      ? `${row.websiteUrl.substring(0, 20)}...`
                      : row.websiteUrl
                    )
                    : '-'
                  }
                </span>

                {row.websiteUrl && (
                  <a
                    href={row.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-500 transition-colors cursor-pointer"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                  </a>
                )}
              </div>

              {/* Product Name */}
              <div
                className="text-[16px] font-normal text-[#242524FF]"
                title={row.productName || ''} // Shows full product name on hover
              >
                {row.productName
                  ? (row.productName.length > 20
                    ? `${row.productName.substring(0, 20)}...`
                    : row.productName
                  )
                  : '-'
                }
              </div>
              {/* Total Redirects */}
              <div className="text-[16px] font-normal text-[#242524FF]">{row?.redirectCreditsUsed}</div>

              {/* Status - Interactive Switch */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(row.id, row.status)}
                  className={`w-12 h-6 ${getStatusToggleColor(
                    getUiStatus(row.status, row.id)
                  )} rounded-full relative transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:shadow-md`}
                  role="switch"
                  aria-checked={getUiStatus(row.status, row.id) === "Active"}
                  aria-label={`Toggle status to ${getUiStatus(row.status, row.id) === "Active" ? "Inactive" : "Active"}`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 transition-transform duration-200 ease-in-out ${getUiStatus(row.status, row.id) === "Active"
                      ? "transform translate-x-6"
                      : "transform translate-x-0.5"
                      }`}
                  ></div>
                </button>
                <span
                  className={`text-sm font-medium ${getStatusColor(
                    getUiStatus(row.status, row.id)
                  )}`}
                >
                  {getUiStatus(row.status, row.id)}
                </span>
              </div>

              {/* Manage Button */}
              <div>
                <button
                  onClick={() => { toggleAccordion(index); setCurrentId(row?.numericId) }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                >
                  Manage
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform ${expandedRow === index ? "rotate-180" : ""
                      }`}
                  />
                </button>
              </div>

              <div onClick={() => toggleGlobal(index)} className="cursor-pointer">
                <img src={gobalIcon} className="w-6 h-6" />
              </div>
              {
                row?.status == "pending" && <div className="col-span-7">
                  <p className="text-sm text-red-500 font-medium leading-tight">
                    This Id is in moderation
                  </p>
                </div>
              }
            </div>

            {/* Accordion Content */}
            {expandedRow === index && (
              <div className="border-b bg-[#DEE1E600] p-6">
                <div className="grid grid-cols-2 gap-20">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="flex w-full items-center justify-between">
                      <p className="text-[16px] font-normal text-[#374151FF] mr-4">
                        Website URL:
                      </p>

                      <div className="flex items-center gap-3 w-full max-w-[450px]">
                        <input
                          type="text"
                          placeholder="Add Website and click 'Read URL' →"
                          value={websiteUrl}
                          onChange={handleChange}
                          className="text-[14px] flex-1 border border-[#D1D5DBFF] rounded-[6px] p-2 outline-none"
                        />

                        <button
                          disabled={!websiteUrl?.trim()}
                          onClick={handleExtractDataFromUrl}
                          className={`flex items-center text-[14px] gap-x-2 font-medium whitespace-nowrap border rounded-[6px] px-4 py-2
      ${websiteUrl?.trim()
                              ? "text-[#3B82F6FF] border-[#3B82F6FF] cursor-pointer"
                              : "text-gray-400 border-gray-300 cursor-not-allowed bg-gray-100"
                            }`}
                        >
                          {isReadUrl ?
                            <div className="w-5 h-5 border-2 border-[#3B82F6FF] border-t-transparent rounded-full animate-spin"></div>
                            : <>
                              Read URL
                              <ExternalLink className="w-4 h-4" />
                            </>}

                        </button>
                      </div>
                    </div>

                    <div className="">
                      {/* Main row with label and textarea */}
                      <div className="flex w-full items-start justify-between gap-4">
                        <p className="text-[16px] font-normal text-[#374151] flex-shrink-0">
                          Website Info:
                        </p>

                        <div className="flex-1 max-w-[450px]">
                          <textarea
                            rows={2}
                            placeholder="Fill-in website information"
                            value={isEditMode ? editWebsiteInfo : websiteInfo}
                            onChange={(e) => setEditWebsiteInfo(e.target.value)}
                            disabled={!isEditMode}
                            className={`w-full text-[14px] border rounded-[6px] p-2 outline-none resize-none ${isEditMode
                              ? 'border-[#D1D5DB] bg-white'
                              : 'border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280] cursor-not-allowed'
                              }`}
                          />
                        </div>
                      </div>

                      {/* Error message row with same alignment */}
                      <div className="flex w-full items-start justify-between gap-4">
                        <div className="flex-shrink-0" style={{ width: 'fit-content' }}>
                          {/* Empty space to match label width */}
                        </div>

                        <div className="flex-1 mb-2 max-w-[450px] flex items-center justify-between">
                          <p className="text-[16px] leading-tight font-normal text-[#DE3B40] flex-1 mr-1">
                            Please ensure your provided information is accurate, relevant to the website's information.
                          </p>

                          <div className="flex gap-x-2 flex-shrink-0">
                            {isEditMode ? (
                              <>
                                <button
                                  onClick={handleCancel}
                                  className="text-[14px] font-medium text-[#6B7280] border border-[#D1D5DB] px-3 py-1 rounded-[6px] hover:bg-[#F3F4F6] transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handleInfoSave}
                                  className="text-[14px] font-medium text-white bg-[#3B82F6] border border-[#3B82F6] px-3 py-1 rounded-[6px] hover:bg-[#2563EB] transition-colors"
                                >
                                  {isEditedSave ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Save"}
                                </button>
                              </>
                            ) : (
                              <div className="flex gap-x-2">
                                <button
                                  onClick={handleEdit}
                                  className="text-[14px] font-medium text-[#3B82F6] border border-[#3B82F6] px-3 py-1 rounded-[6px] hover:bg-[#3B82F6] hover:text-white transition-colors"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={handleInfoSave}
                                  className="text-[14px] font-medium text-white bg-[#3B82F6] border border-[#3B82F6] px-3 py-1 rounded-[6px] hover:bg-[#2563EB] transition-colors"
                                >
                                  {isEditedSave ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Save"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between leading-tight">
                      <p className="text-[16px] text-[#374151FF] font-normal">Is this an adult or gambling website?</p>
                      <div className="space-x-4">
                        <label className="inline-flex items-center space-x-1">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={isAdultWebsite === true}
                            onChange={() => setIsAdultWebsite(true)}
                          />
                          <span className="text-[16px] text-[#374151FF] font-normal">Yes</span>
                        </label>
                        <label className="inline-flex items-center space-x-1">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={isAdultWebsite === false}
                            onChange={() => setIsAdultWebsite(false)}
                          />
                          <span className="text-[16px] text-[#374151FF] font-normal">No</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between leading-tight">
                      <p className="text-[16px] text-[#374151FF] font-normal">
                        Is the website promoting your own Services, Products or Contents?
                      </p>
                      <div className="space-x-4 text-nowrap">
                        <label className="inline-flex items-center space-x-1">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={isPromotingOwnServices === true}
                            onChange={() => setIsPromotingOwnServices(true)}
                          />
                          <span className="text-[16px] text-[#374151FF] font-normal">Yes</span>
                        </label>
                        <label className="inline-flex items-center space-x-1">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={isPromotingOwnServices === false}
                            onChange={() => setIsPromotingOwnServices(false)}
                          />
                          <span className="text-[16px] text-[#374151FF] font-normal">No</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between leading-tight">
                      <p className="text-[16px] text-[#374151FF] font-normal">Are you the owner or an administrator?</p>
                      <div className="space-x-4">
                        <label className="inline-flex items-center space-x-1">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={isOwnerOrAdmin === true}
                            onChange={() => setIsOwnerOrAdmin(true)}
                          />
                          <span className="text-[16px] text-[#374151FF] font-normal">Yes</span>
                        </label>
                        <label className="inline-flex items-center space-x-1">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={isOwnerOrAdmin === false}
                            onChange={() => setIsOwnerOrAdmin(false)}
                          />
                          <span className="text-[16px] text-[#374151FF] font-normal">No</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <p className="text-[16px] font-normal text-[#374151FF] mb-2">
                        Targeted Regions (City, State/Province, Country)
                      </p>

                      <div className="flex items-center space-x-4 w-full">
                        {/* Row #1 */}
                        <label className="flex items-center space-x-2 w-full">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-[16px] text-[ #374151FF]">#1:</span>
                          <div className="relative flex-1">
                            <input
                              type="text"
                              placeholder="Search"
                              className="w-full text-sm px-2 py-1 pr-8 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </label>

                        {/* Row #2 */}
                        <CountrySelectorRow
                          label="#2:"
                          value={value2}
                          selectedCountry={selectedCountry2}
                          isOpen={isOpen2}
                          onValueChange={setValue2}
                          onSelectedCountryChange={setSelectedCountry2}
                          onOpenChange={setIsOpen2}
                        />

                        {/* Row #3 */}
                        <CountrySelectorRow
                          label="#3:"
                          value={value3}
                          selectedCountry={selectedCountry3}
                          isOpen={isOpen3}
                          onValueChange={setValue3}
                          onSelectedCountryChange={setSelectedCountry3}
                          onOpenChange={setIsOpen3}
                        />
                      </div>
                    </div>

                    <CountryMultiSelector
                      selected={selected}
                      onSelectionChange={setSelected}
                      maxSelections={20}
                    />

                    <div className="flex items-center gap-3">
                      <label className="w-28 text-[16px] text-[#374151FF] font-normal">Start Date</label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date: Date | null) => setStartDate(date)}
                        dateFormat="dd/MMM/yyyy"
                        className="border rounded-md px-2 py-1 text-gray-700 w-[140px]"
                      />
                      <button className="border px-3 py-1 rounded-md text-[14px] text-[#374151FF] font-normal hover:bg-gray-100">
                        Set Reminder
                      </button>
                    </div>

                    {/* Stop Date */}
                    <div className="flex items-center gap-3">
                      <label className="w-28 text-[16px] text-[#374151FF] font-normal">Stop Date</label>
                      <DatePicker
                        selected={stopDate}
                        onChange={(date: Date | null) => setStopDate(date)}
                        dateFormat="dd/MMM/yyyy"
                        className="border rounded-md px-2 py-1 text-gray-700 w-[140px]"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="w-[116px] text-[16px] text-[#374151FF] font-normal">
                        Posted Social Medias
                      </label>
                      <SocialMediaSelector
                        value={socialMediaData}
                        onChange={setSocialMediaData}
                      />
                    </div>

                    {/* Total Earnings */}
                    <div className="flex items-center gap-3">
                      <label className="w-28 text-[16px] text-[#374151FF] font-normal">Total Earnings</label>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">$</span>
                        <input
                          type="number"
                          defaultValue={0.0}
                          value={totalEarning}
                          onChange={(e) => setTotalEarning(Number(e.target.value))}
                          className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm outline-none"
                        />
                      </div>
                    </div>

                    {/* Left: Label + Textarea */}
                    <div className="flex items-start gap-2">
                      <Pencil className="w-5 h-5 text-[#374151FF] mt-1" />
                      <label className="w-[90px] text-[16px] text-[#374151FF] font-normal mt-1">Memo here</label>
                      <textarea
                        placeholder="Write your memo..."
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        className="flex-1 min-h-[80px] resize-y rounded-md border border-gray-300 p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 px-10">
                    <div className="flex items-center justify-between leading-tight max-w-[350px]">
                      <p className="text-[16px] text-[#374151FF] font-normal">Affiliate URL?</p>
                      <div className="space-x-4">
                        <label className="inline-flex items-center space-x-1">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={affiliateUrl === true}
                            onChange={() => setAffiliateUrl(true)}
                          />
                          <span className="text-[16px] text-[#374151FF] font-normal">Yes</span>
                        </label>
                        <label className="inline-flex items-center space-x-1">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={affiliateUrl === false}
                            onChange={() => setAffiliateUrl(false)}
                          />
                          <span className="text-[16px] text-[#374151FF] font-normal">No</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between leading-tight max-w-[350px]">
                      <p className="text-[16px] text-[#374151FF] font-normal">Paid Promotion</p>
                      <div className="space-x-4">
                        <label className="inline-flex items-center space-x-1">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={isPaidPromotion === true}
                            onChange={() => setIsPaidPromotion(true)}
                          />
                          <span className="text-[16px] text-[#374151FF] font-normal">Yes</span>
                        </label>
                        <label className="inline-flex items-center space-x-1">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={isPaidPromotion === false}
                            onChange={() => setIsPaidPromotion(false)}
                          />
                          <span className="text-[16px] text-[#374151FF] font-normal">No</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <p className="text-[16px] text-[#374151FF] font-normal">Advertiser/Brand Owner Info(If Paid Promotion):</p>
                      <input
                        type="text"
                        placeholder="Website URL:"
                        value={brandOwnerUrl}
                        onChange={(e) => setBrandOwnerUrl(e.target.value)}
                        className="mt-2 text-[14px] flex-1 border border-[#D1D5DBFF] rounded-[6px] p-2 outline-none w-full"
                      />
                      <textarea
                        rows={3}
                        placeholder="Promotion Type: Information about your relationship with the ReDirected To URL Website."
                        value={brandPromotion}
                        onChange={(e) => setBrandPromotion(e.target.value)}
                        className="mt-2 text-[14px] flex-1 border border-[#D1D5DBFF] rounded-[6px] p-2 outline-none w-full"
                      />
                    </div>

                    <div className="">
                      <h3 className="text-[16px] font-normal text-[#374151FF]">
                        What does this website offer?
                      </h3>
                      {/* Filter Tags Section */}
                      <div className="p-4 w-full bg-white border border-gray-200 rounded-[6px] mt-[10px]">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {selectedFilters?.map((tag, index) => (
                            <div
                              key={index}
                              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              <span>{tag}</span>
                              <button
                                onClick={() => removeFilter(tag)}
                                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                aria-label={`Remove ${tag} filter`}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}

                          {/* Add Tags Button */}
                          <button
                            onClick={() => setShowAddTags(!showAddTags)}
                            className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                          >
                            <Plus size={14} />
                            <span>Add Tags</span>
                          </button>
                        </div>

                        {/* Add Tags Dropdown */}
                        {showAddTags && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                              {availableCategories.map((category, index) => (
                                <button
                                  key={index}
                                  onClick={() => addFilter(category)}
                                  className="text-left text-sm text-gray-700 hover:bg-white hover:shadow-sm px-2 py-1 rounded transition-colors"
                                  disabled={selectedFilters?.includes(category)}
                                >
                                  {category}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Category Selection Text */}
                        <div className="text-sm text-gray-600 leading-relaxed">
                          <span className="font-medium text-gray-700">Select All Applies</span> - Shopping, Consulting, Professional Services, Information, Entertainment, Social Networking, Music, Education, Medical Care, Kids, Adult, Game Business, Hobbies, News, Banking, Legal, Business Services, Home Services, Local Services, Religion, Politics, Government, Professional Services, Real Estate, Online Casino(Gamble), Lotto.
                        </div>
                      </div>
                    </div>

                    <TargetedAudience selections={selections} setSelections={setSelections} />
                  </div>
                </div>

                <div className="flex justify-end px-6 gap-x-4">
                  <div className="flex items-center gap-x-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <p className="text-[14px] font-normal text-[#374151FF]">I agree to Terms & Conditions</p>
                  </div>
                  <button className={`rounded-[6px] bg-[#2563EBFF] text-white font-semibold px-6 py-2 ${!termsAccepted || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                    onClick={handleSave}
                    disabled={!termsAccepted || loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </div>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Global Id Content*/}
            {globalExpandedRow === index && (
              <Global />
            )}
          </React.Fragment>
        ))}
      </div>
    </div >
  );
};