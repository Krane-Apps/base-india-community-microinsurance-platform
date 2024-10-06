import { Calendar, Upload } from "lucide-react";
import React from "react";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dailog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

function ClaimForm({ showClaimForm, setShowClaimForm, setCurrentView }: any) {
  return (
    <Dialog open={showClaimForm} onOpenChange={setShowClaimForm}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            File a Claim
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4 mt-4">
          <div>
            <Label className="text-lg text-gray-700">Date of Event</Label>
            <Calendar className="mt-1" />
          </div>
          <div>
            <Label htmlFor="description" className="text-lg text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the event..."
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-lg text-gray-700">
              Upload Supporting Evidence
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-1 hover:bg-gray-50 transition-colors duration-300">
              <Upload className="mx-auto w-12 h-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
            </div>
          </div>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            onClick={() => {
              setShowClaimForm(false);
              setTimeout(() => setCurrentView("claimStatus"), 2000);
            }}
          >
            Submit Claim
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ClaimForm;
