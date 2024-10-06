import { address } from "framer-motion/client";
import { Home, Menu } from "lucide-react";
import { basename } from "path";
import React from "react";
import { currencies } from "src/constants";
import LoginButton from "../LoginButton";
import { Button } from "../ui/button";
import { Select, SelectItem } from "../ui/select";
import Image from "next/image";

function Header({
  isLoggedIn,
  setCurrentView,
  selectedCurrency,
  setSelectedCurrency,
  showMobileMenu,
  setShowMobileMenu,
  basename,
}: any) {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center header-logo">
          <Image
            src="/logo.png"
            alt="CropSafe Logo"
            width={32}
            height={32}
            className="mr-2"
          />
          <h1 className="text-xl font-bold text-green-600">CropSafe</h1>
        </div>
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <span className="user-profile font-semibold hidden md:inline text-gray-700">
              {basename}
            </span>
            <Button
              variant="ghost"
              onClick={() => setCurrentView("dashboard")}
              className="home-button  md:flex"
            >
              <Home className="h-5 w-5 text-green-600" />
            </Button>
            <div className="currency-selector">
              <Select
                value={selectedCurrency.code}
                onValueChange={(value) => {
                  const currency = currencies.find((c) => c.code === value);
                  if (currency) setSelectedCurrency(currency);
                }}
              >
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            {!address && <LoginButton />}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
