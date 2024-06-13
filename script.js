// Load YouTube IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Replace the 'player' div with an <iframe> and YouTube player.
var player;
var playerReady = false;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: '',
        playerVars: {
            'autoplay': 1,
            'controls': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onError': onPlayerError
        }
    });
}

function onPlayerReady(event) {
    console.log('Player is ready');
    playerReady = true;
    event.target.setPlaybackRate(parseFloat(document.getElementById('speed').value));
}

function onPlayerError(event) {
    console.error('Error occurred in the YouTube player:', event.data);
    alert('An error occurred while trying to play the video. Please try again later or use a different video.');
}

// Load the audio when the button is clicked
document.getElementById('loadButton').addEventListener('click', function () {
    var videoUrl = document.getElementById('videoUrl').value;
    var videoId = getYouTubeVideoId(videoUrl);
    if (playerReady && videoId) {
        player.loadVideoById(videoId);
        console.log('Loaded video with ID:', videoId);
    } else {
        console.log('Invalid YouTube URL or player is not ready');
        alert('Invalid YouTube URL or player is not ready');
    }
});

// Pause or play the audio when the button is clicked
document.getElementById('pauseButton').addEventListener('click', function () {
    togglePausePlay();
});

// Skip back 10 seconds
document.getElementById('skipBackButton').addEventListener('click', function () {
    skipTime(-10);
});

// Skip forward 10 seconds
document.getElementById('skipForwardButton').addEventListener('click', function () {
    skipTime(10);
});

// Change playback speed when a new speed is selected
document.getElementById('speed').addEventListener('change', function () {
    if (playerReady) {
        player.setPlaybackRate(parseFloat(this.value));
        console.log('Playback rate changed to:', this.value);
    } else {
        console.log('Player is not ready');
        alert('Player is not ready');
    }
});

// Keyboard controls for space (pause/play), right arrow (forward 10s), and left arrow (backward 10s)
document.addEventListener('keydown', function (event) {
    if (!playerReady) return;

    switch (event.code) {
        case 'Space':
            event.preventDefault();
            togglePausePlay();
            break;
        case 'ArrowRight':
            skipTime(10);
            break;
        case 'ArrowLeft':
            skipTime(-10);
            break;
    }
});

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

function togglePausePlay() {
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
        console.log('Paused video');
    } else if (player.getPlayerState() === YT.PlayerState.PAUSED) {
        player.playVideo();
        console.log('Resumed video');
    }
}

function skipTime(seconds) {
    player.seekTo(Math.max(0, player.getCurrentTime() + seconds), true);
    console.log(`Skipped ${seconds > 0 ? 'forward' : 'backward'} ${Math.abs(seconds)} seconds`);
}
