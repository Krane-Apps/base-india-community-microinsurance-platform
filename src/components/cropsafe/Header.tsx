import { Home } from "lucide-react";
import React from "react";
import { currencies } from "src/constants";
import LoginButton from "../LoginButton";
import { Button } from "../ui/button";
import Image from "next/image";
import Select from "react-select";

interface HeaderProps {
  isLoggedIn: boolean;
  setCurrentView: (view: string) => void;
  selectedCurrency: any;
  setSelectedCurrency: (currency: any) => void;
  basename: string;
  address: string;
}

function Header({
  isLoggedIn,
  setCurrentView,
  selectedCurrency,
  setSelectedCurrency,
  basename,
  address,
}: HeaderProps) {
  const currencyOptions = currencies.map((currency) => ({
    value: currency.code,
    label: `${currency.symbol} ${currency.code}`,
  }));

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
            <div className="currency-selector" style={{ width: "120px" }}>
              <Select
                value={{
                  value: selectedCurrency.code,
                  label: `${selectedCurrency.symbol} ${selectedCurrency.code}`,
                }}
                onChange={(option: any) => {
                  const currency = currencies.find(
                    (c) => c.code === option.value
                  );
                  if (currency) setSelectedCurrency(currency);
                }}
                options={currencyOptions}
                isSearchable={false}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    minHeight: "32px",
                    height: "32px",
                  }),
                  valueContainer: (provided) => ({
                    ...provided,
                    height: "32px",
                    padding: "0 6px",
                  }),
                  input: (provided) => ({
                    ...provided,
                    margin: "0px",
                  }),
                  indicatorSeparator: () => ({
                    display: "none",
                  }),
                  indicatorsContainer: (provided) => ({
                    ...provided,
                    height: "32px",
                  }),
                }}
              />
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
