// Load YouTube IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var playerReady = false;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0', // Adjust for initialization
        width: '0',
        videoId: '',
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'showinfo': 0,
            'modestbranding': 1,
            'iv_load_policy': 3,
            'rel': 0,
            'enablejsapi': 1,
            'origin': window.location.origin
        },
        events: {
            'onReady': onPlayerReady,
            'onError': onPlayerError,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    console.log('Player is ready');
    playerReady = true;
    
    // Set initial playback speed
    var speedValue = document.getElementById('speed').value;
    event.target.setPlaybackRate(parseFloat(speedValue));
    
    // Event listeners for buttons
    document.getElementById('loadButton').addEventListener('click', function () {
        console.log("Load button clicked");
        var videoUrl = document.getElementById('videoUrl').value;
        var videoId = getYouTubeVideoId(videoUrl);
        console.log("Video ID: ", videoId);
        if (playerReady && videoId) {
            player.loadVideoById(videoId);
            console.log('Loaded video with ID:', videoId);
        } else {
            console.log('Invalid YouTube URL or player is not ready');
            alert('Invalid YouTube URL or player is not ready');
        }
    });

    document.getElementById('loadPlaylistButton').addEventListener('click', function () {
        console.log("Load playlist button clicked");
        var playlistUrl = document.getElementById('playlistUrl').value;
        var playlistId = getYouTubePlaylistId(playlistUrl);
        console.log("Playlist ID: ", playlistId);
        if (playerReady && playlistId) {
            player.loadPlaylist({
                list: playlistId,
                listType: 'playlist'
            });
            console.log('Loaded playlist with ID:', playlistId);
        } else {
            console.log('Invalid YouTube URL or player is not ready');
            alert('Invalid YouTube URL or player is not ready');
        }
    });

    // Pause/Play toggle button
    document.getElementById('pauseButton').addEventListener('click', function () {
        if (playerReady) {
            if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                player.pauseVideo();
                document.getElementById('pauseButton').textContent = 'Play'; // Change text to 'Play'
                console.log('Video paused');
            } else {
                player.playVideo();
                document.getElementById('pauseButton').textContent = 'Pause'; // Change text to 'Pause'
                console.log('Video playing');
            }
        }
    });

    // Speed control slider
    document.getElementById('speed').addEventListener('input', function () {
        if (playerReady) {
            var speed = parseFloat(this.value);
            player.setPlaybackRate(speed);  // Set the video playback speed
            console.log('Playback speed set to: ' + speed);
        }
    });

    // Skip Back button (-10s)
    document.getElementById('skipBackButton').addEventListener('click', function () {
        if (playerReady) {
            var currentTime = player.getCurrentTime();
            player.seekTo(currentTime - 10, true);
            console.log('Skipped back 10 seconds');
        }
    });

    // Skip Forward button (+10s)
    document.getElementById('skipForwardButton').addEventListener('click', function () {
        if (playerReady) {
            var currentTime = player.getCurrentTime();
            player.seekTo(currentTime + 10, true);
            console.log('Skipped forward 10 seconds');
        }
    });

    // Previous Video button
    document.getElementById('prevVideoButton').addEventListener('click', function () {
        if (playerReady) {
            player.previousVideo();
            console.log('Previous video');
        }
    });

    // Next Video button
    document.getElementById('nextVideoButton').addEventListener('click', function () {
        if (playerReady) {
            player.nextVideo();
            console.log('Next video');
        }
    });

    // Shuffle button
    document.getElementById('shuffleButton').addEventListener('click', function () {
        if (playerReady) {
            player.shufflePlaylist();
            console.log('Playlist shuffled');
        }
    });

    // Loop button
    document.getElementById('loopButton').addEventListener('click', function () {
        if (playerReady) {
            player.setLoop(true); // Set the loop flag to true
            console.log('Loop enabled');
        }
    });
}

// Handle player errors
function onPlayerError(event) {
    console.error('Error occurred in the YouTube player:', event.data);
    alert('An error occurred while trying to play the video. Please try again later or use a different video.');
}

function onPlayerStateChange(event) {
    // This feature can be used to react to changes in the player's state, such as when a video ends
}

function getYouTubePlaylistId(url) {
    var playlistId = url.split('list=')[1];
    if (playlistId) {
        var ampersandPosition = playlistId.indexOf('&');
        if (ampersandPosition != -1) {
            playlistId = playlistId.substring(0, ampersandPosition);
        }
        return playlistId;
    }
    return null;
}

function getYouTubeVideoId(url) {
    var videoId = null;

    // For Desktop URLs like https://www.youtube.com/watch?v=VIDEO_ID
    if (url.indexOf('youtube.com/watch?v=') > -1) {
        videoId = url.split('v=')[1];
        var ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition != -1) {
            videoId = videoId.substring(0, ampersandPosition);
        }
    }
    
    else if (url.indexOf('youtu.be/') > -1) {
        alert('Mobile YouTube links are blocked by YouTube api.Please try going to your browser settings and changing the "Desktop Site" option and try.');
        return null;
    }

    else if (url.indexOf('m.youtube.com/v/') > -1) {
        alert('Mobile YouTube links are blocked by YouTube api.Please try going to your browser settings and changing the "Desktop Site" option and try.');
        return null;
    }

    return videoId ? videoId : null;
}


