"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Joyride from "react-joyride";
import { useAccount, useContractRead } from "wagmi";
import LoginButton from "../LoginButton";
import axios from "axios";

import MobileMenu from "./MobileMenu";
import Dashboard from "./Dashboard";
import CreatePolicy from "./CreatePolicy";
import MyPolicies from "./MyPolicies";
import PolicyDetails from "./PolicyDetails";
import ClaimStatus from "./ClaimStatus";
import FAQs from "./FAQs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import {
  currencies,
  steps,
  createPolicyABI,
  createPolicyContractAddress,
} from "src/constants";
import CurrencyPopup from "./CurrencyPopup";
import Header from "./Header";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dailog";

interface Policy {
  policyId: bigint;
  policyholder: string;
  basename: string;
  policyName: string;
  location: { latitude: bigint; logitude: bigint };
  startDate: bigint;
  endDate: bigint;
  premium: bigint;
  premiumCurrency: string;
  maxCoverage: bigint;
  coverageCurrency: string;
  weatherCondition: {
    conditionType: string;
    threshold: string;
    operator: string;
  };
  isActive: boolean;
  isClaimed: boolean;
  createdAt: bigint;
  updatedAt: bigint;
}

export default function CropSafe() {
  const { address } = useAccount();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [basename, setBasename] = useState("");
  const [currentView, setCurrentView] = useState("dashboard");
  const [showPremiumQuote, setShowPremiumQuote] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [showCurrencyPopup, setShowCurrencyPopup] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [claimResponse, setClaimResponse] = useState<any>(null);
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);

  const { data: policyData } = useContractRead({
    address: createPolicyContractAddress,
    abi: createPolicyABI,
    functionName: "getAllPolicies",
    args: [address],
  });

  useEffect(() => {
    if (policyData) {
      console.log("policyData", policyData);
      setPolicies(policyData as Policy[]);
    }
  }, [policyData]);

  useEffect(() => {
    if (address) {
      setIsLoggedIn(true);
      setBasename(`${address.slice(0, 6)}...${address.slice(-4)}`);
    } else {
      setIsLoggedIn(false);
      setBasename("");
    }
  }, [address]);

  useEffect(() => {
    const tourCompleted = localStorage.getItem("tourCompleted");
    if (isLoggedIn && !tourCompleted) {
      setRunTour(true);
    }
  }, [isLoggedIn]);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    if (status === "finished") {
      localStorage.setItem("tourCompleted", "true");
    }
  };

  const renderCurrencyPopup = () => (
    <CurrencyPopup
      showCurrencyPopup={showCurrencyPopup}
      setShowCurrencyPopup={setShowCurrencyPopup}
      selectedCurrency={selectedCurrency}
      setSelectedCurrency={setSelectedCurrency}
    />
  );

  const renderHeader = () => (
    <Header
      isLoggedIn={isLoggedIn}
      setCurrentView={setCurrentView}
      selectedCurrency={selectedCurrency}
      setSelectedCurrency={setSelectedCurrency}
      basename={basename}
      address={address ?? ""}
    />
  );

  const renderMobileMenu = () => (
    <AnimatePresence>
      {showMobileMenu && (
        <MobileMenu
          setCurrentView={setCurrentView}
          setShowMobileMenu={setShowMobileMenu}
        />
      )}
    </AnimatePresence>
  );

  const renderDashboard = () => (
    <Dashboard
      setCurrentView={setCurrentView}
      basename={basename}
      selectedCurrency={selectedCurrency}
      address={address ?? ""}
    />
  );

  const renderCreatePolicy = () => (
    <CreatePolicy
      selectedCurrency={selectedCurrency}
      setCurrentView={setCurrentView}
      showPremiumQuote={showPremiumQuote}
      setShowPremiumQuote={setShowPremiumQuote}
    />
  );

  const renderMyPolicies = () => (
    <MyPolicies
      selectedCurrency={selectedCurrency}
      setCurrentView={setCurrentView}
      setShowClaimForm={setShowClaimForm}
      showClaimForm={showClaimForm}
      policies={policies as any}
      setSelectedPolicy={setSelectedPolicy}
      handleSubmitClaim={handleSubmitClaim}
      isSubmittingClaim={isSubmittingClaim}
    />
  );

  const renderPolicyDetails = () => (
    <PolicyDetails
      selectedCurrency={selectedCurrency}
      setCurrentView={setCurrentView}
      setShowClaimForm={setShowClaimForm}
      policy={selectedPolicy as any}
      handleSubmitClaim={handleSubmitClaim}
      isSubmittingClaim={isSubmittingClaim}
    />
  );

  const renderClaimStatus = () => (
    <ClaimStatus
      selectedCurrency={selectedCurrency}
      setCurrentView={setCurrentView}
      setShowClaimForm={setShowClaimForm}
    />
  );

  const renderFAQs = () => <FAQs />;

  const handleSubmitClaim = async (policy: Policy) => {
    setIsSubmittingClaim(true);

    try {
      const requestBody = {
        policies: [
          {
            policyId: policy.policyId.toString(),
            policyHolder: policy.policyholder,
            basename: policy.basename,
            policyName: policy.policyName,
            location: {
              latitude: `${Number(policy.location.latitude) / 1e6}N`,
              longitude: `${Number(policy.location.logitude) / 1e6}W`,
            },
            startDate: new Date(Number(policy.startDate) * 1000)
              .toISOString()
              .split("T")[0],
            endDate: new Date(Number(policy.endDate) * 1000)
              .toISOString()
              .split("T")[0],
            premium: Number(policy.premium) / 1e18,
            premiumCurrency: policy.premiumCurrency,
            maxCoverage: Number(policy.maxCoverage) / 1e18,
            coverageCurrency: policy.coverageCurrency,
            weatherCondition: policy.weatherCondition,
          },
        ],
      };

      console.log("handleSubmitClaim: requestBody", requestBody);

      const response = await axios.post(
        "https://cropsafe-base-sea-hackathon.onrender.com/process-claim",
        requestBody
      );

      console.log("handleSubmitClaim: response", response.data);
      setClaimResponse(response.data);
      setShowClaimForm(true);
    } catch (error) {
      console.error("Error submitting claim:", error);
      setClaimResponse({
        policyId: policy.policyId.toString(),
        canClaim: false,
        claimConditionMessage:
          "An error occurred while processing your claim. Please try again.",
      });
      setShowClaimForm(true);
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  const renderClaimResponse = () => (
    <Dialog open={showClaimForm} onOpenChange={setShowClaimForm}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Claim Status
          </DialogTitle>
        </DialogHeader>
        {claimResponse && (
          <div
            className={`p-4 rounded-md ${claimResponse.canClaim ? "bg-green-100" : "bg-red-100"}`}
          >
            <h3 className="text-lg font-semibold mb-2">
              {claimResponse.canClaim ? "Claim Eligible" : "Claim Not Eligible"}
            </h3>
            <p className="text-sm text-gray-700">
              {claimResponse.claimConditionMessage}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex flex-col">
      {renderHeader()}
      {renderMobileMenu()}
      {renderCurrencyPopup()}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center h-full p-4"
            >
              <Card className="w-full max-w-md bg-white shadow-xl rounded-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
                  <CardTitle className="text-2xl">
                    Welcome to CropSafe
                  </CardTitle>
                  <CardDescription className="text-gray-100">
                    Login to access your weather insurance dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {!address && <LoginButton />}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <>
              {currentView === "dashboard" && renderDashboard()}
              {currentView === "createPolicy" && renderCreatePolicy()}
              {currentView === "myPolicies" && renderMyPolicies()}
              {currentView === "policyDetails" && renderPolicyDetails()}
              {currentView === "claimStatus" && renderClaimStatus()}
              {renderClaimResponse()}
            </>
          )}
        </AnimatePresence>
      </main>
      {isLoggedIn && renderFAQs()}
      <Joyride
        steps={steps}
        run={runTour}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        styles={{
          options: {
            primaryColor: "#10B981",
          },
        }}
        callback={handleJoyrideCallback}
      />
    </div>
  );
}
