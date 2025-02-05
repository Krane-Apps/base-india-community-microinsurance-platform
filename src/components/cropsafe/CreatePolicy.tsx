import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { formatCurrency } from "src/helper";
import dynamic from "next/dynamic";
import axios from "axios";
import Select from "react-select";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dailog";
import TransactionWrapper from "../TransactionWrapper";
import {
  translations,
  TranslationKey,
  getTranslation,
  LanguageCode,
} from "src/locales/translations";

type LanguageKey = keyof typeof translations;

const Map = dynamic(() => import("./Map"), { ssr: false });

interface PremiumQuote {
  policyId: string;
  riskFactor: number;
  calculatedPremium: string;
  majorUpcomingEvents: string;
}

const weatherOptions = [
  { value: "rainfall", label: "Rainfall Above", operator: "greaterThan" },
  { value: "temperature", label: "Temperature Below", operator: "lessThan" },
  { value: "heavyRainfall", label: "Heavy Rainfall", operator: "greaterThan" },
  { value: "flooding", label: "Flooding", operator: "greaterThan" },
  { value: "hailstorm", label: "Hailstorm", operator: "greaterThan" },
  { value: "snowfall", label: "Snowfall", operator: "greaterThan" },
  { value: "iceStorm", label: "Ice Storm", operator: "greaterThan" },
  { value: "sleet", label: "Sleet", operator: "greaterThan" },
  { value: "monsoonRain", label: "Monsoon Rain", operator: "greaterThan" },
  { value: "tornado", label: "Tornado", operator: "greaterThan" },
  { value: "cyclone", label: "Cyclone", operator: "greaterThan" },
  { value: "hurricane", label: "Hurricane", operator: "greaterThan" },
  { value: "typhoon", label: "Typhoon", operator: "greaterThan" },
  {
    value: "galeForceWinds",
    label: "Gale-Force Winds",
    operator: "greaterThan",
  },
  { value: "dustStorm", label: "Dust Storm", operator: "greaterThan" },
  {
    value: "heatwave",
    label: "Heatwave (Extreme High Temperature)",
    operator: "greaterThan",
  },
  {
    value: "coldWave",
    label: "Cold Wave (Extreme Low Temperature)",
    operator: "lessThan",
  },
  { value: "frost", label: "Frost", operator: "lessThan" },
  {
    value: "drought",
    label: "Drought (Prolonged dry conditions)",
    operator: "lessThan",
  },
  {
    value: "freezeEvent",
    label: "Freeze Event (Unseasonal frost)",
    operator: "lessThan",
  },
  { value: "thunderstorm", label: "Thunderstorm", operator: "greaterThan" },
  {
    value: "lightningStrike",
    label: "Lightning Strike",
    operator: "greaterThan",
  },
  { value: "windstorm", label: "Windstorm", operator: "greaterThan" },
  {
    value: "severeTropicalStorm",
    label: "Severe Tropical Storm",
    operator: "greaterThan",
  },
  { value: "sandstorm", label: "Sandstorm", operator: "greaterThan" },
  { value: "landslide", label: "Landslide", operator: "greaterThan" },
  { value: "mudslide", label: "Mudslide", operator: "greaterThan" },
  { value: "earthquake", label: "Earthquake", operator: "greaterThan" },
  { value: "wildfire", label: "Wildfire", operator: "greaterThan" },
  {
    value: "volcanicAshfall",
    label: "Volcanic Ashfall",
    operator: "greaterThan",
  },
  {
    value: "pestInfestation",
    label: "Pest Infestation",
    operator: "greaterThan",
  },
  { value: "soilErosion", label: "Soil Erosion", operator: "greaterThan" },
];

const dummyPremiumResponse = (policyId: string): PremiumQuote => ({
  policyId,
  riskFactor: 0.05, // 5% risk factor
  calculatedPremium: "0.001", // 0.001 ETH premium
  majorUpcomingEvents: "No major weather events forecasted",
});

const PAYMASTER_AND_BUNDLER_ENDPOINT =
  process.env.NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT;

