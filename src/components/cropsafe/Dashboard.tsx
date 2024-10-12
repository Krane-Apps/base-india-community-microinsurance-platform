import React, { useState } from "react";

import { motion } from "framer-motion";
import { PlusCircle, FileText, AlertCircle, Copy, Check } from "lucide-react";
import { formatCurrency } from "src/helper";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface DashboardProps {
  setCurrentView: (view: string) => void;
  basename: string;
  selectedCurrency: any;
  address: string;
}

function Dashboard({
  setCurrentView,
  basename,
  selectedCurrency,
  address,
}: DashboardProps) {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopySuccess = () => {
    setShowCopied(true);
    console.log("[Dashboard.tsx] Address copied:", address);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="dashboard-welcome text-xl font-bold text-gray-800">
          Welcome, {basename}!
        </h2>
        {(address || basename) && (
          <CopyToClipboard
            text={address ?? basename}
            onCopy={handleCopySuccess}
          >
            <Button
              variant="outline"
              className="copy-button flex items-center"
              title="Copy address"
            >
              {showCopied ? (
                <Check className="h-4 w-4 mr-2 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 mr-2 text-gray-600" />
              )}
              <span className="text-sm">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </Button>
          </CopyToClipboard>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Button
          onClick={() => setCurrentView("createPolicy")}
          className="create-policy-button h-24 text-lg bg-green-600 hover:bg-green-700 transition-colors duration-300 rounded-lg shadow-lg flex items-center justify-center"
        >
          <div className="flex items-center">
            <PlusCircle className="mr-2 h-6 w-6" />
            <span>Create New Policy</span>
          </div>
        </Button>
        <Button
          onClick={() => setCurrentView("myPolicies")}
          className="view-policies-button h-24 text-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-300 rounded-lg shadow-lg flex items-center justify-center"
        >
          <div className="flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            <span>View My Policies</span>
          </div>
        </Button>
      </div>
      <Card className="policy-summary bg-white shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
          <CardTitle className="text-2xl">Policy Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-gray-700">
                Active Policies: <span className="text-green-600">2</span>
              </p>
              <p className="text-lg font-semibold text-gray-700">
                Pending Claims: <span className="text-yellow-600">1</span>
              </p>
              <p className="text-lg font-semibold text-gray-700">
                Total Coverage:{" "}
                <span className="text-blue-600">
                  {formatCurrency(BigInt("20000"), selectedCurrency)}
                </span>
              </p>
            </div>
            <AlertCircle className="h-12 w-12 text-yellow-500" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default Dashboard;
