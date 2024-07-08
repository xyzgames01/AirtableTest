const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const apiKey = process.env.AIRTABLE_API_KEY;  // Secure API Key
    const baseId = 'appKlav51nMnd5yhi';  // Replace with your actual Base ID

    const { queryStringParameters } = event;
    const table = queryStringParameters.table || 'Cars';
    const maxRecords = queryStringParameters.maxRecords || 100;
    const vin = queryStringParameters.vin;

    let url = `https://api.airtable.com/v0/${baseId}/${table}?maxRecords=${maxRecords}`;
    
    if (vin) {
        url = `https://api.airtable.com/v0/${baseId}/${table}?filterByFormula={VIN}='${vin}'`;
    }

    const options = {
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: JSON.stringify(data.records.map(record => record.fields))
            };
        } else {
            return {
                statusCode: response.status,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: JSON.stringify({ error: data })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};
