import React from "react";
import { Home } from "lucide-react";
import { currencies } from "src/constants";
import LoginButton from "../LoginButton";
import { Button } from "../ui/button";
import Image from "next/image";
import Select from "react-select";
import { languageOptions, translations } from "src/locales/translations";

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
  const currencyOptions = currencies.map((currency) => ({
    value: currency.code,
    label: `${currency.symbol} ${currency.code}`,
  }));

  const handleLanguageChange = (option: any) => {
    setSelectedLanguage(option.value);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md w-full">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap justify-between items-center">
        <div className="flex items-center header-logo">
          <Image
            src="/logo.png"
            alt="CropSafe Logo"
            width={32}
            height={32}
            className="mr-2"
          />
          <h1 className="text-xl font-bold text-green-600">CropSafe</h1>
          <Button
            variant="ghost"
            onClick={() => setCurrentView("dashboard")}
            className="home-button md:flex"
          >
            <Home className="h-5 w-5 text-green-600" />
          </Button>
        </div>
        {isLoggedIn ? (
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 sm:mt-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
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
              <div className="language-selector" style={{ width: "120px" }}>
                <Select
                  value={{
                    value: selectedLanguage,
                    label: languageOptions.find(
                      (l) => l.code === selectedLanguage
                    )?.name,
                  }}
                  onChange={handleLanguageChange}
                  options={languageOptions.map((l) => ({
                    value: l.code as LanguageCode,
                    label: l.name,
                  }))}
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
