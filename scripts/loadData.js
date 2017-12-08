// Read name list into array
const names = "data/names.txt";
var reader = new FileReader();
reader.onload = function(event) {
    var contents = event.target.result;
    console.log("File contents: " + contents);
};

reader.onerror = function(event) {
    console.error("File could not be read! Code " + event.target.error.code);
};

reader.readAsText(file);

// if (window.File && window.FileReader && window.FileList && window.Blob) {
//     // Great success! All the File APIs are supported.
// } else {
//     alert('The File APIs are not fully supported in this browser.');
// }

// Output the name list to the welcome page
//let list = document.querySelector('#nameList');
// for(let i=0, len = list.length; i<len; i++) {
//     console.logo(listArray[i]);
// }


