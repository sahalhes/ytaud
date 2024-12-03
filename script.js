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
    event.target.setPlaybackRate(parseFloat(document.getElementById('speed').value));

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
    var videoId = url.split('v=')[1];
    if (videoId) {
        var ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition != -1) {
            videoId = videoId.substring(0, ampersandPosition);
        }
        return videoId;
    }
    return null;
}
