export const BASE_CHAIN_ID = 8453;

export const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
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
    a: "Easy peasy! Just click on 'Create New Policy' from the dashboard and follow the steps. It's like ordering a pizza, but for crop insurance!",
  },
  {
    q: "How is the premium calculated?",
    a: "Our AI crunches numbers faster than you can say 'weather forecast'! It analyzes historical weather data and your policy details to cook up a fair premium.",
  },
  {
    q: "How do I file a claim?",
    a: "It's as simple as taking a selfie! Go to 'My Policies', pick the relevant policy, and hit 'File a Claim'. Our AI will take it from there.",
  },
  {
    q: "What happens after I submit a claim?",
    a: "Our AI puts on its detective hat, assesses the claim based on weather data and your evidence. You'll get the verdict faster than a thunderclap!",
  },
  {
    q: "Do I need to pay gas fees?",
    a: "Nope! We've got you covered. CropSafe uses Base chain's Paymaster to handle gas fees. It's like having a full tank of gas, always!",
  },
  {
    q: "Why does the website look like it's designed for mobile when I open it on desktop?",
    a: "Great catch! We whipped up CropSafe in a hackathon faster than you can say 'weather insurance'. This mobile-first version is our MVP (Minimum Viable Product). We're working on making it look snazzier on bigger screens soon!",
  },
  {
    q: "Is CropSafe only for farmers?",
    a: "Not at all! While farmers are our main squad, CropSafe is like a Swiss Army knife for weather-related insurance. Think cricket matches, outdoor concerts, or even your backyard BBQ party!",
  },
  {
    q: "Can I insure my beach vacation against rain?",
    a: "Absolutely! Whether it's crops or your tan lines, if the weather can ruin it, we can probably insure it. Just create a policy for your vacation dates and location!",
  },
  {
    q: "How accurate is your weather data?",
    a: "Our weather data is so accurate, even Mother Nature checks it before deciding the forecast! We use multiple reliable sources and our AI cross-checks everything.",
  },
  {
    q: "What if I disagree with a claim decision?",
    a: "Don't worry, we're not set in stone! You can appeal the decision, and our team will review it faster than you can do a rain dance.",
  },
  {
    q: "Can I cancel my policy?",
    a: "Of course! You can cancel your policy anytime. It's not like a bad weather forecast that you're stuck with!",
  },
  {
    q: "Is my data safe with CropSafe?",
    a: "Safer than a seed in a silo! We use top-notch encryption and blockchain technology to keep your data secure.",
  },
  {
    q: "How fast are claim payouts?",
    a: "Faster than a tumbleweed in a tornado! Once a claim is approved, payouts are usually processed within 24-48 hours.",
  },
  {
    q: "Can I insure against specific weather events like hail or frost?",
    a: "You bet! Whether it's hail, frost, drought, or a locust plague (okay, maybe not the last one), we've got you covered. Just specify the weather condition when creating your policy.",
  },
  {
    q: "Is CropSafe available worldwide?",
    a: "We're spreading like wildfire! While we're not everywhere yet, we're working on global domination... er, we mean global coverage. Check our website for the latest list of supported countries!",
  },
];

