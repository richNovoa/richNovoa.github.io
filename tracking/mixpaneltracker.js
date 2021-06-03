/* This is a library of trackers for our mixpanel implementation
this code can be reused in other websites.
To implement add the following code to the header of the website:

mixpanel library with project tracker and

<script src="http://linktothisfile"></style>
*/



/* Session Duration Tracker */

//Timestamp Session Duration Start
  mixpanel.time_event("Session Duration")
//sendBeacon Session Duration End
window.addEventListener(`unload`, function() {
  mixpanel.set_config({api_transport: 'sendBeacon'});
  mixpanel.track('Session Duration', {
    'store': locationID,
  });
  mixpanel.people.set({foo: 'bar'});
});


/* Time On Page Tracker */

//Timestamp Time on Page
  mixpanel.time_event("Time on Page")
let x = 1;
//Time on Page eventListener
  document.addEventListener(`visibilitychange`, function() {
    if (document.visibilityState === 'hidden') {  
        mixpanel.set_config({api_transport: 'sendBeacon'});
        mixpanel.track('Time on Page',{
          'counter': x,
        });
        mixpanel.people.set({foo: 'bar'});
        x++;
    } 
    else if (document.visibilityState === 'pagehide') {
        mixpanel.set_config({api_transport: 'sendBeacon'});
        mixpanel.track('Time on Page');
        mixpanel.people.set({foo: 'bar'});   
    }
    else if (document.visibilityState === 'visible') {
        mixpanel.time_event("Time on Page")
    }
  });

/* Track links Tracker */
var getLinkData = function(ele) {
  return { type: $(ele).attr('type')}
}
mixpanel.track_links('a','Click on Link', getLinkData);

  



