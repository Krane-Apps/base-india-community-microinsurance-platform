import React from "react";
import { Home, Github, ExternalLink, Globe, DollarSign } from "lucide-react";
import { Button } from "../ui/button";
import Select from "react-select";
import {
  languageOptions,
  translations,
  TranslationKey,
} from "src/locales/translations";
import { currencies } from "src/constants";

type LanguageCode = keyof typeof translations;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentView: (view: string) => void;
  selectedCurrency: any;
  setSelectedCurrency: (currency: any) => void;
  selectedLanguage: LanguageCode;
  setSelectedLanguage: (language: LanguageCode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  setCurrentView,
  selectedCurrency,
  setSelectedCurrency,
  selectedLanguage,
  setSelectedLanguage,
}) => {
  const t = (key: TranslationKey) => translations[selectedLanguage][key];

  const currencyOptions = currencies.map((currency) => ({
    value: currency.code,
    label: `${currency.symbol} ${currency.code}`,
  }));

  const handleLanguageChange = (option: any) => {
    setSelectedLanguage(option.value);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="flex flex-col h-full p-4">
        <Button
          variant="ghost"
          onClick={() => {
            setCurrentView("dashboard");
            onClose();
          }}
          className="flex items-center mb-4"
        >
          <Home className="mr-2" />
          {t("goBackHome")}
        </Button>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("selectLanguage")}
          </label>
          <Select
            value={{
              value: selectedLanguage,
              label: languageOptions.find((l) => l.code === selectedLanguage)
                ?.name,
            }}
            onChange={handleLanguageChange}
            options={languageOptions.map((l) => ({
              value: l.code as LanguageCode,
              label: l.name,
            }))}
            isSearchable={false}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("selectCurrency")}
          </label>
          <Select
            value={{
              value: selectedCurrency.code,
              label: `${selectedCurrency.symbol} ${selectedCurrency.code}`,
            }}
            onChange={(option: any) => {
              const currency = currencies.find((c) => c.code === option.value);
              if (currency) setSelectedCurrency(currency);
            }}
            options={currencyOptions}
            isSearchable={false}
          />
        </div>

        <a
          href="https://github.com/bluntbrain/cropsafe-base-sea-hackathon"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center mb-2 text-blue-600 hover:text-blue-800"
        >
          <Github className="mr-2" />
          GitHub Repo
        </a>

        <a
          href="https://devfolio.co/projects/crop-safe-795d"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ExternalLink className="mr-2" />
          Submission Link
        </a>

        <div className="mt-auto">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
