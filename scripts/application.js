
/* *
* DOM objects
* Three colons for display the list of all technicians' names
* */

// sort data by name
const data = jsonData.sort(function(a,b) {
    return a.name.localeCompare(b.name);
});

// DOM objects
let homeBtn = document.getElementById('homeBtn');
let helpBtn = document.getElementById('helpBtn');
let calcBtn = document.getElementById('calculer');
let resetBtn = document.getElementById('reset');
let nameList = document.getElementById('nameList');
let intro = document.getElementById('intro');
let calculator = document.getElementById('calculator');
// let addDiv = document.getElementById('addDiv');
// let formDiv = document.getElementById('formDiv');
let office = document.getElementById('office');
let sites = document.getElementById('sites');
let technician = document.getElementById('technician');

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
    // console.log(techData);
    // console.log(techData[0].sites);
    renderUL(office, techData[0].bureau);
    renderUL(sites, techData[0].sites);
    makeDragDrop();
}

// function renderAdd(name) {
//     console.log(techData);
// }

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
    makeDragDrop();
}

function makeDragDrop() {
    $('li').draggable({
        helper: "clone",
        revert: "invalid"
    }).click(function() {
        var b = parseInt($(this).width());
        $(this).css('width', b + 5);
    });
    $('td input').droppable({
        accept: "li",
        drop: function(e, u) {
            var a = u.helper.clone();
            console.log("INFO: Accepted: ", a.attr("class"));
            a.css("z-index", 1000);
            a.appendTo("#drop");
            a.attr('class', 'dropped').draggable({
                containment: "#drop"
            }).dblclick(function() {
                // Enabled Resize on element when double clicked
                $(this).resizable();
            });
        }
    });
    $(document).click(function() {
        if ($(".dropped").length) {
            // Disabled Resize on all elements when #drop
            $(".ui-resizable").resizable("destroy");
        }
    });
}

function calculer() {}

function resetForm() {
    
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

helpBtn.addEventListener('click', function() {});

calcBtn.addEventListener('click', calculer());

resetBtn.addEventListener('click', resetForm());