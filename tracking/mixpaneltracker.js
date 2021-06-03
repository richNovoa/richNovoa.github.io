

//Timestamp Session Duration Start
  mixpanel.time_event("Session Duration")

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
  
//sendBeacon Session Duration End
  window.addEventListener(`unload`, function() {
    mixpanel.set_config({api_transport: 'sendBeacon'});
    mixpanel.track('Session Duration');
    mixpanel.people.set({foo: 'bar'});
  });
