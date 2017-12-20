/* *
* DOM objects
* Three colons for display the list of all technicians' names
* */

// sort data by names
const data = jsonData.sort(function (a, b) {
    return a.name.localeCompare(b.name);
});

const addNotFound = []; // save not found addresses
let rslt = [];
//let rows = []; // save rows' number

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
// const inconnu = document.getElementById('inconnu');

// show technicians list
function renderIndex() {
    for (let i = 0, len = data.length; i < len; i++) {
        updateList(nameList, data[i].name);
    }
}

function updateList(listObj, name) {
    let node = document.createElement("li");
    node.textContent = name;
    listObj.appendChild(node);
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

// Using jQuery to make list element draggable & droppable
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

// Show unrecognized addresses
function addValid(add) {
    //console.log("addValid executed");
    if(typeof addNotFound === 'undefined' || addNotFound.length < 1) {return true}
    if(addNotFound.includes(add)) {
        //updateList(inconnu, add);
        //removeAdd(add);
        return false;
    }
    return true;
}

// Remove unrecognized address from the list
function removeAdd(add) {
    for(let i=0, len=sites.length; i<len; i++) {
        if(sites[i].textContent === add ) {
            sites.removeChild(sites.childNodes[i]);
        }
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
            //console.log("running - getAdds")
            if(addValid(org) && addValid(dst)) {
                orgArray.push(org);
                dstArray.push(dst);
                //rows.push(i);
            }
        }
    }
    return {
        origs: orgArray,
        dests: dstArray
    };
}

function getDistance(origin, destination, distArr, i) {
    let service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
        {
            origins: [origin],
            destinations: [destination],
            travelMode: 'DRIVING',
            avoidHighways: false,
            avoidTolls: false
        }, function (response, status) {
            if (status == google.maps.DistanceMatrixStatus.OK) {
                console.log(response);
                let stat = response.rows[0].elements[0].status;
                if(stat === 'NOT_FOUND') {
                    let o = response.originAddresses[0];
                    let d = response.destinationAddresses[0];
                    if(o === "") { addNotFound.push(origin); }
                    if(d === "") { addNotFound.push(destination); }
                } else {
                    //console.log(response.originAddresses[0]);
                    //console.log(response.destinationAddresses[0]);
                    let km = response.rows[0].elements[0].distance.text;
                    distance = +km.substr(0,km.indexOf(' '));
                    distArr[i] = distance;
                    console.log(`Distance is ${distance}`)
                }
            } else {
                alert('Error: ' + status);
            }

        });
}

function calculate() {
    //collect table input and save to from[], to[]
    let adds = getAdds();
    let result = [], total = 0;
    let org = adds['origs'], dst = adds['dests'];
    for(let i=0, len=org.length; i<len; i++) {
        let dist = 0;
        getDistance(org[i], dst[i], result, i);
        console.log(result[i]);
        if(dist > 0) {
            console.log(`distance is ${dist}`);
            result[i] = dist;
            total += dist;
        }
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