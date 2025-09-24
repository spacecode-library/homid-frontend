import { ChevronDown, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { AdminHeader } from "./AdminHeader"
import { useEffect, useState } from "react"
import { subscriptionService } from "../../services/Subscriptions";

interface AnalyticsData {
  id: string;
  numericId: string;
  formattedId: string;
  redirectCreditsUsed: number;
  websiteUrl: string;
  websiteInfo: string;
  productName: string;
  countryBreakdown: Array<{
    countryCode: string;
    count: number;
    percentage: number;
  }>;
  totalRedirects: number;
  rank: number;
  status: string;
  expiryDate: string | null;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const Traffic: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });

  const fetchAnalyticsData = async (page: number) => {
    setLoading(true);
    try {
      const res = await subscriptionService.getAnalyticsRankingIDs(page, 50);
      if (res.success) {
        setAnalyticsData(res?.data?.analyticsData || []);
        setPagination(res?.data?.pagination || {
          page: 1,
          limit: 50,
          total: 0,
          totalPages: 0
        });
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData(pagination.page);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      fetchAnalyticsData(newPage);
    }
  };

  const toggleAccordion = (index: any) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const filteredData = analyticsData.filter(
    (item) =>
      item.numericId.includes(searchTerm) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    const { page, totalPages } = pagination;

    // Calculate start and end pages
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust startPage if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page and ellipsis
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-2 text-gray-500">...</span>
        );
      }
    }

    // Page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm rounded-md ${page === i
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
          {i}
        </button>
      );
    }

    // Last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="px-2 text-gray-500">...</span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <>
      <AdminHeader />
      <div className="px-10">
        <p className="text-[34px] text-center mb-5 text-[#1F54B0FF] font-semibold">Traffic</p>

        {/* Search only */}
        <div className="flex justify-end items-center mb-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search ID, Products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#636AE8FF] focus:border-[#636AE8FF] w-full"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1.5fr_1.5fr_1fr_1fr] gap-4 p-4 bg-white border-b font-semibold text-[#374151FF] text-[16px]">
            <div className="flex items-center gap-2">
              ID <ChevronDown className="w-4 h-4" />
            </div>
            <div>Target URL</div>
            <div>Product Name</div>
            <div className="flex items-center gap-2">
              Total Redirects <ChevronDown className="w-4 h-4" />
            </div>
            <div>View</div>
          </div>

          {/* Table Body */}
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-[#6B7280FF]">Loading analytics data...</p>
            </div>
          ) : filteredData.length > 0 ? (
            filteredData.map((row, index) => (
              <div key={row.id}>
                {/* Main Row */}
                <div className="leading-tight grid grid-cols-[1fr_1.5fr_1.5fr_1fr_1fr] gap-4 p-4 border-b hover:bg-gray-50 items-center">
                  {/* ID */}
                  <div className="text-[16px] font-medium text-[#2563EBFF]">
                    {row.formattedId}
                  </div>

                  {/* Target URL */}
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[16px] font-normal text-[#242524FF]"
                      title={row.websiteUrl}
                    >
                      {row.websiteUrl?.length > 30
                        ? `${row.websiteUrl.substring(0, 30)}...`
                        : row.websiteUrl
                      }
                    </span>
                  </div>

                  {/* Product Name */}
                  <div
                    className="text-[16px] font-normal text-[#242524FF]"
                    title={row.productName}
                  >
                    {row.productName?.length > 25
                      ? `${row.productName.substring(0, 25)}...`
                      : row.productName
                    }
                  </div>

                  {/* Total Redirects */}
                  <div className="text-[16px] font-normal text-[#242524FF]">
                    {row.redirectCreditsUsed.toLocaleString()}
                  </div>

                  {/* Manage Button */}
                  <div>
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                    >
                      View
                      <ChevronDown
                        className={`w-4 h-4 transform transition-transform ${expandedRow === index ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Accordion Content */}
                {expandedRow === index && (
                  <div className="border-b bg-[#F9FAFB] p-6">
                    <div className="grid grid-cols-2 gap-8">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-[16px] font-semibold text-[#374151FF] mb-2">
                            Product Details
                          </h3>
                          <p className="text-[14px] text-[#6B7280FF]">
                            <strong>Full URL:</strong> {row.websiteUrl}
                          </p>
                          <p className="text-[14px] text-[#6B7280FF]">
                            <strong>Product:</strong> {row.productName}
                          </p>
                          <p className="text-[14px] text-[#6B7280FF]">
                            <strong>ID:</strong> {row.numericId}
                          </p>
                          <p className="text-[14px] text-[#6B7280FF]">
                            <strong>Website Info:</strong> {row.websiteInfo?.length > 100
                              ? `${row.websiteInfo.substring(0, 100)}...`
                              : row.websiteInfo}
                          </p>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-[16px] font-semibold text-[#374151FF] mb-2">
                            Statistics
                          </h3>
                          <p className="text-[14px] text-[#6B7280FF]">
                            <strong>Total Redirects:</strong> {row.redirectCreditsUsed.toLocaleString()}
                          </p>
                          {/* <p className="text-[14px] text-[#6B7280FF]">
                            <strong>Total Redirects:</strong> {row.totalRedirects.toLocaleString()}
                          </p> */}
                          <p className="text-[14px] text-[#6B7280FF]">
                            <strong>Rank:</strong> #{row.rank}
                          </p>
                          {/* <p className="text-[14px] text-[#6B7280FF]">
                            <strong>Status:</strong> {row.status}
                          </p> */}

                          {/* Country Breakdown */}
                          {row.countryBreakdown.length > 0 && (
                            <div className="mt-4">
                              <p className="text-[14px] font-semibold text-[#374151FF] mb-2">Country Breakdown:</p>
                              {row.countryBreakdown.map((country, idx) => (
                                <p key={idx} className="text-[12px] text-[#6B7280FF]">
                                  {country.countryCode}: {country.count} ({country.percentage}%)
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-[8px] shadow-sm border border-[#E5E7EBFF] p-4">
              <p className="text-center text-[#6B7280FF]">No IDs found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
            </div>

            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md ${pagination.page === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {renderPaginationButtons()}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md ${pagination.page === pagination.totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}