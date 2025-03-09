import express from "express";
import axios from "axios";
import { render } from "ejs";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "mcrg";
const yourPassword = "1234";
const yourAPIKey = "e9e6692c-e29d-45c7-9119-7c9e634a493e";
const yourBearerToken = "14843122-bb56-4afa-b7a7-5fa6a3f343db";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async(req, res) => {
  //TODO 2: Use axios to hit up the /random endpoint
  //The data you get back should be sent to the ejs file as "content"
  //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
  try {
    const result = await axios.get(API_URL + "/random");
    res.render("index.ejs", {content : JSON.stringify(result.data)});
  } catch (error) {
    res.status(404).send(error.message);
  }
  
});

app.get("/basicAuth", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "all", {
      auth: {
        username: yourUsername,
        password: yourPassword
      },
      params: {
        page: 2
      }
    });
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || error.message);
  }
});

app.get("/apiKey", async (req, res) => {
  //TODO 4: Write your code here to hit up the /filter endpoint
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.
  try {
    const result = await axios.get(API_URL + "filter", {
      params: {
        embarassment: 5,
        apiKey: yourAPIKey
      }
    });
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || error.message);
  }
});

const config = {
  headers: { Authorization: `Bearer ${yourBearerToken}` },
};

app.get("/bearerToken", async (req, res) => {
  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  /*
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */
  try {
    const result = await axios.get(API_URL + "secrets/42", config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
