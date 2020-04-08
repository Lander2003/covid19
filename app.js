const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");
const cheerio = require("cheerio");

const app = express();


let globalC, globalD, globalR, searchData1, searchData2, searchData3, countryName1, currentDate;


const countryList = ["Thailand", "Japan", "Singapore", "Nepal", "Malaysia","Canada","Australia","Cambodia","Sri Lanka","Germany","Finland","United Arab Emirates","Philippines","India","Italy","Sweden","Spain","Belgium","Egypt","Lebanon","Iraq","Oman","Afghanistan","Bahrain","Kuwait","Algeria","Croatia","Switzerland","Austria","Israel","Pakistan","Brazil","Georgia","Greece","North Macedonia", "Norway", "Romania", "Estonia", "San Marino", "Belarus", "Iceland", "Lithuania", "Mexico", "New Zealand", "Nigeria", "Ireland", "Luxembourg", "Monaco", "Qatar", "Ecuador", "Azerbaijan", "Armenia", "Dominican Republic", "Indonesia", "Portugal", "Andorra", "Latvia", "Morocco", "Saudi Arabia", "Senegal", "Argentina", "Chile", "Jordan", "Ukraine", "Hungary", "Liechtenstein", "Poland", "Tunisia", "Bosnia and Herzegovina", "Slovenia", "South Africa", "Bhutan", "Cameroon", "Colombia", "Costa Rica", "Peru", "Serbia", "Slovakia", "Togo", "Malta", "Martinique", "Bulgaria", "Maldives", "Bangladesh", "Paraguay", "Albania", "Cyprus", "Brunei", "US", "Burkina Faso", "Holy See", "Mongolia", "Panama", "China", "Iran", "Korea, South", "France", "Cruise Ship", "Denmark", "Czechia", "Taiwan*", "Vietnam", "Russia", "Moldova", "Bolivia", "Honduras", "United Kingdom", "Congo (Kinshasa)", "Cote d'Ivoire", "Jamaica", "Turkey", "Cuba", "Guyana", "Kazakhstan", "Ethiopia", "Sudan", "Guinea", "Kenya", "Antigua and Barbuda", "Uruguay", "Ghana", "Namibia", "Seychelles", "Trinidad and Tobago", "Venezuela", "Eswatini", "Gabon", "Guatemala", "Mauritania", "Rwanda", "Saint Lucia", "Saint Vincent and the Grenadines", "Suriname", "Kosovo", "Central African Republic", "Congo (Brazzaville)", "Equatorial Guinea", "Uzbekistan", "Netherlands", "Benin", "Liberia", "Somalia", "Tanzania", "Barbados", "Montenegro", "Kyrgyzstan", "Mauritius", "Zambia", "Djibouti", "Gambia, The", "Gambia", "Bahamas, The", "Bahamas", "Chad", "El Salvador", "Fiji", "Nicaragua", "Haiti", "Syria", "Angola", "Madagascar", "Cabo Verde", "Niger", "Papua New Guinea", "Zimbabwe", "Cape Verde", "East Timor", "Uganda", "Dominica", "Grenada", "Mozambique", "Timor-Leste", "Eritrea", "Belize", "Diamond Princess", "Laos", "Libya", "The West Bank and Gaza", "Guinea-Bissau", "Mali", "Saint Kitts and Nevis", "West Bank and Gaza", "Myanmar", "Burma", "MS Zaandam", "Botswana", "Sierra Leone", "Burundi"];

