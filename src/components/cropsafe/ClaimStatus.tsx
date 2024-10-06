import { motion } from "framer-motion";
import React from "react";
import { formatCurrency } from "src/helper";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

function ClaimStatus({ selectedCurrency }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 max-w-4xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Claims Status</h2>
      <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <CardTitle className="text-2xl">
            Claim Reference: CL-2023-001
          </CardTitle>
          <CardDescription className="text-gray-100">
            Policy: Corn Field Policy
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Date Submitted:</span>{" "}
            July 15, 2023
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Status:</span>{" "}
            <span className="text-yellow-600">Under Review</span>
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Claim Amount:</span>{" "}
            <span className="text-blue-600">
              {formatCurrency(5000, selectedCurrency)}
            </span>
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">
              AI Assessment Summary:
            </span>{" "}
            Analyzing weather data and submitted evidence...
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ClaimStatus;
