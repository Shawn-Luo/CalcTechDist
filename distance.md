# JS

- get table element
 - `document.querySelector("table").rows[i].cells[j]`
 
```
let tab = document.querySelector("table");
for(let i=0, len=tab.length; i<len; i++)
{
    for(let j=0; j<len; j++)
    {
        //tab.rows[i].cells[j].onchange = function();
    }
}
``` 

- retrieve input value in a table
`document.querySelector("table").rows[i].cells[2].children[0].value`

- Google API
`https://maps.googleapis.com/maps/api/distancematrix/json?origins=2580+joseph+montreal&destinations=801+brennan`

- (Autocomplete JQuery)[https://github.com/devbridge/jQuery-Autocomplete]
	-(Google Place Autocomplete)[https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform]
