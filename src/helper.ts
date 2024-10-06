export const convertCurrency = (amount: number, selectedCurrency: any) => {
    return (amount * selectedCurrency.rate).toFixed(2);
};

export const formatCurrency = (amount: number, selectedCurrency: any) => {
    return `${selectedCurrency.symbol}${convertCurrency(amount, selectedCurrency)}`;
};
