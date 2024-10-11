import { motion } from "framer-motion";
import { Umbrella, Thermometer } from "lucide-react";
import React from "react";
import { formatCurrency } from "src/helper";

import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";

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

interface MyPoliciesProps {
  selectedCurrency: string;
  setCurrentView: (view: string) => void;
  setShowClaimForm: (show: boolean) => void;
  showClaimForm: boolean;
  policies: Policy[];
  setSelectedPolicy: (policy: Policy) => void;
}

function MyPolicies({
  selectedCurrency,
  setCurrentView,
  setShowClaimForm,
  showClaimForm,
  policies,
  setSelectedPolicy,
}: MyPoliciesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 max-w-4xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Policies</h2>
      <div className="space-y-6">
        {policies.map((policy, index) => (
          <Card
            key={index}
            className="policy-card bg-white shadow-xl rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <CardHeader className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
              <div className="flex items-center space-x-4">
                {policy.weatherCondition.conditionType === "rainfall" ? (
                  <Umbrella className="h-8 w-8" />
                ) : (
                  <Thermometer className="h-8 w-8" />
                )}
                <div>
                  <CardTitle className="text-xl">{policy.policyName}</CardTitle>
                  <CardDescription className="text-gray-100">
                    {new Date(
                      Number(policy.startDate) * 1000
                    ).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(
                      Number(policy.endDate) * 1000
                    ).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-lg font-semibold text-gray-700">
                Status:{" "}
                <span
                  className={
                    policy.isActive ? "text-green-600" : "text-red-600"
                  }
                >
                  {policy.isActive ? "Active" : "Inactive"}
                </span>
              </p>
              <p className="text-lg font-semibold text-gray-700">
                Coverage:{" "}
                <span className="text-blue-600">
                  {formatCurrency(
                    Number(policy.maxCoverage) / 1e18,
                    selectedCurrency
                  )}
                </span>
              </p>
              <p className="text-lg font-semibold text-gray-700">
                Weather Condition: {policy.weatherCondition.conditionType}{" "}
                {policy.weatherCondition.operator}{" "}
                {policy.weatherCondition.threshold}
              </p>
            </CardContent>
            <CardFooter className="bg-gray-50 p-4">
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 w-full">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedPolicy(policy);
                    setCurrentView("policyDetails");
                  }}
                  className="w-full sm:w-auto"
                >
                  View Details
                </Button>
                <Button
                  onClick={() => setShowClaimForm(true)}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                  disabled={!policy.isActive || policy.isClaimed}
                >
                  {policy.isClaimed ? "Claim Filed" : "File a Claim"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

export default MyPolicies;
