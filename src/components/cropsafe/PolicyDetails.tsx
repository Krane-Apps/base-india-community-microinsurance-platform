import { motion } from "framer-motion";
import React from "react";
import dynamic from "next/dynamic";
import { useState } from "react";

import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { translations, TranslationKey } from "src/locales/translations";

type LanguageKey = keyof typeof translations;

const Map = dynamic(() => import("./Map"), { ssr: false });

interface Policy {
  basename: string;
  coverageCurrency: string;
  createdAt: bigint;
  endDate: bigint;
  isActive: boolean;
  isClaimed: boolean;
  location: { latitude: bigint; logitude: bigint };
  maxCoverage: bigint;
  policyId: bigint;
  policyName: string;
  policyholder: string;
  premium: bigint;
  premiumCurrency: string;
  startDate: bigint;
  updatedAt: bigint;
  weatherCondition: {
    conditionType: string;
    threshold: string;
    operator: string;
  };
}

interface PolicyDetailsProps {
  setShowClaimForm: (show: boolean) => void;
  selectedCurrency: {
    code: string;
    name: string;
    symbol: string;
    rate: number;
  };
  policy: Policy | null;
  setCurrentView: (view: string) => void;
  handleSubmitClaim: (policy: Policy) => void;
  isSubmittingClaim: boolean;
  selectedLanguage: string;
}

// hardcoded exchange rates
const ETH_TO_USD = 2000; // 1 ETH = $2000 USD

function PolicyDetails({
  setShowClaimForm,
  selectedCurrency,
  policy,
  setCurrentView,
  handleSubmitClaim,
  isSubmittingClaim,
  selectedLanguage,
}: PolicyDetailsProps) {
  const t = (key: TranslationKey) =>
    translations[selectedLanguage as LanguageKey][key];

  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const convertEthToSelectedCurrency = (ethAmount: bigint) => {
    const ethValue = Number(ethAmount) / 1e18; // Convert from wei to ETH
    const usdValue = ethValue * ETH_TO_USD;
    const convertedValue = usdValue * selectedCurrency.rate;
    return formatCurrency(convertedValue, selectedCurrency.code);
  };

  if (!policy) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          {t("policyDetails")}
        </h2>
        <p>{t("noPolicySelected")}</p>
        <Button onClick={() => setCurrentView("myPolicies")} className="mt-4">
          {t("backToMyPolicies")}
        </Button>
      </div>
    );
  }

  console.log("PolicyDetails: Rendering policy details", policy);

  const [mapPosition, setMapPosition] = useState<[number, number]>([
    Number(policy?.location.latitude) / 1e6 || 0,
    Number(policy?.location.logitude) / 1e6 || 0,
  ]);

  const handlePositionChange = (lat: number, lng: number) => {
    setMapPosition([lat, lng]);
    console.log("PolicyDetails: Map position changed", { lat, lng });
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
        {t("policyDetails")}
      </h2>
      <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
          <CardTitle className="text-2xl">{policy.policyName}</CardTitle>
          <CardDescription className="text-gray-100">
            {t("policyNumber")}: {policy.policyId.toString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-lg">
            <span className="font-semibold text-gray-700">
              {t("coveragePeriod")}
            </span>{" "}
            {new Date(Number(policy.startDate) * 1000).toLocaleDateString()} -{" "}
            {new Date(Number(policy.endDate) * 1000).toLocaleDateString()}
          </p>
          <div className="h-64 rounded-lg overflow-hidden">
            <Map onPositionChange={handlePositionChange} />
          </div>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">{t("location")}</span>{" "}
            Latitude: {mapPosition[0].toFixed(6)}, Longitude:{" "}
            {mapPosition[1].toFixed(6)}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">
              {t("weatherTriggerCondition")}
            </span>{" "}
            {policy.weatherCondition.conditionType}{" "}
            {policy.weatherCondition.operator}{" "}
            {policy.weatherCondition.threshold}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">
              {t("premiumPaid")}
            </span>{" "}
            <span className="text-green-600">
              {convertEthToSelectedCurrency(policy.premium)}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              ({formatCurrency(Number(policy.premium) / 1e18, "ETH")} ETH)
            </span>
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">
              {t("maxCoverageAmount")}
            </span>{" "}
            <span className="text-blue-600">
              {convertEthToSelectedCurrency(policy.maxCoverage)}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              ({formatCurrency(Number(policy.maxCoverage) / 1e18, "ETH")} ETH)
            </span>
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">{t("status")}</span>{" "}
            <span
              className={policy.isActive ? "text-green-600" : "text-red-600"}
            >
              {policy.isActive ? t("active") : t("inactive")}
            </span>
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">
              {t("claimStatus")}
            </span>{" "}
            <span
              className={
                policy.isClaimed ? "text-orange-600" : "text-green-600"
              }
            >
              {policy.isClaimed ? t("claimed") : t("notClaimed")}
            </span>
          </p>
        </CardContent>
        <CardFooter className="bg-gray-50 p-4">
          <Button
            onClick={() => handleSubmitClaim(policy)}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            disabled={!policy.isActive || policy.isClaimed || isSubmittingClaim}
          >
            {policy.isClaimed
              ? t("claimAlreadyFiled")
              : isSubmittingClaim
                ? t("submitting")
                : t("fileClaim")}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default PolicyDetails;
