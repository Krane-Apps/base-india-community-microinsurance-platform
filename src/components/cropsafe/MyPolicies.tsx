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

function MyPolicies({
  selectedCurrency,
  setCurrentView,
  setShowClaimForm,
}: any) {
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
        {[
          {
            name: "Corn Field Policy",
            period: "May 1, 2023 - Oct 31, 2023",
            status: "Active",
            icon: Umbrella,
            coverage: 10000,
          },
          {
            name: "Wheat Field Policy",
            period: "Jun 15, 2023 - Nov 30, 2023",
            status: "Active",
            icon: Thermometer,
            coverage: 15000,
          },
        ].map((policy, index) => (
          <Card
            key={index}
            className="policy-card bg-white shadow-xl rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <CardHeader className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
              <div className="flex items-center space-x-4">
                <policy.icon className="h-8 w-8" />
                <div>
                  <CardTitle className="text-xl">{policy.name}</CardTitle>
                  <CardDescription className="text-gray-100">
                    {policy.period}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-lg font-semibold text-gray-700">
                Status: <span className="text-green-600">{policy.status}</span>
              </p>
              <p className="text-lg font-semibold text-gray-700">
                Coverage:{" "}
                <span className="text-blue-600">
                  {formatCurrency(policy.coverage, selectedCurrency)}
                </span>
              </p>
            </CardContent>
            <CardFooter className="bg-gray-50 p-4">
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 w-full">
                <Button
                  variant="outline"
                  onClick={() => setCurrentView("policyDetails")}
                  className="w-full sm:w-auto"
                >
                  View Details
                </Button>
                <Button
                  onClick={() => setShowClaimForm(true)}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                >
                  File a Claim
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
