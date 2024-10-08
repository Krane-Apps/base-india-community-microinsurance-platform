const express = require('express');
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());


/*
API_CONFIGS
*/
const apiKey = String(process.env.ANTHROPIC_API_KEY);
const anthropic = new Anthropic({ apiKey });


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

    const aiResponse  = await generateAnthropicResponse(`${policyInfo} ${basePromt}` , res);
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
      return res.status(400).json({ error: 'Invalid request body' });
    }
  
    const policy = policies[0];
    const canClaim = Math.random() < 0.5;
    const claimCondition = getRandomClaimCondition(policy.weatherCondition.conditionType);
  
    const response = {
      policyId: policy.policyId,
      canClaim: canClaim,
      claimConditionMessage: claimCondition
    };
  
    console.log(`[${new Date().toISOString()}] POST /process-claim - Status: ${res.statusCode} - PolicyId: ${policy.policyId} - CanClaim: ${canClaim}`);
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

function getRandomClaimCondition(conditionType) {
    const conditions = {
        "Rainfall": [
            "Excessive rainfall of 15 mm recorded, exceeding the 10 mm threshold",
            "Insufficient rainfall of 5 mm recorded, below the 10 mm threshold"
        ],
        "Temperature": [
            "High temperature of 40°C recorded, exceeding the threshold",
            "Low temperature of 5°C recorded, below the threshold"
        ],
        "Wind": [
            "Strong winds of 100 km/h recorded, exceeding the threshold",
            "Calm conditions of 10 km/h recorded, below the wind speed threshold"
        ]
    };

    const defaultConditions = [
        "Unexpected weather conditions met the claim criteria",
        "Weather conditions did not meet the specified threshold for claims"
    ];

    const relevantConditions = conditions[conditionType] || defaultConditions;
    return relevantConditions[Math.floor(Math.random() * relevantConditions.length)];
}


/*
PROMPTS
*/
const basePromt = `
You are an advanced AI system specializing in agricultural insurance risk assessment. You've been provided with details of a crop insurance policy. Your task is to analyze this information and provide a risk assessment, premium calculation, and forecast of major upcoming events.

Please provide the following:

1. Risk Factor: Assess the risk on a scale of 0.0 to 1.0, where 0.0 is extremely low risk and 1.0 is extremely high risk. Consider the location, coverage period, and assumed weather conditions.

2. Calculated Premium: Based on the risk factor and maximum coverage amount, calculate an appropriate premium. Express this as a percentage of the maximum coverage.

3. Major Upcoming Events: Predict any significant events that could affect the crop during the coverage period. This could include weather patterns, seasonal changes, or agricultural milestones.

For this analysis, assume the weather conditions for the next 30 days will be {{WEATHER_CONDITION}}. (very-normal/normal/harsh/severe)

Please format your response as follows:
riskFactor: [0.0 to 1.0]
calculatedPremium: [premium amount]
majorUpcomingEvents: "[Provide a brief explanation of your assessment, including key factors considered in 15 words]"

DO NOT ADD ANY EXTRA TEXT IN RESPONSE, JUST THE FORMATTED RESPONSE
`;


/*
SERVER CONFIG
*/
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
