var express = require("express")
    , zombie = require("zombie")
    , path = require('path')
    , app = express();

app.configure(function() {
    app.use(express.static(path.join(__dirname, 'public')));
});

var retrieveCalendar = function(callback) {

    zombie.visit("http://ec.forexprostools.com", 
        function(err, browser, status) {
        var calendarData = [];
 
        // Grab the calendar table
        var dayEntry = {};
        var eventEntry = {};
        var trs = browser.querySelectorAll("#ecEventsTable tbody tr");
        for ( var i = 0; i < trs.length; i++) {
            var tr = trs.item(i);
            var trid = tr.getAttribute("id");

            if(trid == null){
                var daytds = tr.getElementsByTagName("td");
                var daytd = daytds.item(0);
                var daystr = daytd.innerHTML.trim();   

                if(i > 0){
                    calendarData.push(dayEntry);
                }    
                dayEntry = {
                    values : [],
                    day : daystr  
                };   
            }
            else if(trid.indexOf("eventRow") != -1){
                var eventtds = tr.getElementsByTagName("td");
                // time
                var time = eventtds.item(0).innerHTML.trim();
                // currency
    
                var curtitle = eventtds.item(1).innerHTML.trim();
                // impact
                var imp = eventtds.item(2).getAttribute("title");
                // event
                var evtnode = eventtds.item(3);
                var evt = "";
                if(evtnode != null){
                    evt = evtnode.innerHTML.trim();
                }
                // actual
                var actnode = eventtds.item(4);
                var act = "";
                if(actnode != null){
                    act = actnode.innerHTML.trim();
                }
                // forecast
                var forenode = eventtds.item(5);
                var fore = "";
                if(forenode != null){
                   fore = forenode.innerHTML.trim();
                }
                // previous
                var prevnode = eventtds.item(6);
                var prev = "";
                if(prevnode != null){
                   prev = prevnode.innerHTML.trim();
                }

                eventEntry = {
                    time : time,
                    currency : curtitle,
                    impact : imp,
                    event : evt,
                    actual : act,
                    forecast : fore,
                    previous : prev
                }
                dayEntry.values.push(eventEntry);
            } 
            if(i == trs.length-1)
            {
                calendarData.push(dayEntry);
            }       
        }
        callback(calendarData);
    });
}
 
app.get("/days", function(req, res) {
    retrieveCalendar(function(calendarData) {
        res.jsonp(calendarData);
    });
});

var ipaddr = process.env.HEROKU_INTERNAL_IP || "127.0.0.1";
var port = process.env.HEROKU_INTERNAL_PORT || "3000";

app.listen(port, ipaddr, function() {
    console.log('%s: Node server started on %s:%d ...', Date(Date.now()),
            ipaddr, port);

});