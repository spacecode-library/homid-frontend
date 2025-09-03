import React, { useEffect, useState } from "react";
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
import flag1Icon from "../../assets/flag1.png";
import flag2Icon from "../../assets/flag2.png";
import flag3Icon from "../../assets/flag3.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TargetedAudience } from "./TargetedAudience";
import { Global } from "./Global";
import { subscriptionService } from "../../services/Subscriptions";

// Types
interface AccordionData {
  redirectUrl: string;
  artImage: string;
  websiteTitle: string;
  websiteDescription: string;
  brandOwner: string;
  websiteInfo: string;
  websiteOffer: string;
  categories: string[];
  demographics: string;
}

interface TableRow {
  id: string;
  targetUrl: string;
  productName: string;
  totalRedirects: string;
  status: "Active" | "Inactive";
  numericId: string;
  redirectCreditsUsed: number;
  accordionData: AccordionData;
}

export const MyIDsTable: React.FC = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [globalExpandedRow, setGlobalExpandedRow] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [selected, setSelected] = useState([
    "North Korea",
    "Nigeria",
    "Kenya",
  ]);
  const [startDate, setStartDate] = useState<Date | null>(new Date("2025-01-01"));
  const [stopDate, setStopDate] = useState<Date | null>(new Date("2026-12-31"));
  const [selectedFilters, setSelectedFilters] = useState([
    { id: 1, label: 'Womens Clothing', type: 'category' },
    { id: 2, label: 'Ages 20-30', type: 'age' }
  ]);

  const [showAddTags, setShowAddTags] = useState(false);


  useEffect(() => {
    const getListHomeIds = async () => {
      const res = await subscriptionService.homeIdsList();
      console.log("allIds", res?.data?.homIds);
      setTableData(res?.data?.homIds)
    }
    getListHomeIds();
  }, [])

  const memos = [
    { id: 1, text: "Created Memo #1", date: "01/JAN/2026" },
    { id: 2, text: "Created Memo #2", date: "01/JAN/2026" },
    { id: 3, text: "Created Memo #3", date: "01/JAN/2026" },
  ];

  const availableCategories = [
    'Shopping', 'Consulting', 'Professional Services', 'Information',
    'Entertainment', 'Social Networking', 'Music', 'Education',
    'Medical Care', 'Kids', 'Adult', 'Game Business', 'Hobbies',
    'News', 'Banking', 'Legal', 'Business Services', 'Home Services',
    'Local Services', 'Religion', 'Politics', 'Government',
    'Professional Services', 'Real Estate', 'Online Casino(Gamble)', 'Lotto'
  ];


  const removeFilter = (filterId: any) => {
    setSelectedFilters(prev => prev.filter(filter => filter.id !== filterId));
  };

  const addFilter = (category: any) => {
    const newFilter = {
      id: Date.now(),
      label: category,
      type: 'category'
    };
    setSelectedFilters(prev => [...prev, newFilter]);
    setShowAddTags(false);
  };

  const removeTag = (tag: any) => {
    setSelected(selected.filter((item) => item !== tag));
  };

  const toggleAccordion = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const toggleGlobal = (index: number) => {
    setGlobalExpandedRow(globalExpandedRow === index ? null : index)
  }

  const handleStatusToggle = (index: number) => {
    setTableData(prevData =>
      prevData.map((row, i) =>
        i === index
          ? { ...row, status: row.status === "Active" ? "Inactive" : "Active" }
          : row
      )
    );
  };

  const getStatusColor = (status: "Active" | "Inactive"): string => {
    return status === "Active" ? "text-green-600" : "text-red-600";
  };

  const getStatusToggleColor = (status: "Active" | "Inactive"): string => {
    return status === "Active" ? "bg-green-500" : "bg-red-500";
  };

  const filteredData = tableData.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.targetUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className="grid grid-cols-[.7fr_1.5fr_1.5fr_1fr_1fr_.7fr_.6fr] gap-4 p-4 border-b hover:bg-gray-50 items-center">
              {/* ID */}
              <div className="text-[16px] font-medium text-[#2563EBFF]">{row?.numericId?.slice(0, 4)}-{row?.numericId?.slice(4)}</div>
              {/* Target URL */}
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-normal text-[#242524FF]">-</span>
                {/* <ExternalLink className="w-4 h-4 text-gray-400" /> */}
              </div>

              {/* Product Name */}
              <div className="text-[16px] font-normal text-[#242524FF]">-</div>

              {/* Total Redirects */}
              <div className="text-[16px] font-normal text-[#242524FF]">{row?.redirectCreditsUsed}</div>

              {/* Status - Interactive Switch */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusToggle(index)}
                  className={`w-12 h-6 ${getStatusToggleColor(
                    row.status
                  )} rounded-full relative transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${row.status === "Active" ? "focus:ring-green-500" : "focus:ring-red-500"
                    }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 transition-transform duration-200 ease-in-out ${row.status === "Active" ? "transform translate-x-6" : "transform translate-x-0.5"
                      }`}
                  ></div>
                </button>
                <span className={`text-sm font-medium ${getStatusColor(row.status)}`}>
                  {row.status}
                </span>
              </div>

              {/* Manage Button */}
              <div>
                <button
                  onClick={() => toggleAccordion(index)}
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
                          className="text-[14px] flex-1 border border-[#D1D5DBFF] rounded-[6px] p-2 outline-none"
                        />

                        <button className="flex items-center text-[14px] gap-x-2 text-[#3B82F6FF] font-medium whitespace-nowrap border border-[#3B82F6FF] rounded-[6px] px-4 py-2">
                          Read URL
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-between">
                      <p className="text-[16px] font-normal text-[#374151FF] mr-4">
                        Website URL:
                      </p>

                      <div className="flex items-center gap-3 w-full max-w-[450px]">
                        <textarea
                          rows={2}
                          placeholder="Fill-in website information"
                          className="text-[14px] flex-1 border border-[#D1D5DBFF] rounded-[6px] p-2 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between leading-tight">
                      <p className="text-[16px] text-[#374151FF] font-normal">Is this an adult or gambling website?</p>
                      <div className="space-x-4">
                        <label className="inline-flex items-center space-x-1">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-[16px] text-[#374151FF] font-normal">Yes</span>
                        </label>
                        <label className="inline-flex items-center space-x-1">
                          <input type="checkbox" className="w-4 h-4" />
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
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-[16px] text-[#374151FF] font-normal">Yes</span>
                        </label>
                        <label className="inline-flex items-center space-x-1">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-[16px] text-[#374151FF] font-normal">No</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between leading-tight">
                      <p className="text-[16px] text-[#374151FF] font-normal">Are you the owner or an administrator?</p>
                      <div className="space-x-4">
                        <label className="inline-flex items-center space-x-1">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-[16px] text-[#374151FF] font-normal">Yes</span>
                        </label>
                        <label className="inline-flex items-center space-x-1">
                          <input type="checkbox" className="w-4 h-4" />
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
                        <label className="flex items-center space-x-2 w-full">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-[16px] text-[ #374151FF]">#2:</span>
                          <div className="relative flex-1">
                            <input
                              type="text"
                              placeholder="Search"
                              className="w-full text-sm px-2 py-1 pr-8 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </label>

                        {/* Row #3 */}
                        <label className="flex items-center space-x-2 w-full">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-[16px] text-[ #374151FF]">#3:</span>
                          <div className="relative flex-1">
                            <input
                              type="text"
                              placeholder="Search"
                              className="w-full text-sm px-2 py-1 pr-8 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="w-full">
                      <p className="text-[14px] font-normal text-[#374151] mb-2">
                        Block Visitors by Country (or City, State, Province)
                      </p>

                      {/* Top controls (search + dropdown) */}
                      <div className="flex items-center space-x-2 mb-2">
                        {/* Search box with icon */}
                        <div className="relative flex-1">
                          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Select Max 20"
                            className="w-full border border-gray-300 rounded-md text-sm pl-8 pr-2 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* Dropdown button */}
                        <button className="flex items-center border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50">
                          Dropdown
                          <ChevronDown className="w-4 h-4 ml-1" />
                        </button>
                      </div>

                      {/* Selected tags */}
                      <div className="flex flex-wrap gap-2 border border-gray-300 rounded-md p-2 min-h-[44px]">
                        {selected.map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center space-x-1 bg-blue-50 text-blue-700 text-sm px-2 py-1 rounded-md border border-blue-200"
                          >
                            <span>{tag}</span>
                            <button onClick={() => removeTag(tag)} className="focus:outline-none">
                              <X className="w-3 h-3 text-blue-500" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

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
                      <div className="flex flex-wrap items-center gap-4">
                        {/* YouTube */}
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <Youtube className="w-4 h-4 text-red-500" />
                        </label>

                        {/* Instagram */}
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <Instagram className="w-4 h-4 text-pink-500" />
                        </label>

                        {/* TikTok */}
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <Music2 className="w-4 h-4 text-black" />
                        </label>

                        {/* Facebook */}
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <Facebook className="w-4 h-4 text-blue-600" />
                        </label>

                        {/* LinkedIn */}
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <Linkedin className="w-4 h-4 text-blue-700" />
                        </label>

                        {/* Twitter / X */}
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <Twitter className="w-4 h-4 text-black" />
                        </label>

                        {/* Other + text input */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm text-gray-700">Other</span>
                          <input
                            type="text"
                            placeholder="Enter"
                            className="w-24 rounded-md border border-gray-300 p-1 text-sm outline-none"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Post Link */}
                    <div className="flex items-center gap-3">
                      <label className="w-28 text-[16px] font-normal text-[ #374151FF]">Post Link:</label>
                      <input
                        type="text"
                        placeholder="https://www.example.com/postid"
                        className="flex-1 rounded-md border border-gray-300 p-2 text-sm outline-none"
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
                          className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      {/* Left: Label + Textarea */}
                      <div className="flex items-start gap-2">
                        <Pencil className="w-5 h-5 text-[#374151FF] mt-1" />
                        <label className="w-[90px] text-[16px] text-[#374151FF] font-normal mt-1">Memo here</label>
                        <textarea
                          placeholder="Write your memo..."
                          className=" min-h-[80px] resize-y rounded-md border border-gray-300 p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Right: Created memos list */}
                      <div className="w-60 space-y-1">
                        {memos.map((memo) => (
                          <p key={memo.id} className="text-[14px] font-normal text-[ #4B5563FF]">
                            {memo.text} <span>{memo.date}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 px-10">
                    <div className="flex items-center justify-between leading-tight max-w-[350px]">
                      <p className="text-[16px] text-[#374151FF] font-normal">Affiliate URL?</p>
                      <div className="space-x-4">
                        <label className="inline-flex items-center space-x-1">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-[16px] text-[#374151FF] font-normal">Yes</span>
                        </label>
                        <label className="inline-flex items-center space-x-1">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-[16px] text-[#374151FF] font-normal">No</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between leading-tight max-w-[350px]">
                      <p className="text-[16px] text-[#374151FF] font-normal">Paid Promotion</p>
                      <div className="space-x-4">
                        <label className="inline-flex items-center space-x-1">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-[16px] text-[#374151FF] font-normal">Yes</span>
                        </label>
                        <label className="inline-flex items-center space-x-1">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-[16px] text-[#374151FF] font-normal">No</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <p className="text-[16px] font-normal text-[#374151FF]">What does the website offer or sell?</p>
                      <textarea
                        rows={3}
                        placeholder="Information about the website"
                        className="text-[14px] flex-1 border border-[#D1D5DBFF] rounded-[6px] p-2 outline-none w-full"
                      />
                    </div>

                    <div>
                      <p className="text-[16px] text-[#374151FF] font-normal">Advertiser/Brand Owner Info(If Paid Promotion):</p>
                      <input
                        type="text"
                        placeholder="Website URL:"
                        className="mt-2 text-[14px] flex-1 border border-[#D1D5DBFF] rounded-[6px] p-2 outline-none w-full"
                      />
                      <textarea
                        rows={3}
                        placeholder="Promotion Type: Information about your relationship with the ReDirected To URL Website."
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
                          {selectedFilters.map((filter) => (
                            <div
                              key={filter.id}
                              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              <span>{filter.label}</span>
                              <button
                                onClick={() => removeFilter(filter.id)}
                                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                aria-label={`Remove ${filter.label} filter`}
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
                                  disabled={selectedFilters.some(filter => filter.label === category)}
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

                    <TargetedAudience />
                  </div>
                </div>

                <div className="flex justify-end px-6 gap-x-4">
                  <div className="flex items-center gap-x-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                    />
                    <p className="text-[14px] font-normal text-[#374151FF]">I agree to Terms & Conditions</p>
                  </div>
                  <button className="rounded-[6px] bg-[#2563EBFF] text-white font-semibold px-6 py-2">Save</button>
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
    </div>
  );
};