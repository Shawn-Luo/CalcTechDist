// Created By Seng on 27/08/2016
// Please use at your own risk, customization are welcomed to suit your usage.
// Please refer to Google Distance Matrix API for more information:
// Link: https://developers.google.com/maps/documentation/distance-matrix/

// NOTE: Google Distance Matrix API only accepts 100,000 daily requests for free users.
// Please sign up for premium plan if you are heavy user.
// Read More: https://developers.google.com/maps/premium/usage-limits

// Comments or improvements of the code are welcome, you may contact me via:
// Email: admin@sengcomputerservices.com
// Tag Me: @Seng in discuss.erpnext.com

// Change "Travel Table" to your table DocType name and "oriaddr" or "destaddr" to your field name in the table DocType.
frappe.ui.form.on("Travel Table", "oriaddr", function(frm, cdt, cdn){
    var service = new google.maps.DistanceMatrixService();
    var d = locals[cdt][cdn];
    var originAddress = d.oriaddr; 
    var destAddress = d.destaddr;

    frappe.model.set_value(d.doctype, d.name, "distancetravelled", ""); // Clearing the distance travelled field to avoid appearing of previous value
    getDistance(originAddress, destAddress, service, d, frm);
});

frappe.ui.form.on("Travel Table", "destaddr", function(frm, cdt, cdn){
    var service = new google.maps.DistanceMatrixService();
    var d = locals[cdt][cdn];
    var originAddress = d.oriaddr; 
    var destAddress = d.destaddr;
    
    frappe.model.set_value(d.doctype, d.name, "distancetravelled", ""); // Clearing the distance travelled field to avoid appearing of previous value
    getDistance(originAddress, destAddress, service, d, frm);
});

// Change "Campaign" to your own DocType and "recompute" to your button field name
// This buttons allow  the user to manually recompute the distance upon remove of a row in the table.
frappe.ui.form.on("Campaign", "recompute", function(frm, cdt, cdn){
    calcTotalDistance(frm)
});

// Google Distance Matrix API that calculate the distance betwen the origin and destination address
function getDistance(originAddress, destAddress, service, d, frm) {
  var distance = 0;
  var total = 0;
    service.getDistanceMatrix({
        origins: [originAddress],
        destinations: [destAddress],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
    }, function (response, status) {
        if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
            distance = response.rows[0].elements[0].distance.value; // Numbers return from the API are in Meters
            distance = distance / 1000; // Converting Meters to Kilometers, or you can remove it to leave it as meters or conver to miles etc
            frappe.model.set_value(d.doctype, d.name, "distancetravelled", distance); // Set the distance into the table, change "distancetravelled" to your table's field name.
            calcTotalDistance(frm);
        } else {
            calcTotalDistance(frm);
            alert("Unable To Find Distance Via Road, Please Check The Address."); // Pop up an error if address not found
        }
      });
}

// This function calcuates the total distance in the table and return it to a field
// Further enhancement can be done here such as calculating the pay on distance travelled on claim
function calcTotalDistance(frm) {
    var total = 0;
        frm.doc.travellocations.forEach(function(d) { total += d.distancetravelled; });
        total = total + " KM";
        frm.set_value('totaldistance', total);
}