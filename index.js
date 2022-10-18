// api : C7UTSVDAHD6GMNUEV7KMXDVEV
const express = require("express");
const PORT = process.env.PORT || 3000;
const http = require("https");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
let city = "Moscow";

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

function getDate() {
  const date = new Date();
  const today = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return today;
}

app.get("/", function (req, res) {
  const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${getDate()}?key=C7UTSVDAHD6GMNUEV7KMXDVEV`;
  http.get(URL, function (response) {
    let weatherData = "";
    response.on("data", function (data) {
      weatherData += data;
    });

    response.on("end", function () {
      const parsedData = JSON.parse(weatherData);
      const timezone = parsedData["timezone"];
      const temp = parsedData["days"][0]["temp"];
      const date = parsedData["days"][0]["datetime"];
      const humidity = parsedData["days"][0]["humidity"];
      const condition = parsedData["days"][0]["conditions"];
      const icon = parsedData["days"][0]["icon"];
      res.render("home", {
        temp: temp,
        conditions: condition,
        icon: icon,
        city: timezone,
        Humidity: humidity,
        date: date,
      });
    });
  });
});

app.post("/", function (req, res) {
  city = req.body.cityName;
  res.redirect("/");
});

app.listen(PORT, function () {
  console.log(`Server up and running, on port ${PORT}`);
});
