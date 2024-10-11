import React from "react";
import { currencies } from "src/constants";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dailog";
import { Label } from "../ui/label";
import Select from "react-select";

function CurrencyPopup({
  showCurrencyPopup,
  setShowCurrencyPopup,
  selectedCurrency,
  setSelectedCurrency,
}: any) {
  const currencyOptions = currencies.map((currency) => ({
    value: currency.code,
    label: `${currency.name} (${currency.code})`,
  }));

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
            value={{
              value: selectedCurrency.code,
              label: `${selectedCurrency.name} (${selectedCurrency.code})`,
            }}
            onChange={(option: any) => {
              const currency = currencies.find((c) => c.code === option.value);
              if (currency) {
                setSelectedCurrency(currency);
                setShowCurrencyPopup(false);
              }
            }}
            options={currencyOptions}
            styles={{
              control: (provided) => ({
                ...provided,
                marginTop: "8px",
              }),
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CurrencyPopup;