const countryCodes = ["THA", "JPN", "SGP", "NPL", "MYS", "CAN", "AUS", "KHM", "LKA", "DEU", "FIN", "ARE", "PHL", "IND", "ITA", "SWE", "ESP", "BEL", "EGY", "LBN", "IRQ", "OMN", "AFG", "BHR", "KWT", "DZA", "HRV", "CHE", "AUT", "ISR", "PAK", "BRA", "GEO", "GRC", "MKD", "NOR", "ROU", "EST", "SMR", "BLR", "ISL", "LTU", "MEX", "NZL", "NGA", "IRL", "LUX", "MCO", "QAT", "ECU", "AZE", "ARM", "DOM", "IDN", "PRT", "AND", "LVA", "MAR", "SAU", "SEN", "ARG", "CHL", "JOR", "UKR", "HUN", "LIE", "POL", "TUN", "BIH", "SVN", "ZAF", "BTN", "CMR", "COL", "CRI", "PER", "SRB", "SVK", "TGO", "MLT", "MTQ", "BGR", "MDV", "BGD", "PRY", "ALB", "CYP", "BRN", "USA", "BFA", "VAT", "MNG", "PAN", "CHN", "IRN", "KOR", "FRA", "SHP", "DNK", "CZE", "TWN", "VNM", "RUS", "MDA", "BOL", "HND", "GBR", "COD", "CIV", "JAM", "TUR", "CUB", "GUY", "KAZ", "ETH", "SDN", "GIN", "KEN", "ATG", "URY", "GHA", "NAM", "SYC", "TTO", "VEN", "SWZ", "GAB", "GTM", "MRT", "RWA", "LCA", "VCT", "SUR", "RKS", "CAF", "COG", "GNQ", "UZB", "NLD", "BEN", "LBR", "SOM", "TZA", "BRB", "MNE", "KGZ", "MUS", "ZMB", "DJI", "GMB", "GMB", "BHS", "BHS", "TCD", "SLV", "FJI", "NIC", "HTI", "SYR", "AGO", "MDG", "CPV", "NER", "PNG", "ZWE", "CBV", "ETL", "UGA", "DMA", "GRD", "MOZ", "TLS", "ERI", "BLZ", "DPS", "LAO", "LBY", "WBG", "GNB", "MLI", "KNA", "WBG", "MMR", "MMR", "MSZ", "BWA", "SLE", "BDI"];

const countryListSorted = ["Thailand", "Japan", "Singapore", "Nepal", "Malaysia","Canada","Australia","Cambodia","Sri Lanka","Germany","Finland","United Arab Emirates","Philippines","India","Italy","Sweden","Spain","Belgium","Egypt","Lebanon","Iraq","Oman","Afghanistan","Bahrain","Kuwait","Algeria","Croatia","Switzerland","Austria","Israel","Pakistan","Brazil","Georgia","Greece","North Macedonia", "Norway", "Romania", "Estonia", "San Marino", "Belarus", "Iceland", "Lithuania", "Mexico", "New Zealand", "Nigeria", "Ireland", "Luxembourg", "Monaco", "Qatar", "Ecuador", "Azerbaijan", "Armenia", "Dominican Republic", "Indonesia", "Portugal", "Andorra", "Latvia", "Morocco", "Saudi Arabia", "Senegal", "Argentina", "Chile", "Jordan", "Ukraine", "Hungary", "Liechtenstein", "Poland", "Tunisia", "Bosnia and Herzegovina", "Slovenia", "South Africa", "Bhutan", "Cameroon", "Colombia", "Costa Rica", "Peru", "Serbia", "Slovakia", "Togo", "Malta", "Martinique", "Bulgaria", "Maldives", "Bangladesh", "Paraguay", "Albania", "Cyprus", "Brunei", "US", "Burkina Faso", "Holy See", "Mongolia", "Panama", "China", "Iran", "Korea, South", "France", "Cruise Ship", "Denmark", "Czechia", "Taiwan*", "Vietnam", "Russia", "Moldova", "Bolivia", "Honduras", "United Kingdom", "Congo (Kinshasa)", "Cote d'Ivoire", "Jamaica", "Turkey", "Cuba", "Guyana", "Kazakhstan", "Ethiopia", "Sudan", "Guinea", "Kenya", "Antigua and Barbuda", "Uruguay", "Ghana", "Namibia", "Seychelles", "Trinidad and Tobago", "Venezuela", "Eswatini", "Gabon", "Guatemala", "Mauritania", "Rwanda", "Saint Lucia", "Saint Vincent and the Grenadines", "Suriname", "Kosovo", "Central African Republic", "Congo (Brazzaville)", "Equatorial Guinea", "Uzbekistan", "Netherlands", "Benin", "Liberia", "Somalia", "Tanzania", "Barbados", "Montenegro", "Kyrgyzstan", "Mauritius", "Zambia", "Djibouti", "Gambia, The", "Gambia", "Bahamas, The", "Bahamas", "Chad", "El Salvador", "Fiji", "Nicaragua", "Haiti", "Syria", "Angola", "Madagascar", "Cabo Verde", "Niger", "Papua New Guinea", "Zimbabwe", "Cape Verde", "East Timor", "Uganda", "Dominica", "Grenada", "Mozambique", "Timor-Leste", "Eritrea", "Belize", "Diamond Princess", "Laos", "Libya", "The West Bank and Gaza", "Guinea-Bissau", "Mali", "Saint Kitts and Nevis", "West Bank and Gaza", "Myanmar", "Burma", , "MS Zaandam", "Botswana", "Sierra Leone", "Burundi"];

