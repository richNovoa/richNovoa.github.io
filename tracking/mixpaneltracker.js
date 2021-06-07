/* This is a library of trackers for our mixpanel implementation
this code can be reused in other websites.
To implement add the following code to the header of the website:

mixpanel library with project tracker and

<script src="http://linktothisfile"></style>
*/

//Session Duration Tracker

  //Start
  mixpanel.time_event("Session Duration");
  //End
  window.addEventListener(`unload`, function() {
    mixpanel.set_config({api_transport: 'sendBeacon'});
    mixpanel.track('Session Duration');
    mixpanel.people.set({foo: 'bar'});
});


//Time On Page Tracker

  //Start
  mixpanel.time_event("Time on Page");
  let x = 1;
  //End
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

// Track links Tracker 

    let getLinkData = function(ele) { 
      return { type: $(ele).attr('type') } 
};
    mixpanel.track_links('a','Click on Link', getLinkData);
    mixpanel.track_links('input', 'Link clicked', getLinkData);

// Audio Tracker

// Let's wrap everything inside a function so variables are not defined as globals 
(function() {
    // This is gonna our percent buckets ( 25%-75% ) 
    var divisor = 25;
    // We're going to save our players status on this object. 
    var videos_status = {};
    // This is the funcion that is gonna handle the event sent by the player listeners 
    function eventHandler(e) {
        switch (e.type) {
            // This event type is sent everytime the player updated it's current time, 
            // We're using for the % of the video played. 
        case 'timeupdate':
            // Let's set the save the current player's video time in our status object 
            videos_status[e.target.id].current = Math.round(e.target.currentTime);
            // We just want to send the percent events once 
            var pct = Math.floor(100 * videos_status[e.target.id].current / e.target.duration);
            for (var j in videos_status[e.target.id]._progress_markers) {
                if (pct >= j && j > videos_status[e.target.id].greatest_marker) {
                    videos_status[e.target.id].greatest_marker = j;
                }
            }
            // current bucket hasn't been already sent to GA?, let's push it to GTM
            if (videos_status[e.target.id].greatest_marker && !videos_status[e.target.id]._progress_markers[videos_status[e.target.id].greatest_marker]) {
                videos_status[e.target.id]._progress_markers[videos_status[e.target.id].greatest_marker] = true;
                mixpanel.track('% Audio Played', {
                    'event': 'audio',
                    'eventCategory': 'HTML5 Audio',
                    'eventAction': videos_status[e.target.id].greatest_marker + '%',
                    // We are using sanitizing the current video src string, and getting just the video name part
                    'eventLabel': decodeURIComponent(e.target.currentSrc.split('/')[e.target.currentSrc.split('/').length - 1])
                });
            }
            break;
            // This event is fired when user's click on the play button
        case 'play':
            mixpanel.track('Played Audio', {
                'event': 'audio',
                'eventCategory': 'HTML5 Audio',
                'eventAction': 'Played Audio',
                'eventLabel': decodeURIComponent(e.target.currentSrc.split('/')[e.target.currentSrc.split('/').length - 1])
            });
            break;
            // This event is fied when user's click on the pause button
        case 'pause':
            mixpanel.track('Paused Audio',{
                'event': 'audio',
                'eventCategory': 'HTML5 Audio',
                'eventAction': 'Paused Audio',
                'eventLabel': decodeURIComponent(e.target.currentSrc.split('/')[e.target.currentSrc.split('/').length - 1]),
                'eventValue': videos_status[e.target.id].current
            });
            break;
            // If the user ends playing the video, an Finish video will be pushed ( This equals to % played = 100 )  
        case 'ended':
            mixpanel.track('Audio Played',{
                'event': 'audio',
                'eventCategory': 'HTML5 Audio',
                'eventAction': '100%',
                'eventLabel': decodeURIComponent(e.target.currentSrc.split('/')[e.target.currentSrc.split('/').length - 1])
            });
            break;
        default:
            break;
        }
    }
    // We need to configure the listeners
    // Let's grab all the the "video" objects on the current page     
    var videos = document.getElementsByTagName('audio');
    for (var i = 0; i < videos.length; i++) {
        // In order to have some id to reference in our status object, we are adding an id to the video objects
        // that don't have an id attribute. 
        var videoTagId;
        if (!videos[i].getAttribute('id')) {
            // Generate a random alphanumeric string to use is as the id
            videoTagId = 'html5_video_' + Math.random().toString(36).slice(2);
            videos[i].setAttribute('id', videoTagId);
        }// Current video has alredy a id attribute, then let's use it <img draggable="false" class="emoji" alt="?" src="https://s.w.org/images/core/emoji/2/svg/1f642.svg">
        else {
            videoTagId = videos[i].getAttribute('id');
        }
        // Video Status Object declaration  
        videos_status[videoTagId] = {};
        // We'll save the highest percent mark played by the user in the current video.
        videos_status[videoTagId].greatest_marker = 0;
        // Let's set the progress markers, so we can know afterwards which ones have been already sent.
        videos_status[videoTagId]._progress_markers = {};
        for (j = 0; j < 100; j++) {
            videos_status[videoTagId].progress_point = divisor * Math.floor(j / divisor);
            videos_status[videoTagId]._progress_markers[videos_status[videoTagId].progress_point] = false;
        }
        // On page DOM, all players currentTime is 0 
        videos_status[videoTagId].current = 0;
        // Now we're setting the event listeners. 
        videos[i].addEventListener("play", eventHandler, false);
        videos[i].addEventListener("pause", eventHandler, false);
        videos[i].addEventListener("ended", eventHandler, false);
        videos[i].addEventListener("timeupdate", eventHandler, false);
        videos[i].addEventListener("ended", eventHandler, false);
    }
});
 