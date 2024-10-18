const express = require('express');
const ethers = require('ethers');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

/*
CORS_CONFIG
*/
const corsOptions = {
  origin: 'https://cropsafe-base-sea-hackathon.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));


/*
API_CONFIGS
*/
const apiKey = String(process.env.ANTHROPIC_API_KEY);
const anthropic = new Anthropic({ apiKey });
const weatherApiKey = String(process.env.WEATHER_API_KEY);


/*
WEB3_CONFIGS
*/
const provider = new ethers.JsonRpcProvider(String(process.env.ETHEREUM_RPC_URL));
const privateKey = String(process.env.PRIVATE_KEY);
const wallet = new ethers.Wallet(privateKey, provider);
const contractAddress = String(process.env.CONTRACT_ADDRESS);
const contractABI = require('./contractABI.json');
const contract = new ethers.Contract(contractAddress, contractABI, wallet);


/*
ENDPOINTS
*/
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/get-premium', async (req, res) => {
  try {
    const { policies } = req.body;
    if (!policies || !Array.isArray(policies) || policies.length === 0) {
      console.log(`[${new Date().toISOString()}] POST /get-premium - Status: 400 - Error: Invalid request body`);
      return res.status(400).json({ error: 'Invalid request body' });
    }
    const policy = policies[0];
    const {
      policyId,
      policyHolder,
      basename,
      policyName,
      location,
      startDate,
      endDate,
      premiumCurrency,
      maxCoverage,
      coverageCurrency,
      weatherCondition,
    } = policy;

    // Construct a string with all relevant policy information
    const policyInfo = `
      Policy Name: ${policyName}
      Location: Latitude ${location.latitude}, Longitude ${location.longitude}
      Start Date: ${startDate}
      End Date: ${endDate}
      Max Coverage: ${maxCoverage}
      Coverage Currency: ${coverageCurrency}
      Claim Condition: ${weatherCondition.conditionType} ${weatherCondition.operator} ${weatherCondition.threshold}
    `;
    console.log(`[${new Date().toISOString()}] POST /get-premium - Received: ${policyInfo}`);

    //get weather forecast
    const forecast = await fetchWeatherForecast(location.latitude, location.longitude);

    const aiResponse  = await generateAnthropicResponse(`${policyInfo} ${premiumPrompt} ${forecast}` , res);
    const riskFactorMatch = aiResponse.match(/riskFactor:\s*([\d.]+)/);
    const calculatedPremiumMatch = aiResponse.match(/calculatedPremium:\s*([\d.]+)/);
    const majorUpcomingEventsMatch = aiResponse.match(/majorUpcomingEvents:\s*"([^"]*)"/);

    const response = {
      policyId: policy.policyId,
      riskFactor: parseFloat(riskFactorMatch[1]),
      calculatedPremium: `${calculatedPremiumMatch[1]} ${policy.coverageCurrency}`,
      majorUpcomingEvents: majorUpcomingEventsMatch[1]
    };
    console.log(`[${new Date().toISOString()}] POST /get-premium - Status: ${res.statusCode} - PolicyId: ${response.policyId} - Premium: ${response.calculatedPremium} - RiskFactor ${response.riskFactor}`);
    res.json(response);

  } catch(error) {
    console.error(`[${new Date().toISOString()}] POST /get-premium`, error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/process-claim', async (req, res) => {
  try {
    const { policies } = req.body;
    if (!policies || !Array.isArray(policies) || policies.length === 0) {
      console.log(`[${new Date().toISOString()}] POST /process-claim - Status: 400 - Error: Invalid request body`);
      return res.status(400).json({ error: 'Invalid request body' });
    }
    const policy = policies[0];
    const {
      policyId,
      policyName,
      location,
      startDate,
      endDate,
      weatherCondition,
      premiumCurrency,
      maxCoverage,
      coverageCurrency,
      premium,
      policyHolder
    } = policy;

    const policyInfo = `
      Policy Name: ${policyName}
      Location: Latitude ${location.latitude}, Longitude ${location.longitude}
      Start Date: ${startDate}
      End Date: ${endDate}
      Coverage Currency: ${coverageCurrency}
      Claim Condition: ${weatherCondition.conditionType} ${weatherCondition.operator} ${weatherCondition.threshold}
      Premium: ${premium}
    `;
    console.log(`[${new Date().toISOString()}] POST /process-claim - Received: ${policyInfo}`);

    // const historicalWeatherData = await fetchHistoricalWeather(location.latitude, location.longitude, startDate, endDate);
    // const aiResponse = await generateAnthropicResponse(`${policyInfo} ${claimPrompt} ${JSON.stringify(historicalWeatherData)}`, res);

    const aiResponse = await generateAnthropicResponse(`${policyInfo} ${claimPrompt}`, res);
    const canClaimMatch = aiResponse.match(/canClaim:\s*(true|false)/);
    const claimConditionMessageMatch = aiResponse.match(/claimConditionMessage:\s*"([^"]*)"/);

    const response = {
      policyId: policy.policyId,
      canClaim: canClaimMatch ? canClaimMatch[1] === 'true' : false,
      claimConditionMessage: claimConditionMessageMatch ? claimConditionMessageMatch[1] : ''
    };
    console.log(`[${new Date().toISOString()}] POST /process-claim - Status: ${res.statusCode} - PolicyId: ${response.policyId} - CanClaim: ${response.canClaim}`);
    
    //now calling contract and completing transaction
    if(response.canClaim){
      console.log(`[${new Date().toISOString()}] POST /process-claim: Policy claim initiated`);
      const maxCoverageWei = ethers.parseEther(maxCoverage.toString());
      const gasEstimate = await contract.updatePolicyClaim.estimateGas(Number(policyId), maxCoverageWei);
      console.log(`[${new Date().toISOString()}] POST /process-claim: Estimated gas: ${gasEstimate}`);
      const tx = await contract.updatePolicyClaim(Number(policyId), maxCoverageWei, { gasEstimate });
      const receipt = await tx.wait();
      console.log(`[${new Date().toISOString()}] POST /process-claim: Policy claim transferred. Transaction hash: ${receipt.hash}`);
      response.transactionHash = receipt.hash; 
    }

    res.json(response);

  } catch(error) {
    console.error(`[${new Date().toISOString()}] POST /process-claim`, error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


/*
HELPER FUNCTIONS
*/
async function generateAnthropicResponse(prompt, res) {
  try {
      const completion = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1000,
        temperature: 0,
        messages: [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": prompt
              }
            ]
          }
        ]
      });
      return completion.content[0].text;
  } catch (error) {
      console.error('Error generating Anthropic response:', error);
      res.status(500).json({ error: 'An error occurred' });
  }
}

