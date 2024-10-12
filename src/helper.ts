// define an interface for the currency object
export interface Currency {
  code: any;
  rate: number;
  symbol: string;
}

// convert wei to ether
const weiToEther = (wei: bigint): number => {
  return Number(wei) / 1e18;
};

export const convertCurrency = (amountInWei: bigint, selectedCurrency: Currency): string => {
  console.log('HELPER_TS: convertCurrency called with:', { amountInWei, selectedCurrency });
  
  if (!selectedCurrency || typeof selectedCurrency.rate !== 'number') {
    console.error('HELPER_TS: Invalid currency rate', selectedCurrency);
    return 'N/A';
  }
  
  const amountInEther = weiToEther(amountInWei);
  const convertedAmount = (amountInEther * selectedCurrency.rate).toFixed(2);
  console.log('HELPER_TS: Conversion result:', { 
    originalAmountWei: amountInWei.toString(), 
    amountInEther,
    rate: selectedCurrency.rate, 
    convertedAmount 
  });
  
  return convertedAmount;
};

export const formatCurrency = (amountInWei: bigint, selectedCurrency: Currency): string => {
  console.log('HELPER_TS: formatCurrency called with:', { amountInWei, selectedCurrency });
  
  if (!selectedCurrency || !selectedCurrency.symbol) {
    console.error('HELPER_TS: Invalid currency symbol', selectedCurrency);
    return 'N/A';
  }
  
  const convertedAmount = convertCurrency(amountInWei, selectedCurrency);
  const formattedCurrency = `${selectedCurrency.symbol}${convertedAmount}`;
  
  console.log('HELPER_TS: Formatted currency result:', { 
    originalAmountWei: amountInWei.toString(), 
    convertedAmount, 
    formattedCurrency 
  });
  
  return formattedCurrency;
};