countryListSorted.sort();

request("https://covidapi.info/api/v1/latest-date", (error, response, html) => {
  const $ = cheerio.load(html);
  const date = $("body");
  currentDate = date.text();
})


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));



app.get("/", function(req, res) {
  res.render("index", {
    global1: globalC,
    global2: globalD,
    global3: globalR,

    confirmedCases: searchData1,
    deathCases: searchData2,
    recoveredCases: searchData3,
    countryInput: countryName1,
    countryDropdown: countryList,

    countries: countryListSorted,
    date: currentDate
  });
});

let name = "";

// Creating a post request, so we take the country name
app.post("/", function(req, res) {
  let today = new Date();
  let yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  let countryName = req.body.countryName;
  if(countryName == ""){
    countryName = "North Macedonia";
  }


  // Converting the name to a country code

  for(let i = 0; i<=countryList.length; i++){
    if(countryName == countryList[i]){
      countryCode = countryCodes[i];
    }
  }
  const url = "https://covidapi.info/api/v1/country/" + countryCode + "/" + currentDate;



  // HTTPS request to the API

  https.get(url, function(response) {
    response.on("data", function(data) {
      const covidData = JSON.parse(data);
      let confirmed = covidData.result[currentDate].confirmed;
      let deaths = covidData.result[currentDate].deaths;
      let recovered = covidData.result[currentDate].recovered;
      searchData1 = confirmed;
      searchData2 = deaths;
      searchData3 = recovered;
      countryName1 = countryName;
      res.redirect("/");
    })
  })
})



// GLOBAL

app.post("/global", function(req, res) {
  const globalUrl = "https://covidapi.info/api/v1/global";
  https.get(globalUrl, function(response) {
    response.on("data", function(data) {
      const globalData = JSON.parse(data);
      let globalConfirmed = globalData.result.confirmed;
      let globalDeaths = globalData.result.deaths;
      let globalRecovered = globalData.result.recovered;
      globalC = globalConfirmed;
      globalD = globalDeaths;
      globalR = globalRecovered;
      res.redirect("/");
    })
  })
})



// FEEDBACK

app.get("/feedback", function(req, res){
  res.render("feedback")
})

app.post("/feedback", function(req, res){
const name = req.body.feedbackName;
const email = req.body.feedbackEmail;
const suggestion = req.body.feedbackSuggestion;
const idea = req.body.feedbackIdea;

const data = {
  members: [
    {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: name,
      SUGGESTION: suggestion,
      IDEA: idea
    }
  }
  ]
};

const jsonData = JSON.stringify(data);

const url = "https://us19.api.mailchimp.com/3.0/lists/83c6406778";
const options = {
  method: "POST",
  auth: "Luka:6e0f34c8a061a35cbf6af24318db96cd-us19"
}

const request = https.request(url, options, function(response){
  response.on("data", function(data){
    console.log(jsonData);
  })
})

request.write(jsonData);
request.end();

if(res.statusCode != 200){
  res.redirect("/failure");
}else{
  res.redirect("/success");
}

})

app.get("/success", function(req, res){
  res.render("success");
})

app.get("/failure", function(req, res){
  res.render("failure");
})





app.listen(process.env.PORT || 4000, function() {
  console.log("Listening on port 4000");
})
