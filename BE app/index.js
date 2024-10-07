const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());


/*
ENDPOINTS
*/
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/get-premium', (req, res) => {
    const { policies } = req.body;
    
    if (!policies || !Array.isArray(policies) || policies.length === 0) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
  
    const policy = policies[0];
    
    const riskFactor = getRandomNumber(0, 1).toFixed(2);
    const premium = getRandomNumber(0, policy.maxCoverage).toFixed(2);
    const majorEvent = getRandomWeatherEvent();
  
    const response = {
      policyId: policy.policyId,
      riskFactor: parseFloat(riskFactor),
      calculatedPremium: `${premium} ${policy.coverageCurrency}`,
      majorUpcomingEvents: majorEvent
    };
  
    res.json(response);
});

app.post('/process-claim', (req, res) => {
    const { policies } = req.body;
    
    if (!policies || !Array.isArray(policies) || policies.length === 0) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
  
    const policy = policies[0];
    
    const canClaim = Math.random() < 0.5; // 50% chance of claim approval
    const claimCondition = getRandomClaimCondition(policy.weatherCondition.conditionType);
  
    const response = {
      policyId: policy.policyId,
      canClaim: canClaim,
      claimConditionMessage: claimCondition
    };
  
    res.json(response);
});

/*
HELPER FUNCTIONS
*/
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
  
function getRandomWeatherEvent() {
    const events = [
      "Heavy rainfall expected in the next week",
      "Possible heatwave approaching in 20 days",
      "Mild drought conditions forecasted for the coming month",
      "Unexpected frost might occur in the next 3 weeks",
      "Strong winds predicted for the latter half of the month"
    ];
    return events[Math.floor(Math.random() * events.length)];
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
SERVER CONFIG
*/
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});