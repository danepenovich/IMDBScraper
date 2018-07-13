var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

//This sets the URL of the web app to localhost:8000/scrape.
app.get('/scrape', function(req, res){
  //This is the URL for the imdb page we want to scrape information from.
  url = 'https://www.imdb.com/title/tt3501632/'; 
  //This is our request which takes the above URL as well as a callback which takes an error, response, and the html parsed by Cheerio.
  request(url, function(error, response, html){
    if(!error){
      //Cheerio parses html into easily accessed JSON data.
      var $ = cheerio.load(html);
      //These are our variables for each piece of information we want from the IMDB page.
      var title, release, rating;
      //Creating our JSON object and naming our keys based on the information we want from the IMDB page.
      var json = { title : "", release : "", rating : ""};
      //.title_wrapper is the div class that contains a movie title and release date on an IMDB page. .filter is a jQuery function being used to locate our desired information.
      $('.title_wrapper').filter(function(){
        //The data variable is set to $(this) AKA the parent object AKA the .title_wrapper information parsed by Cheerio.
        var data = $(this);
        //The title and release date are located by traversing our data. They exist within the first child element of our div and JQuery is used to pinpoint them both as well as trim any unneeded characters.
        title = data.children().first().text().trim();
        release = data.children().last().children().last().text().trim();
        //Setting title and release values to our title and release keys in our JSON object.
        json.title = title;
        json.release = release;
      })
      //New jQuery filter function to get our rating, as it exists within a different div class called .ratingValue.
      $('.ratingValue').filter(function(){
        //Same as above, data variable set to the parent object and rating is located using jQuery functions.
        var data = $(this);
        rating = data.text().trim();
        //Rating value set to rating key of our JSON object.
        json.rating = rating;
      })
    }
    //Below code writes the information from our JSON object above into a file called 'output.json' and places it into the directory of our sever.js file. JSON.stringify makes our information more easily readable. The callback function lets us know if everything was successful.
    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
      console.log('Success! Check output.json file in project directory for movie information.');
    })

    res.send('Check the console to see if scrape was successful!')
  })
})

app.listen('8000')
console.log('Running on port 8000');
exports = module.exports = app;
