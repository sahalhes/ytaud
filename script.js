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
            'controls': 0,
            'showinfo': 0,
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

    document.getElementById('pauseButton').addEventListener('click', function () {
        togglePausePlay();
    });

    document.getElementById('skipBackButton').addEventListener('click', function () {
        skipTime(-10);
    });

    document.getElementById('skipForwardButton').addEventListener('click', function () {
        skipTime(10);
    });

    document.getElementById('speed').addEventListener('change', function () {
        if (playerReady) {
            player.setPlaybackRate(parseFloat(this.value));
            console.log('Playback rate changed to:', this.value);
        } else {
            console.log('Player is not ready');
            alert('Player is not ready');
        }
    });
    document.getElementById('loadPlaylistButton').addEventListener('click', function () {
        var playlistUrl = document.getElementById('playlistUrl').value;
        var playlistId = getYouTubePlaylistId(playlistUrl);
        if (playerReady && playlistId) {
            player.loadPlaylist({
                list: playlistId,
                listType: 'playlist'
            });
            player.setPlaybackQuality('small'); //Youtube api streams both video and audio, so just in case video data is used then let it use the least amount
            console.log('Loaded playlist with ID:', playlistId);
        } else {
            console.log('Invalid YouTube URL or player is not ready');
            alert('Invalid YouTube URL or player is not ready');
        }
    });
    document.getElementById('nextVideoButton').addEventListener('click', function () {
        if (playerReady) {
            player.nextVideo();
            console.log('Playing next video in the playlist');
        } else {
            console.log('Player is not ready');
            alert('Player is not ready');
        }
    });
    
    document.getElementById('prevVideoButton').addEventListener('click', function () {
        if (playerReady) {
            player.previousVideo();
            console.log('Playing previous video in the playlist');
        } else {
            console.log('Player is not ready');
            alert('Player is not ready');
        }
    });
}

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