export const createPolicyContractAddress = "0x7a92034f9fE2a58fEc209830CeACf250bD356A44";
export const createPolicyABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"policyId","type":"uint256"},{"indexed":false,"internalType":"address","name":"policyholder","type":"address"},{"indexed":false,"internalType":"uint256","name":"claimAmount","type":"uint256"}],"name":"ClaimFiled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"policyId","type":"uint256"},{"indexed":false,"internalType":"address","name":"policyholder","type":"address"},{"indexed":false,"internalType":"uint256","name":"paidAmount","type":"uint256"}],"name":"ClaimPaid","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldOwner","type":"address"},{"indexed":false,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnerChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"policyId","type":"uint256"},{"indexed":false,"internalType":"address","name":"policyholder","type":"address"},{"indexed":false,"internalType":"uint256","name":"coverageAmount","type":"uint256"}],"name":"PolicyCreated","type":"event"},{"inputs":[{"internalType":"uint256","name":"_policyId","type":"uint256"}],"name":"checkClaimApprovalAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_policyId","type":"uint256"}],"name":"checkClaimStatus","outputs":[{"internalType":"enum CropSafe.ClaimStatus","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_basename","type":"string"},{"internalType":"string","name":"_policyName","type":"string"},{"components":[{"internalType":"uint256","name":"latitude","type":"uint256"},{"internalType":"uint256","name":"logitude","type":"uint256"}],"internalType":"struct CropSafe.Location","name":"_location","type":"tuple"},{"components":[{"internalType":"string","name":"conditionType","type":"string"},{"internalType":"string","name":"threshold","type":"string"},{"internalType":"string","name":"operator","type":"string"}],"internalType":"struct CropSafe.WeatherCondition","name":"_weatherCondition","type":"tuple"},{"internalType":"uint256","name":"_premium","type":"uint256"},{"internalType":"string","name":"_premiumCurrency","type":"string"},{"internalType":"uint256","name":"_maxCoverage","type":"uint256"},{"internalType":"string","name":"_coverageCurrency","type":"string"},{"internalType":"uint256","name":"_startDate","type":"uint256"},{"internalType":"uint256","name":"_endDate","type":"uint256"}],"name":"createpolicy","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getAllPolicies","outputs":[{"components":[{"internalType":"uint256","name":"policyId","type":"uint256"},{"internalType":"address","name":"policyholder","type":"address"},{"internalType":"string","name":"basename","type":"string"},{"internalType":"string","name":"policyName","type":"string"},{"components":[{"internalType":"uint256","name":"latitude","type":"uint256"},{"internalType":"uint256","name":"logitude","type":"uint256"}],"internalType":"struct CropSafe.Location","name":"location","type":"tuple"},{"internalType":"uint256","name":"startDate","type":"uint256"},{"internalType":"uint256","name":"endDate","type":"uint256"},{"internalType":"uint256","name":"premium","type":"uint256"},{"internalType":"string","name":"premiumCurrency","type":"string"},{"internalType":"uint256","name":"maxCoverage","type":"uint256"},{"internalType":"string","name":"coverageCurrency","type":"string"},{"components":[{"internalType":"string","name":"conditionType","type":"string"},{"internalType":"string","name":"threshold","type":"string"},{"internalType":"string","name":"operator","type":"string"}],"internalType":"struct CropSafe.WeatherCondition","name":"weatherCondition","type":"tuple"},{"internalType":"bool","name":"isActive","type":"bool"},{"internalType":"bool","name":"isClaimed","type":"bool"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"}],"internalType":"struct CropSafe.Policy[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_policyId","type":"uint256"}],"name":"getPolicyDetail","outputs":[{"components":[{"internalType":"uint256","name":"policyId","type":"uint256"},{"internalType":"address","name":"policyholder","type":"address"},{"internalType":"string","name":"basename","type":"string"},{"internalType":"string","name":"policyName","type":"string"},{"components":[{"internalType":"uint256","name":"latitude","type":"uint256"},{"internalType":"uint256","name":"logitude","type":"uint256"}],"internalType":"struct CropSafe.Location","name":"location","type":"tuple"},{"internalType":"uint256","name":"startDate","type":"uint256"},{"internalType":"uint256","name":"endDate","type":"uint256"},{"internalType":"uint256","name":"premium","type":"uint256"},{"internalType":"string","name":"premiumCurrency","type":"string"},{"internalType":"uint256","name":"maxCoverage","type":"uint256"},{"internalType":"string","name":"coverageCurrency","type":"string"},{"components":[{"internalType":"string","name":"conditionType","type":"string"},{"internalType":"string","name":"threshold","type":"string"},{"internalType":"string","name":"operator","type":"string"}],"internalType":"struct CropSafe.WeatherCondition","name":"weatherCondition","type":"tuple"},{"internalType":"bool","name":"isActive","type":"bool"},{"internalType":"bool","name":"isClaimed","type":"bool"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"}],"internalType":"struct CropSafe.Policy","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getPolicyIds","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_policyId","type":"uint256"}],"name":"payPremium","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"policyCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"updateOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_policyId","type":"uint256"},{"internalType":"uint256","name":"_approvedAmount","type":"uint256"}],"name":"updatePolicyClaim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
