import React from "react";
import { currencies } from "src/constants";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dailog";
import { Label } from "../ui/label";
import { Select, SelectItem } from "../ui/select";

function CurrencyPopup({
  showCurrencyPopup,
  setShowCurrencyPopup,
  selectedCurrency,
  setSelectedCurrency,
}: any) {
  return (
    <Dialog open={showCurrencyPopup} onOpenChange={setShowCurrencyPopup}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Select Your Currency
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Label htmlFor="currency" className="text-lg text-gray-700">
            Choose your local currency
          </Label>
          <Select
            value={selectedCurrency.code}
            onValueChange={(value) => {
              const currency = currencies.find((c) => c.code === value);
              if (currency) {
                setSelectedCurrency(currency);
                setShowCurrencyPopup(false);
              }
            }}
          >
            {currencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.name} ({currency.code})
              </SelectItem>
            ))}
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CurrencyPopup;
