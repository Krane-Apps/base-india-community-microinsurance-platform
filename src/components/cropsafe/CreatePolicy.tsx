import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import React, { useState } from "react";
import { formatCurrency } from "src/helper";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dailog";

function CreatePolicy({
  selectedCurrency,
  setCurrentView,
  showPremiumQuote,
  setShowPremiumQuote,
}: any) {
  const [weatherCondition, setWeatherCondition] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 max-w-4xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Create New Policy
      </h2>
      <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
        <CardContent className="p-6">
          <form className="space-y-6">
            <div>
              <Label htmlFor="policyName" className="text-lg text-gray-700">
                Policy Name
              </Label>
              <Input
                id="policyName"
                placeholder="Enter policy name"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-lg text-gray-700">Select Location</Label>
              <div className="h-64 bg-blue-100 flex items-center justify-center rounded-lg mt-1 overflow-hidden">
                <MapPin className="w-12 h-12 text-blue-500" />
                <span className="ml-2 text-blue-700">
                  Interactive Map Placeholder
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude" className="text-lg text-gray-700">
                  Latitude
                </Label>
                <Input id="latitude" placeholder="Latitude" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="longitude" className="text-lg text-gray-700">
                  Longitude
                </Label>
                <Input
                  id="longitude"
                  placeholder="Longitude"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-lg text-gray-700">Start Date</Label>
                <Input type="date" className="mt-1" />
              </div>
              <div>
                <Label className="text-lg text-gray-700">End Date</Label>
                <Input type="date" className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-lg text-gray-700">
                Weather Trigger Condition
              </Label>
              <Select onValueChange={(value) => setWeatherCondition(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rainfall">Rainfall above</SelectItem>
                  <SelectItem value="temperature">Temperature below</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="threshold" className="text-lg text-gray-700">
                Threshold Value
              </Label>
              <Input
                id="threshold"
                placeholder="e.g., 10 mm"
                className="mt-1"
              />
            </div>
            <Button
              onClick={() => setShowPremiumQuote(true)}
              className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-300"
            >
              Calculate Premium
            </Button>
          </form>
        </CardContent>
      </Card>
      <Dialog open={showPremiumQuote} onOpenChange={setShowPremiumQuote}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Premium Quote
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-lg font-semibold text-gray-700">
              Premium Amount:{" "}
              <span className="text-green-600">
                {formatCurrency(500, selectedCurrency)}
              </span>
            </p>
            <p className="text-lg font-semibold text-gray-700">
              Maximum Coverage:{" "}
              <span className="text-blue-600">
                {formatCurrency(10000, selectedCurrency)}
              </span>
            </p>
            <p className="text-gray-600">
              Risk Assessment: Low risk based on historical data
            </p>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowPremiumQuote(false)}
            >
              Modify Policy Details
            </Button>
            <Button
              onClick={() => {
                setShowPremiumQuote(false);
                setTimeout(() => setCurrentView("myPolicies"), 2000);
              }}
              className="bg-green-600 hover:bg-green-700 transition-colors duration-300"
            >
              Accept and Proceed to Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default CreatePolicy;