async function fetchWeatherForecast(lat, lon) {
  const url = `https://www.meteosource.com/api/v1/flexi/point?lat=${lat}&lon=${lon}&sections=daily&language=en&units=metric&key=${weatherApiKey}`;
  const response = await axios.get(url);
  const dailyData = response.data.daily.data;

  const parsedForecast = dailyData.map(day => ({
    date: day.day,
    avgTemp: day.statistics.temperature.avg,
    avgWindSpeed: day.statistics.wind.avg_speed,
    avgPrecipitation: day.statistics.precipitation.avg,
    weather: day.weather
  }));
  return parsedForecast;
}

async function fetchHistoricalWeather(lat, lon, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const weatherData = [];

  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    const formattedDate = date.toISOString().split('T')[0];
    const url = `https://www.meteosource.com/api/v1/flexi/time_machine?lat=${lat}&lon=${lon}&date=${formattedDate}&timezone=UTC&units=metric&key=${weatherApiKey}`;
    
    try {
      const response = await axios.get(url);
      const dailyData = response.data.daily;

      weatherData.push({
        date: dailyData.day,
        avgTemp: dailyData.statistics.temperature.avg,
        avgWindSpeed: dailyData.statistics.wind.avg_spee,
        avgPrecipitation: dailyData.statistics.precipitation.avg,
        weather: dailyData.weather
      });
    } catch (error) {
      console.error(`Error fetching weather data for ${formattedDate}:`, error);
    }
  }
}

/*
PROMPTS
*/
const premiumPrompt = `
You are an advanced AI system specializing in agricultural insurance risk assessment. You've been provided with details of a crop insurance policy. Your task is to analyze this information and provide a risk assessment, premium calculation, and forecast of major upcoming events.

Please provide the following:
1. Risk Factor: Assess the risk on a scale of 0.0 to 1.0, where 0.0 is extremely low risk and 1.0 is extremely high risk. Consider the location, coverage period, and assumed weather conditions.
2. Calculated Premium: Based on the risk factor and maximum coverage amount, calculate an appropriate premium. Express this as a percentage of the maximum coverage.
3. Major Upcoming Events: Predict any significant events that could affect the crop during the coverage period. This could include weather patterns, seasonal changes, or agricultural milestones.

Please format your response as follows:
riskFactor: [0.0 to 1.0]
calculatedPremium: [premium amount]
majorUpcomingEvents: "[Provide a brief explanation of your assessment, including key factors considered in 15 words]"

DO NOT ADD ANY EXTRA TEXT IN RESPONSE, JUST THE FORMATTED RESPONSE

For this analysis, the weather conditions for the next 30 days will be
`;

const claimPrompt = `
You are an advanced AI system specializing in agricultural insurance claim assessment. You've been provided with details of a crop insurance policy. Your task is to analyze this information and determine if a claim can be made based on the assumed weather conditions.

Please consider the following factors:
1. The policy's weather condition requirements
2. Policy date range is from startDate to endDate
3. Assumed weather conditions for the date range

Based on these factors, determine whether a claim can be made

For this analysis, assume the weather conditions are {{WEATHER_CONDITION}}. (normal/extreme/uncertain)

Please format your response as follows:
canClaim: [true/false]
claimConditionMessage: "[Provide a brief explanation for the claim decision in 15 words or less]"

DO NOT ADD ANY EXTRA TEXT IN RESPONSE, JUST THE FORMATTED RESPONSE
`;


/*
SERVER CONFIG
*/
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  allLogs();
});

async function allLogs() {
  const blockNo = await provider.getBlock();
  console.log(`provider block number: ${blockNo.hash}`);
}