function CreatePolicy({
  selectedCurrency,
  setCurrentView,
  showPremiumQuote,
  setShowPremiumQuote,
  basename,
  selectedLanguage,
}: any) {
  const [policyName, setPolicyName] = useState("");
  const [weatherCondition, setWeatherCondition] = useState<{
    value: string;
    label: string;
    operator: string;
  } | null>(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [threshold, setThreshold] = useState("");
  const [premiumQuote, setPremiumQuote] = useState<PremiumQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [useDummyResponse, setUseDummyResponse] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState<number>(0);
  const [endTimestamp, setEndTimestamp] = useState<number>(0);
  const [maxCoverage, setMaxCoverage] = useState("0.05");

  const { address } = useAccount();

  const t = (key: TranslationKey) =>
    getTranslation(selectedLanguage as LanguageCode, key);

  const handlePositionChange = (lat: number, lng: number) => {
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
    setErrors((prev) => ({ ...prev, latitude: "", longitude: "" }));
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.log("Geolocation is not available in this browser.");
    }
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      setStartTimestamp(Math.floor(new Date(startDate).getTime() / 1000));
      setEndTimestamp(Math.floor(new Date(endDate).getTime() / 1000));
    }
  }, [startDate, endDate]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!policyName.trim()) newErrors.policyName = "Policy name is required";
    if (!latitude) newErrors.latitude = "Latitude is required";
    if (!longitude) newErrors.longitude = "Longitude is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    if (!weatherCondition)
      newErrors.weatherCondition = "Weather condition is required";
    if (!threshold.trim()) newErrors.threshold = "Threshold value is required";
    if (!maxCoverage.trim())
      newErrors.maxCoverage = "Maximum coverage is required";
    if (isNaN(Number(maxCoverage)) || Number(maxCoverage) <= 0) {
      newErrors.maxCoverage = "Maximum coverage must be a positive number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePremium = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let response;
      if (useDummyResponse) {
        // use dummy response
        const policyId = `POLICY-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        response = dummyPremiumResponse(policyId);
        // simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        // use actual API
        const apiResponse = await axios.post(
          "https://cropsafe-base-sea-hackathon.onrender.com/get-premium",
          {
            policies: [
              {
                policyId: `POLICY-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                policyHolder: address,
                basename: basename,
                policyName,
                location: {
                  latitude: parseFloat(latitude),
                  longitude: parseFloat(longitude),
                },
                startDate,
                endDate,
                premiumCurrency: "ETH",
                maxCoverage: parseFloat(maxCoverage),
                coverageCurrency: "ETH",
                weatherCondition: {
                  conditionType: weatherCondition?.value,
                  threshold: `${threshold} ${getThresholdUnit(weatherCondition?.value || "")}`,
                  operator: weatherCondition?.operator || "greaterThan",
                },
              },
            ],
          }
        );
        response = apiResponse.data;
      }

      console.log("CreatePolicy: API response", response);

      // parse the calculatedPremium string to extract the numeric value
      const premiumValue = parseFloat(response.calculatedPremium.split(" ")[0]);

      setPremiumQuote({
        ...response,
        calculatedPremium: premiumValue.toString(), // store as string for consistency
      });
      setShowPremiumQuote(true);
    } catch (error) {
      console.error("CreatePolicy: Error calculating premium:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getThresholdUnit = (conditionType: string) => {
    switch (conditionType) {
      case "rainfall":
      case "heavyRainfall":
      case "flooding":
      case "snowfall":
      case "monsoonRain":
        return "mm";
      case "temperature":
      case "heatwave":
      case "coldWave":
      case "freezeEvent":
        return "°C";
      case "galeForceWinds":
      case "windstorm":
        return "km/h";
      default:
        return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 w-full"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        {t("createPolicy")}
      </h2>
      <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={calculatePremium} className="space-y-6">
            <div>
              <Label htmlFor="policyName" className="text-lg text-gray-700">
                {t("policyName")}
              </Label>
              <Input
                id="policyName"
                value={policyName}
                onChange={(e) => {
                  setPolicyName(e.target.value);
                  setErrors((prev) => ({ ...prev, policyName: "" }));
                }}
                placeholder={t("enterPolicyName")}
                className="mt-1"
              />
              {errors.policyName && (
                <p className="text-red-500 text-sm mt-1">{errors.policyName}</p>
              )}
            </div>
            <div>
              <Label className="text-lg text-gray-700">
                {t("selectLocation")}
              </Label>
              {!showPremiumQuote && (
                <div className="h-96 mt-1 overflow-hidden rounded-lg">
                  <Map onPositionChange={handlePositionChange} />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude" className="text-lg text-gray-700">
                  {t("latitude")}
                </Label>
                <Input
                  id="latitude"
                  value={latitude}
                  onChange={(e) => {
                    setLatitude(e.target.value);
                    setErrors((prev) => ({ ...prev, latitude: "" }));
                  }}
                  className="mt-1"
                />
                {errors.latitude && (
                  <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>
                )}
              </div>
              <div>
                <Label htmlFor="longitude" className="text-lg text-gray-700">
                  {t("longitude")}
                </Label>
                <Input
                  id="longitude"
                  value={longitude}
                  onChange={(e) => {
                    setLongitude(e.target.value);
                    setErrors((prev) => ({ ...prev, longitude: "" }));
                  }}
                  className="mt-1"
                />
                {errors.longitude && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.longitude}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-lg text-gray-700">
                  {t("startDate")}
                </Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setErrors((prev) => ({ ...prev, startDate: "" }));
                  }}
                  className="mt-1"
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startDate}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-lg text-gray-700">{t("endDate")}</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setErrors((prev) => ({ ...prev, endDate: "" }));
                  }}
                  className="mt-1"
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>
            <div>
              <Label className="text-lg text-gray-700">
                {t("weatherTriggerCondition")}
              </Label>
              <Select
                value={weatherCondition}
                onChange={(selectedOption) => {
                  setWeatherCondition(selectedOption);
                  setErrors((prev) => ({ ...prev, weatherCondition: "" }));
                }}
                options={weatherOptions}
                placeholder={t("selectCondition")}
                className="mt-1"
              />
              {errors.weatherCondition && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.weatherCondition}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="threshold" className="text-lg text-gray-700">
                {t("thresholdValue")}{" "}
                {weatherCondition &&
                  `(${getThresholdUnit(weatherCondition.value)})`}
              </Label>
              <Input
                id="threshold"
                value={threshold}
                onChange={(e) => {
                  setThreshold(e.target.value);
                  setErrors((prev) => ({ ...prev, threshold: "" }));
                }}
                placeholder={`e.g., 10 ${weatherCondition ? getThresholdUnit(weatherCondition.value) : ""}`}
                className="mt-1"
              />
              {errors.threshold && (
                <p className="text-red-500 text-sm mt-1">{errors.threshold}</p>
              )}
            </div>
            <div>
              <Label htmlFor="maxCoverage" className="text-lg text-gray-700">
                {t("maximumCoverage")} (ETH)
              </Label>
              <Input
                id="maxCoverage"
                type="number"
                step="0.001"
                value={maxCoverage}
                onChange={(e) => {
                  setMaxCoverage(e.target.value);
                  setErrors((prev) => ({ ...prev, maxCoverage: "" }));
                }}
                placeholder="e.g., 0.005"
                className="mt-1"
              />
              {errors.maxCoverage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.maxCoverage}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("calculating")}
                </>
              ) : (
                t("calculatePremium")
              )}
            </Button>
            {isLoading && (
              <p className="text-sm text-gray-600 text-center mt-2">
                {t("calculationTimeMessage")}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
      <Dialog open={showPremiumQuote} onOpenChange={setShowPremiumQuote}>
        <DialogContent className="sm:max-w-[425px] fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
            <button
              onClick={() => setShowPremiumQuote(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800">
                {t("createPolicyDialogTitle")}
              </DialogTitle>
            </DialogHeader>
            {premiumQuote && (
              <div className="space-y-4 mt-4">
                <p className="text-lg font-semibold text-gray-700">
                  {t("createPolicyDialogPolicyId")}:{" "}
                  <span className="text-blue-600">{premiumQuote.policyId}</span>
                </p>
                <p className="text-lg font-semibold text-gray-700">
                  {t("createPolicyDialogRiskFactor")}:{" "}
                  <span className="text-orange-600">
                    {(premiumQuote.riskFactor * 100).toFixed(2)}%
                  </span>
                </p>
                <p className="text-lg font-semibold text-gray-700">
                  {t("createPolicyDialogCalculatedPremium")}:{" "}
                  <span className="text-green-600">
                    {premiumQuote.calculatedPremium} ETH
                  </span>
                </p>
                <p className="text-lg font-semibold text-gray-700">
                  {t("createPolicyDialogMajorUpcomingEvents")}:{" "}
                  <span className="font-normal text-black-400">
                    {premiumQuote.majorUpcomingEvents}
                  </span>
                </p>
              </div>
            )}
            <div className="flex justify-center mt-6">
              {premiumQuote && (
                <TransactionWrapper
                  address={address ?? "0x"}
                  basename={basename}
                  policyName={policyName}
                  latitude={parseFloat(latitude)}
                  longitude={parseFloat(longitude)}
                  weatherCondition={{
                    conditionType: weatherCondition?.value ?? "",
                    threshold: threshold,
                    operator: weatherCondition?.operator ?? "greaterThan",
                  }}
                  premium={parseEther(premiumQuote.calculatedPremium)}
                  maxCoverage={parseEther(maxCoverage)}
                  startDate={startTimestamp}
                  endDate={endTimestamp}
                  onSuccess={() => {
                    setShowPremiumQuote(false);
                    setCurrentView("myPolicies");
                  }}
                  paymasterAndBundlerEndpoint={PAYMASTER_AND_BUNDLER_ENDPOINT}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default CreatePolicy;
