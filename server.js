const express = require("express");
const axios = require("axios");
const app = express();

// Set the view engine to EJS
app.set("view engine", "ejs");


app.use(express.static("public"));
const rapidKey="1a3a512480msh378d3c082a3a83dp1d9e96jsne320ff037b16"

const apiKey = "2d76c4a5a3b5ac6903c696e43cf14223";


app.get("/", (req, res) => {
  res.render("index", { weather: null, nasaImage: null, fictionalData: null, locationInfo: null, joke: null, error: null });
});
// Add this route to your existing Express app
app.get("/convertCurrency", async (req, res) => {
  const fromCurrency = req.query.fromCurrency; // Use user input or default to 'SGD'
  const toCurrency = req.query.toCurrency; // Use user input or default to 'MYR'
  const amount = req.query.amount; // Use user input or default to '1.0'

  const currencyConversionOptions = {
    method: 'GET',
    url: 'https://currency-exchange.p.rapidapi.com/exchange',
    params: { from: fromCurrency, to: toCurrency, q: amount },
    headers: {
      'X-RapidAPI-Key': '1a3a512480msh378d3c082a3a83dp1d9e96jsne320ff037b16',
      'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
    }
  };

  try {
    const conversionResponse = await axios.request(currencyConversionOptions);
    const convertedResult = conversionResponse.data;

    res.render("currencyConversion", { convertedResult, error: null });
  } catch (error) {
    res.render("currencyConversion", {
      convertedResult: null,
      error: "Error converting currency. Please try again.",
    });
  }
});
// Add this route to your existing Express app
app.get("/getIPInfo", async (req, res) => {
  const ipAddress = req.query.ip || '162.209.106.137'; // Use user input or default IP

  const ipInfoOptions = {
    method: 'POST',
    url: 'https://community-neutrino-ip-info.p.rapidapi.com/ip-info',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': '1a3a512480msh378d3c082a3a83dp1d9e96jsne320ff037b16',
      'X-RapidAPI-Host': 'community-neutrino-ip-info.p.rapidapi.com'
    },
    data: `ip=${ipAddress}&reverse-lookup=checked`,
  };

  try {
    const response = await axios.request(ipInfoOptions);
    const ipInfo = response.data;

    res.render("ipInfo", { ipInfo, error: null });
  } catch (error) {
    res.render("ipInfo", {
      ipInfo: null,
      error: "Error fetching IP information. Please try again.",
    });
  }
});


app.get("/weather", async (req, res) => {
  const city = req.query.city;
  const countryCode = req.query.countryCode;
  const limit = 1;

  const geocodingAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${countryCode}&limit=${limit}&appid=${apiKey}`;

  try {
    const geoResponse = await axios.get(geocodingAPI);
    const { lat, lon } = geoResponse.data[0];

    const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    const weatherResponse = await axios.get(weatherAPI);
    const weather = weatherResponse.data;

    // data from NASA API


    //  data from OpenCage Geocoding API



    res.render("index", { weather, lat, lon, error: null });
  } catch (error) {
    // Handle the error and provide default values for lat, lon, and additional data
    const defaultLat = 0;
    const defaultLon = 0;

    res.render("index", {
      weather: null,
      lat: defaultLat,
      lon: defaultLon,
      nasaImage: null,
      fictionalData: null,
      locationInfo: null,
      joke: null,
      error: "Error, Please try again"
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port} http://localhost:3000`);
});
