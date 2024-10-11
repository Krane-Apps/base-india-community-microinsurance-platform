"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Joyride from "react-joyride";
import { useAccount } from "wagmi";
import LoginButton from "../LoginButton";
import Image from "next/image";

import { Home, Menu } from "lucide-react";

import MobileMenu from "./MobileMenu";
import Dashboard from "./Dashboard";
import CreatePolicy from "./CreatePolicy";
import MyPolicies from "./MyPolicies";
import PolicyDetails from "./PolicyDetails";
import ClaimForm from "./ClaimForm";
import ClaimStatus from "./ClaimStatus";
import FAQs from "./FAQs";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { currencies, steps } from "src/constants";
import CurrencyPopup from "./CurrencyPopup";
import Header from "./Header";

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
      showMobileMenu={showMobileMenu}
      setShowMobileMenu={setShowMobileMenu}
      basename={basename}
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
    />
  );

  const renderPolicyDetails = () => (
    <PolicyDetails
      selectedCurrency={selectedCurrency}
      setCurrentView={setCurrentView}
      setShowClaimForm={setShowClaimForm}
    />
  );

  const renderClaimForm = () => (
    <ClaimForm
      selectedCurrency={selectedCurrency}
      setCurrentView={setCurrentView}
      setShowClaimForm={setShowClaimForm}
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
              {renderClaimForm()}
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
