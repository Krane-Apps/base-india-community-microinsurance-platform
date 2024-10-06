import React from "react";
import { motion } from "framer-motion";
import { FileText, Home, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";

function MobileMenu({ setCurrentView, setShowMobileMenu }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-40"
    >
      <div className="p-4 space-y-2">
        <Button
          onClick={() => {
            setCurrentView("dashboard");
            setShowMobileMenu(false);
          }}
          className="w-full justify-start text-green-600 hover:bg-green-50"
        >
          <Home className="h-5 w-5 mr-2" /> Dashboard
        </Button>
        <Button
          onClick={() => {
            setCurrentView("createPolicy");
            setShowMobileMenu(false);
          }}
          className="w-full justify-start text-green-600 hover:bg-green-50"
        >
          <PlusCircle className="h-5 w-5 mr-2" /> Create New Policy
        </Button>
        <Button
          onClick={() => {
            setCurrentView("myPolicies");
            setShowMobileMenu(false);
          }}
          className="w-full justify-start text-green-600 hover:bg-green-50"
        >
          <FileText className="h-5 w-5 mr-2" /> My Policies
        </Button>
      </div>
    </motion.div>
  );
}

export default MobileMenu;
