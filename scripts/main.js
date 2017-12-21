/* *
* DOM objects
* Three colons for display the list of all technicians' names
* */

// sort data by names
const data = jsonData.sort(function (a, b) {
    return a.name.localeCompare(b.name);
});

const addNotFound = []; // save not found addresses

// DOM objects
const homeBtn = document.getElementById('homeBtn');
const helpBtn = document.getElementById('helpBtn');
const calcBtn = document.getElementById('calculate');
const nameList = document.getElementById('nameList');
const intro = document.getElementById('intro');
const calculator = document.getElementById('calculator');
const table = document.querySelector('table');
const totalElm = document.getElementById('total');
const office = document.getElementById('office');
const sites = document.getElementById('sites');
const technician = document.getElementById('technician');
const unkown = document.getElementById('unkown');

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
    $('.adds').droppable({
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
    if (typeof addNotFound === 'undefined' || addNotFound.length < 1) {
        return true
    }
    if (addNotFound.includes(add)) {
        //updateList(inconnu, add);
        //addRed();
        return false;
    }
    return true;
}

// Remove unrecognized address from the list
// function removeAdd(add) {
//     for(let i=0, len=sites.length; i<len; i++) {
//         if(sites[i].textContent === add ) {
//             sites.removeChild(sites.childNodes[i]);
//         }
//     }
// }

//to retrieve table data & save to array
function getAdds() {
    let orgArray = [], dstArray = [], numRows = [];
    let len = table.rows.length;
    for (let i = 1; i < len - 1; i++) {
        org = table.rows[i].cells[1].children[0].value;
        dst = table.rows[i].cells[2].children[0].value;
        if (org && dst) {
            if (addValid(org, i) && addValid(dst, i)) {
                orgArray.push(org);
                dstArray.push(dst);
                numRows.push(i);
            }
        }
    }
    return {
        origs: orgArray,
        dests: dstArray,
        numRow: numRows,
    };
}


function calculate() {
    let adds = getAdds();
    let org = adds['origs'], dst = adds['dests'], numRow = adds['numRow'];
    for (let i = 0, len = org.length; i < len; i++) {
        getDistance(org[i], dst[i], numRow[i]);
    }
}

function getDistance(origin, destination, numRow) {
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
                let stat = response.rows[0].elements[0].status;
                if (stat === 'NOT_FOUND') {
                    let o = response.originAddresses[0];
                    let d = response.destinationAddresses[0];
                    if (o === "") {
                        addRed(table.rows[numRow].cells[1]);
                        updateList(unkown, origin);
                        addNotFound.push(origin);
                    }
                    if (d === "") {
                        addRed(table.rows[numRow].cells[2]);
                        updateList(unkown, destination);
                        addNotFound.push(destination);
                    }
                    table.rows[numRow].cells[3].textContent = "?";
                } else {

                    removeRed(table.rows[numRow].cells[0]);
                    removeRed(table.rows[numRow].cells[1]);

                    // show distance at table
                    let km = response.rows[0].elements[0].distance.text;
                    table.rows[numRow].cells[3].textContent = km;

                    // update total value
                    let currDist = 0, sum = 0;

                    if (km.length > 0) {
                        currDist = parseFloat(km);
                        sum += currDist;
                    }

                    if (totalElm.textContent != '0') {
                        sum += parseFloat(totalElm.textContent);
                    }

                    totalElm.textContent = sum;

                }
            } else {
                alert('Error: ' + status);
            }

        });
}

// Enlever le classe en affichant le champs en rouge
function removeRed(elm) {
    if (elm.classList.contains('error')) {
        elm.classList.remove('error')
    }
}

// Enlever le classe en affichant le champs en rouge
function addRed(elm) {
    if (!elm.classList.contains('error')) {
        elm.classList.toggle('error')
    }
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
    for (let i = 1, len = table.rows.length; i < len; i++) {
        let elm = table.rows[i].cells[3];
        if (elm) {
            elm.textContent = '';
        }
    }
    totalElm.textContent = 0;
});