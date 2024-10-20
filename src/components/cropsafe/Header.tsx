import React, { useState } from "react";
import { Menu } from "lucide-react";
import { currencies } from "src/constants";
import LoginButton from "../LoginButton";
import { Button } from "../ui/button";
import Image from "next/image";
import { languageOptions, translations } from "src/locales/translations";
import Sidebar from "./Sidebar";

type LanguageCode = keyof typeof translations;

interface HeaderProps {
  isLoggedIn: boolean;
  setCurrentView: (view: string) => void;
  selectedCurrency: any;
  setSelectedCurrency: (currency: any) => void;
  selectedLanguage: LanguageCode;
  setSelectedLanguage: (language: LanguageCode) => void;
  basename: string;
  address: string;
}

function Header({
  isLoggedIn,
  setCurrentView,
  selectedCurrency,
  setSelectedCurrency,
  selectedLanguage,
  setSelectedLanguage,
  basename,
  address,
}: HeaderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogoClick = () => {
    setCurrentView("dashboard");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md w-full">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
        <div
          className="flex items-center header-logo cursor-pointer"
          onClick={handleLogoClick}
        >
          <Image
            src="/logo.png"
            alt="CropSafe Logo"
            width={32}
            height={32}
            className="mr-2"
          />
          <h1 className="text-xl font-bold text-green-600">CropSafe</h1>
        </div>
        <div className="flex items-center">
          {isLoggedIn ? (
            <Button variant="ghost" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
          ) : (
            <div className="flex items-center space-x-4">
              {!address && <LoginButton />}
            </div>
          )}
        </div>
      </div>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        setCurrentView={setCurrentView}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
    </header>
  );
}

export default Header;
