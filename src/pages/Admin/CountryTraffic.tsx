import { useEffect, useState } from "react";
import { AdminHeader } from "./AdminHeader";
import { subscriptionService } from "../../services/Subscriptions";
import ReactCountryFlag from "react-country-flag";

interface CountryTrafficData {
  countryCode: string;
  count: number;
  percentage: number;
  rank: number;
}

export const CountryTraffic: React.FC = () => {
  const [highestTrafficCountriesData, setHighestTrafficCountriesData] = useState<CountryTrafficData[]>([]);

  useEffect(() => {
    const countryTrafficData = async () => {
      try {
        const res = await subscriptionService.getCountryTrafficData();
        setHighestTrafficCountriesData(res?.data?.highestTrafficCountries || []);
      } catch (error) {
        console.error("Error fetching country traffic data:", error);
      }
    };
    countryTrafficData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="px-4 sm:px-6 lg:px-10 py-8">
        <h1 className="text-3xl sm:text-4xl text-center mb-8 text-blue-600 font-bold">
          Country Traffic
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {highestTrafficCountriesData.length > 0 ? (
            highestTrafficCountriesData.map((country) => (
              <div
                key={country.countryCode}
                className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300"
              >
                <ReactCountryFlag
                  countryCode={country.countryCode}
                  svg
                  style={{ width: "2.5rem", height: "2.5rem" }}
                  title={country.countryCode}
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {country.countryCode} (Rank {country.rank})
                  </h2>
                  <p className="text-gray-600">Traffic: {country.percentage}%</p>
                  <p className="text-gray-600">Count: {country.count}</p>
                </div>
                <div className="h-8 w-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                  #{country.rank}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};