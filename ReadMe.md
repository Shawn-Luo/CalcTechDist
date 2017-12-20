
Calculator::Tech Distance
==========================

## Features
- This little application using Google Maps Distance Matrix to get drving distances between two points
- Click Technician's name as an indexed link
- Then Choose the address by drag and drop
- Click the `Calculer` button to get the distances
    - Click `Recommencer` for enter new address if you want to calculate more for the same technician
- Click the `Acceuil` button at the top to return to the index  

## Environnement
- Fureteur support JavaScript 2015 (__ES6, ECMAScript 2015__)
    - Chrome
    - Firefox
    - Edge
- __Optional__ getting a Google Maps API Key 

### Get a Google Maps API key
- Why: Without an API key, you will reach the limit quite soon
- How: 
    - log into to your google account
    - following the instructions to get a key
        - [Official Link](https://developers.google.com/maps/documentation/distance-matrix/start#get-a-key)
    - add the key to the `index.html` file
        - at the fourth last line, add the key after `key=` 
        `<script src="https://maps.googleapis.com/maps/api/js?key="></script>`

### Google Maps Distance Matrix API Usage Limits
- [Official Link](https://developers.google.com/maps/documentation/distance-matrix/usage-limits)
- 2,500 free elements per day
- 25 origins or 25 destinations per request
- 100 elements per request & per second

## Data
- Currently, data file saved at local `/data/data.js`, as JSON array.
- Useful links 
    - [introducing JSON](https://www.json.org/)
    - [JSON Formatter](https://jsonformatter.curiousconcept.com/) 