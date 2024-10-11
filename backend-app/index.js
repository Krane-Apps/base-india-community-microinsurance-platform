const express = require('express');
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());


/*
API_CONFIGS
*/
const apiKey = String(process.env.ANTHROPIC_API_KEY);
const anthropic = new Anthropic({ apiKey });
const weatherApiKey = String(process.env.WEATHER_API_KEY);


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
    console.log(`[${new Date().toISOString()}] POST /get-premium - Status: ${res.statusCode} - PolicyId: ${response.policyId} - Premium: ${response.calculatedPremium} ${response.riskFactor}`);
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
      premium
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
 
    const aiResponse = await generateAnthropicResponse(`${policyInfo} ${claimPrompt}`, res);
    const canClaimMatch = aiResponse.match(/canClaim:\s*(true|false)/);
    const claimConditionMessageMatch = aiResponse.match(/claimConditionMessage:\s*"([^"]*)"/);

    const response = {
      policyId: policy.policyId,
      canClaim: canClaimMatch ? canClaimMatch[1] === 'true' : false,
      claimConditionMessage: claimConditionMessageMatch ? claimConditionMessageMatch[1] : ''
    };
    console.log(`[${new Date().toISOString()}] POST /process-claim - Status: ${res.statusCode} - PolicyId: ${response.policyId} - CanClaim: ${response.canClaim}`);
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
  console.log('weather key:', weatherApiKey);
  console.log('antropic key:', apiKey);
});
