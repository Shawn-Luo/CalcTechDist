let file = "./data/nameList.txt";
let listTech = [];
let tech = {
	name: '', 
	bureau: [],
	sites: []
};

class Technician {
	constructor(name, bureau, sites) {
		this.name = name;
		this.bureau = bureau;
		this.sites = sites;
	}
}

function readTxtFile(file)
{
    let txtFile = new XMLHttpRequest();
    txtFile.open("GET", file, false);
    txtFile.onreadystatechange = function ()
    {
        if(txtFile.readyState === 4)
        {
            if(txtFile.status === 200 || txtFile.status == 0)
            {
                var allText = txtFile.responseText;
                alert(allText);
            }
        }
    }
    txtFile.send(null);
}