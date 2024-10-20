import React, { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, FileText, AlertCircle, Copy, Check } from "lucide-react";
import { formatCurrency } from "src/helper";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { translations, TranslationKey } from "src/locales/translations";

type LanguageKey = keyof typeof translations;

interface DashboardProps {
  setCurrentView: (view: string) => void;
  basename: string;
  selectedCurrency: any;
  address: string;
  selectedLanguage: string;
}

function Dashboard({
  setCurrentView,
  basename,
  selectedCurrency,
  address,
  selectedLanguage,
}: DashboardProps) {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopySuccess = () => {
    setShowCopied(true);
    console.log("[Dashboard.tsx] Address copied:", address);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const t = (key: TranslationKey) =>
    translations[selectedLanguage as LanguageKey][key];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="max-w-full mx-auto mt-2">
        <div className="flex flex-row  justify-between items-start sm:items-center mb-6">
          <h2 className="dashboard-welcome text-l font-bold text-gray-800 mt-2 sm:mb-2">
            {t("welcome")}, {basename}!
          </h2>
          {(address || basename) && (
            <CopyToClipboard
              text={address ?? basename}
              onCopy={handleCopySuccess}
            >
              <Button
                variant="outline"
                className="copy-button flex items-center"
                title={t("copyAddress")}
              >
                {showCopied ? (
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 mr-2 text-gray-600" />
                )}
                <span className="text-sm">
                  {address.slice(0, 3)}...{address.slice(-3)}
                </span>
              </Button>
            </CopyToClipboard>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <Button
            onClick={() => setCurrentView("createPolicy")}
            className="create-policy-button h-24 text-lg bg-green-600 hover:bg-green-700 transition-colors duration-300 rounded-lg shadow-lg flex items-center justify-center"
          >
            <div className="flex items-center">
              <PlusCircle className="mr-2 h-6 w-6" />
              <span>{t("createPolicy")}</span>
            </div>
          </Button>
          <Button
            onClick={() => setCurrentView("myPolicies")}
            className="view-policies-button h-24 text-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-300 rounded-lg shadow-lg flex items-center justify-center"
          >
            <div className="flex items-center">
              <FileText className="mr-2 h-6 w-6" />
              <span>{t("myPolicies")}</span>
            </div>
          </Button>
        </div>
        <Card className="policy-summary bg-white shadow-xl rounded-lg overflow-hidden w-full">
          <CardHeader className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
            <CardTitle className="text-2xl">{t("dashboard")}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  {t("activePolicies")}:{" "}
                  <span className="text-green-600">2</span>
                </p>
                <p className="text-lg font-semibold text-gray-700">
                  {t("pendingClaims")}:{" "}
                  <span className="text-yellow-600">1</span>
                </p>
                <p className="text-lg font-semibold text-gray-700">
                  {t("totalCoverage")}:{" "}
                  <span className="text-blue-600">
                    {formatCurrency(BigInt("20000"), selectedCurrency)}
                  </span>
                </p>
              </div>
              <AlertCircle className="h-12 w-12 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

export default Dashboard;
