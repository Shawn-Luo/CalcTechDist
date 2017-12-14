/* *
* DOM objects
* Three colons for display the list of all technicians' names
* */

// sort data by names
const data = jsonData.sort(function(a,b) {
    return a.name.localeCompare(b.name);
});

// array to save origin and destination addresses

// DOM objects
let homeBtn = document.getElementById('homeBtn');
let helpBtn = document.getElementById('helpBtn');

let nameList = document.getElementById('nameList');
let intro = document.getElementById('intro');
let calculator = document.getElementById('calculator');
let table = document.querySelector('table');
let total = document.getElementById('total');
let office = document.getElementById('office');
let sites = document.getElementById('sites');
let technician = document.getElementById('technician');

// to show technicians list
function renderIndex() {
    for(let i=0, len=data.length; i<len; i++) {
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
    document.getElementById('calculate').addEventListener('click', calculer());
}


function renderUL(objDOM, data) {
    while (objDOM.hasChildNodes()) {
        objDOM.removeChild(objDOM.lastChild);
    }
    data.sort();
    for(let i=0, len = data.length; i<len; i++) {
        let node = document.createElement('li');
        node.textContent = data[i];
        objDOM.appendChild(node);
    }
}

function makeDragDrop() {
    $('li').draggable({
        helper: "clone", revert: "invalid",
        start: function (e, ui) {
            ui.helper.animate({width:"15%"},200);
        },
        cursorAt: {left:40, top:25}
     });
    $('td').droppable({
        drop: function(e, ui) {
            $(this).find("input").val( $(ui.draggable).text() );
        }
    });
}

//to retrieve table data & save to array
function getAdds(){
    // let org=[]
    // let dst=[]
    //     let origin, dest;

    // console.log(table.length);
    let len = table.rows.length;
    for(let i=1; i<len-1; i++) {
        org = table.rows[i].cells[1].children[0].value;
        dst = table.rows[i].cells[2].children[0].value;
        if(org && dst) {        console.log(org);console.log(dst);}
        // if(origin && dest){ org.push(origin); dst.push(dest) };
        // console.log(table.row[i].cells[]);
    }

}


function calculer() {

    //colect table input and save to from[], to[]
    getAdds();
    //send request to google api
    //handle response and show data at page
    // calculate & show total
}

window.onload = renderIndex();
for(let i=0, len=nameList.children.length; i<len; i++) {
    let obj = nameList.children[i];
    obj.addEventListener('click', function() {
        obj.style.backgroundColor = "Cornsilk";
        obj.style.color = "purple";
        nameList.style.display = "none";
        renderCalc(obj.textContent);
    });
}

// MENU & BUTTON
homeBtn.addEventListener('click', function() {
    calculator.style.display = "none";
    intro.style.display = "block";
    nameList.style.display = "block";
});

helpBtn.addEventListener('click', () =>{alert('Function TO DO')});

document.getElementById('reset').addEventListener('click', function() {total.textContent = ''});
