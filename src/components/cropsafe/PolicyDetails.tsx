import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
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

function PolicyDetails({ setShowClaimForm, selectedCurrency }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 max-w-4xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Policy Details</h2>
      <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
          <CardTitle className="text-2xl">Corn Field Policy</CardTitle>
          <CardDescription className="text-gray-100">
            Policy Number: CF-2023-001
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-lg">
            <span className="font-semibold text-gray-700">
              Coverage Period:
            </span>{" "}
            May 1, 2023 - Oct 31, 2023
          </p>
          <div className="h-64 bg-blue-100 flex items-center justify-center rounded-lg overflow-hidden">
            <MapPin className="w-12 h-12 text-blue-500" />
            <span className="ml-2 text-blue-700">
              Interactive Map Placeholder
            </span>
          </div>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">
              Weather Trigger Condition:
            </span>{" "}
            Rainfall above 50mm in 24 hours
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Premium Paid:</span>{" "}
            <span className="text-green-600">
              {formatCurrency(500, selectedCurrency)}
            </span>
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">
              Maximum Coverage Amount:
            </span>{" "}
            <span className="text-blue-600">
              {formatCurrency(10000, selectedCurrency)}
            </span>
          </p>
        </CardContent>
        <CardFooter className="bg-gray-50 p-4">
          <Button
            onClick={() => setShowClaimForm(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
          >
            File a Claim
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default PolicyDetails;
