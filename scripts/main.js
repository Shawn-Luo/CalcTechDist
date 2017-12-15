/* *
* DOM objects
* Three colons for display the list of all technicians' names
* */

// sort data by names
const data = jsonData.sort(function (a, b) {
    return a.name.localeCompare(b.name);
});

// array to save origin and destination addresses
// let orgArray = [];
// let dstArray = [];
const KEY = "&key=AIzaSyDwwjtjmR9oVWDe0JCkWb34RuZD2lvdMHs";
const URL = "https://maps.googleapis.com/maps/api/distancematrix/json?";

// DOM objects
const homeBtn = document.getElementById('homeBtn');
const helpBtn = document.getElementById('helpBtn');
const calcBtn = document.getElementById('calculate');
const nameList = document.getElementById('nameList');
const intro = document.getElementById('intro');
const calculator = document.getElementById('calculator');
const table = document.querySelector('table');
const total = document.getElementById('total');
const office = document.getElementById('office');
const sites = document.getElementById('sites');
const technician = document.getElementById('technician');

// to show technicians list
function renderIndex() {
    for (let i = 0, len = data.length; i < len; i++) {
        updateIndex(data[i].name);
    }
}

function updateIndex(name) {
    let node = document.createElement("li");
    node.textContent = name;
    nameList.appendChild(node);
}

function renderCalc(name) {
    technician.textContent = name;
    intro.style.display = "none";
    calculator.style.display = "block";
    let techData = data.filter(tech => tech.name === name);
    renderUL(office, techData[0].bureau);
    renderUL(sites, techData[0].sites);
    makeDragDrop();
}

function makeDragDrop() {
    $('li').draggable({
        helper: "clone", revert: "invalid",
        start: function (e, ui) {
            ui.helper.animate({width: "150px"}, 200);
        },
        cursorAt: {left: 40, top: 25}
    });
    $('td').droppable({
        drop: function (e, ui) {
            $(this).find("input").val($(ui.draggable).text());
        }
    });
}

function renderUL(objDOM, data) {
    while (objDOM.hasChildNodes()) {
        objDOM.removeChild(objDOM.lastChild);
    }
    data.sort();
    for (let i = 0, len = data.length; i < len; i++) {
        let node = document.createElement('li');
        node.textContent = data[i];
        objDOM.appendChild(node);
    }
}

//to retrieve table data & save to array
function getAdds() {
    let orgArray = [], dstArray = [];
    let len = table.rows.length;
    for (let i = 1; i < len - 1; i++) {
        org = table.rows[i].cells[1].children[0].value;
        dst = table.rows[i].cells[2].children[0].value;
        if (org && dst) {
            orgArray.push(org);
            dstArray.push(dst);
        }
    }
    return {
        origs: orgArray,
        dests: dstArray
    };
}

function getDistance(origin,destination, distance) {
    let service = new google.maps.DistanceMatrixService();
    let dist = null;
    service.getDistanceMatrix(
        {
            origins: [origin],
            destinations: [destination],
            travelMode: 'DRIVING',
            avoidHighways: false,
            avoidTolls: false
        }, function (response, status) {
            if (status == google.maps.DistanceMatrixStatus.OK) {

                console.log(JSON.stringify(response));
                console.log(response.rows[0].elements[0].distance.text);
                dist = response.rows[0].elements[0].distance.text;

                // //console.log(rslt);
                // return dst.substr(0,dst.indexOf(' '));
            } else {
                alert('Error: ' + status);
            }
            distance = dist.substr(0,dist.indexOf(' '));
        });

}

function calculate() {

    //colect table input and save to from[], to[]
    let adds = getAdds();
    let distances = []; let total = 0; let dist = 0;
    let org = adds['origs'], dst = adds['dests'];
    for(let i=0, len=org.length; i<len; i++) {
        let temp = getDistance(org[i], dst[i], dist);
        console.log(temp);
        //console.log(dist.substr(0,dist.indexOf(' ')));
         //console.log(distance);
        //total +=  Number(dist.substr(0,dist.indexOf(' ')));
        // distances.push(distance);
    }
    console.log(total);
}

window.onload = renderIndex();
for (let i = 0, len = nameList.children.length; i < len; i++) {
    let obj = nameList.children[i];
    obj.addEventListener('click', function () {
        obj.style.backgroundColor = "Cornsilk";
        obj.style.color = "purple";
        nameList.style.display = "none";
        renderCalc(obj.textContent);
    });
}

// MENU & BUTTON
homeBtn.addEventListener('click', function () {
    calculator.style.display = "none";
    intro.style.display = "block";
    nameList.style.display = "block";
});

helpBtn.addEventListener('click', () => {
    alert('Function TO DO')
});
calcBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    calculate();
});
document.getElementById('reset').addEventListener('click', function () {
    total.textContent = ''
});
