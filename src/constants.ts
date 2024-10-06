import { Step } from "react-joyride";

export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const mintContractAddress = '0xA3e40bBe8E8579Cd2619Ef9C6fEA362b760dac9f';
export const mintABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'public',
    type: 'function',
  },
] as const;

export const steps: Step[] = [
  {
    target: ".dashboard-welcome",
    content:
      "Welcome to CropSafe! This is your personalized dashboard where you can manage your crop insurance policies.",
    disableBeacon: true,
  },
  {
    target: ".create-policy-button",
    content:
      "Click here to create a new insurance policy for your crops. You can customize coverage based on specific weather conditions.",
  },
  {
    target: ".view-policies-button",
    content:
      "Access and manage your existing policies here. You can view details, file claims, and track policy status.",
  },
  {
    target: ".policy-summary",
    content:
      "This card provides a quick overview of your active policies and any pending claims.",
  },
  {
    target: ".header-logo",
    content:
      "You can always return to the dashboard by clicking on the CropSafe logo.",
  },
  {
    target: ".user-profile",
    content:
      "Your user profile is displayed here. It shows your Base account name.",
  },
  {
    target: ".home-button",
    content:
      "Use this button to quickly navigate back to the dashboard from any page.",
  },
  {
    target: ".mobile-menu-button",
    content:
      "On smaller screens, you can access the menu options by clicking this button.",
  },
  {
    target: ".policy-card",
    content:
      "Each policy is represented by a card. You can view details or file claims for individual policies here.",
  },
  {
    target: ".faq-section",
    content:
      "Find quick answers to common questions in our FAQ section. Click on a question to reveal its answer.",
  },
  {
    target: ".currency-selector",
    content:
      "You can change the display currency here. All amounts will be converted to your selected currency.",
  },
  {
    target: "body",
    placement: "center",
    content:
      "That concludes our tour! Feel free to explore CropSafe and secure your crops against unpredictable weather conditions.",
  },
];

export const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 83 },
  { code: "THB", name: "Thai Baht", symbol: "฿", rate: 32.5 },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", rate: 15200 },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", rate: 4.4 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", rate: 1.35 },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", rate: 24000 },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", rate: 57 },
  { code: "KHR", name: "Cambodian Riel", symbol: "៛", rate: 4100 },
  { code: "MMK", name: "Myanmar Kyat", symbol: "K", rate: 2100 },
  { code: "BND", name: "Brunei Dollar", symbol: "B$", rate: 1.35 },
  { code: "LAK", name: "Lao Kip", symbol: "₭", rate: 18500 },
];

export const faqs = [
  {
    q: "How do I create a new policy?",
    a: "Click on 'Create New Policy' from the dashboard and follow the steps.",
  },
  {
    q: "How is the premium calculated?",
    a: "Our AI analyzes historical weather data and your policy details to calculate a fair premium.",
  },
  {
    q: "How do I file a claim?",
    a: "Go to 'My Policies', select the relevant policy, and click 'File a Claim'.",
  },
  {
    q: "What happens after I submit a claim?",
    a: "Our AI assesses the claim based on weather data and your submitted evidence. You'll be notified of the outcome.",
  },
  {
    q: "Do I need to pay gas fees?",
    a: "No, CropSafe uses Base chain's Paymaster to cover gas fees for you.",
  },
];
