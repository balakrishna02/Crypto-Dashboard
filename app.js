const express = require('express')
const app = express()
app.use(express.static('public'));

const port = 3000;
var request = require('request')
var multer = require('multer')
var upload = multer();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use(upload.array());

let myData = ""; //holding crypto currency's whole data
let coinName = "bitcoin";
var mychart = "";


async function resData(coinName){
  var marketData = await new Promise((resolve, reject) => {
    request('https://api.coingecko.com/api/v3/coins/' + coinName, function (error, response, body) {
      console.error('error:', error);
      console.log('statusCode:', response && response.statusCode);
      myData = JSON.parse(body);
    resolve(myData);
    });
  });

  if(marketData){
    var marketChart = await new Promise((resolve, reject) => {
      request('https://api.coingecko.com/api/v3/coins/' + coinName + '/market_chart?vs_currency=inr&days=180', function (error, response, body) {
        console.error('error:', error); 
        console.log('statusCode:', response && response.statusCode);
        mychart = JSON.parse(body);//chart ka data 
        // console.log(mychart)
      resolve(mychart);
      });
    });
  }
} 



app.get('/', async (req, res) => {
  await resData(coinName);
  res.render('index', { myData, mychart })
})



app.post('/',async (req, res) => {
  coinName = req.body.selectCoin;
   await resData(coinName);
  res.render('index', { myData, mychart })
})



app.listen(port,  () => {
  console.log(`Example app listening on http://localhost:${port}`)
})