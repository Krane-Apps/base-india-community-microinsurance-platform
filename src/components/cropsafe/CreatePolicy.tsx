import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { formatCurrency } from "src/helper";
import dynamic from "next/dynamic";
import axios from "axios";
import Select from "react-select";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dailog";

const Map = dynamic(() => import("./Map"), { ssr: false });

interface PremiumQuote {
  policyId: string;
  riskFactor: number;
  calculatedPremium: string;
  majorUpcomingEvents: string;
}

const weatherOptions = [
  { value: "rainfall", label: "Rainfall above" },
  { value: "temperature", label: "Temperature below" },
];

function CreatePolicy({
  selectedCurrency,
  setCurrentView,
  showPremiumQuote,
  setShowPremiumQuote,
  basename,
}: any) {
  const [policyName, setPolicyName] = useState("");
  const [weatherCondition, setWeatherCondition] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [threshold, setThreshold] = useState("");
  const [premiumQuote, setPremiumQuote] = useState<PremiumQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePremium = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://cropsafe-base-sea-hackathon.onrender.com/get-premium",
        {
          policies: [
            {
              policyId: `POLICY-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
              policyHolder: "0x123abc456def789ghi",
              basename: basename,
              policyName,
              location: {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
              },
              startDate,
              endDate,
              premiumCurrency: "ETH",
              maxCoverage: 20,
              coverageCurrency: "ETH",
              weatherCondition: {
                conditionType: weatherCondition?.value,
                threshold: `${threshold} ${weatherCondition?.value === "temperature" ? "celsius" : "mm"}`,
                operator:
                  weatherCondition?.value === "rainfall"
                    ? "greaterThan"
                    : "lessThan",
              },
            },
          ],
        }
      );
      console.log(response.data);
      setPremiumQuote(response.data);
      setShowPremiumQuote(true);
    } catch (error) {
      console.error("Error calculating premium:", error);
      setShowPremiumQuote(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 max-w-4xl mx-auto relative"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Create New Policy
      </h2>
      <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
        <CardContent className="p-6">
          <form onSubmit={calculatePremium} className="space-y-6">
            <div>
              <Label htmlFor="policyName" className="text-lg text-gray-700">
                Policy Name
              </Label>
              <Input
                id="policyName"
                value={policyName}
                onChange={(e) => {
                  setPolicyName(e.target.value);
                  setErrors((prev) => ({ ...prev, policyName: "" }));
                }}
                placeholder="Enter policy name"
                className="mt-1"
              />
              {errors.policyName && (
                <p className="text-red-500 text-sm mt-1">{errors.policyName}</p>
              )}
            </div>
            <div>
              <Label className="text-lg text-gray-700">Select Location</Label>
              {!showPremiumQuote && (
                <div className="h-96 mt-1 overflow-hidden rounded-lg">
                  <Map onPositionChange={handlePositionChange} />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude" className="text-lg text-gray-700">
                  Latitude
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
                  Longitude
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
                <Label className="text-lg text-gray-700">Start Date</Label>
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
                <Label className="text-lg text-gray-700">End Date</Label>
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
                Weather Trigger Condition
              </Label>
              <Select
                value={weatherCondition}
                onChange={(selectedOption) => {
                  setWeatherCondition(selectedOption);
                  setErrors((prev) => ({ ...prev, weatherCondition: "" }));
                }}
                options={weatherOptions}
                placeholder="Select condition"
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
                Threshold Value
              </Label>
              <Input
                id="threshold"
                value={threshold}
                onChange={(e) => {
                  setThreshold(e.target.value);
                  setErrors((prev) => ({ ...prev, threshold: "" }));
                }}
                placeholder="e.g., 10 mm"
                className="mt-1"
              />
              {errors.threshold && (
                <p className="text-red-500 text-sm mt-1">{errors.threshold}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-300"
            >
              {isLoading ? "Calculating..." : "Calculate Premium"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Dialog open={showPremiumQuote} onOpenChange={setShowPremiumQuote}>
        <DialogContent className="sm:max-w-[425px] fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800">
                Premium Quote
              </DialogTitle>
            </DialogHeader>
            {premiumQuote && (
              <div className="space-y-4 mt-4">
                <p className="text-lg font-semibold text-gray-700">
                  Policy ID:{" "}
                  <span className="text-blue-600">{premiumQuote.policyId}</span>
                </p>
                <p className="text-lg font-semibold text-gray-700">
                  Risk Factor:{" "}
                  <span className="text-orange-600">
                    {(premiumQuote.riskFactor * 100).toFixed(2)}%
                  </span>
                </p>
                <p className="text-lg font-semibold text-gray-700">
                  Calculated Premium:{" "}
                  <span className="text-green-600">
                    {premiumQuote.calculatedPremium}
                  </span>
                </p>
                <p className="text-lg font-semibold text-gray-700">
                  Major Upcoming Events:{" "}
                  <span className="font-normal text-black-400">
                    {premiumQuote.majorUpcomingEvents}
                  </span>
                </p>
              </div>
            )}
            <div className="flex justify-end space-x-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowPremiumQuote(false)}
              >
                Modify Policy Details
              </Button>
              <Button
                onClick={() => {
                  setShowPremiumQuote(false);
                  setTimeout(() => setCurrentView("myPolicies"), 2000);
                }}
                className="bg-green-600 hover:bg-green-700 transition-colors duration-300"
              >
                Accept and Proceed to Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default CreatePolicy;
