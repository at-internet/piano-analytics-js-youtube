class PAYoutubePlayer {
    constructor() {
        this.paCustomParams = {}
    }

    set params(params) {
        this.paCustomParams = params
    }

    set media(media) {
        this.videoMedia = media
    }

    onPlayerReady = (event) => {
        this.instanciatedPlayer = event.target

        var videoData = this.instanciatedPlayer.getVideoData();
        this.paCustomParams.av_content_id = videoData.video_id,
        this.paCustomParams.av_content = videoData.title,
        this.paCustomParams.av_content_duration = this.instanciatedPlayer.getDuration(),
        this.paCustomParams.av_broadcasting_type = videoData.isLive ? 'Live' : 'Clip',
        this.videoMedia.setProps(this.paCustomParams);

        this.instanciatedPlayer.playVideo();
        console.log(this.instanciatedPlayer.getPlayerState());
    }

    onPlayerStateChange = (event) => {
        var cursorPosition = this.instanciatedPlayer.getCurrentTime() * 1000;
        if (event.data === 1 && this.previousPlayerState == -1) {
            this.videoMedia.play(cursorPosition);
            this.videoMedia.playbackStart(cursorPosition);
        }
        if (event.data === 1 && this.previousPlayerState == 5) {
            this.videoMedia.playbackStart(cursorPosition);
        }
        if (event.data === 1 && this.previousPlayerState > 1) {
            this.videoMedia.playbackResumed(cursorPosition);
        }
        if (event.data === 2) {
            this.videoMedia.playbackPaused(cursorPosition);
        }
        if (event.data === 0) {
            this.videoMedia.playbackStopped(cursorPosition);
        }
        if (event.data === 3 && this.previousPlayerState != -1) {
            this.videoMedia.bufferStart(cursorPosition)
        }
        this.previousPlayerState = this.instanciatedPlayer.getPlayerState();
    }

    onError = (event) => {
        var errorCode;
        switch (event.data) {
            case 2:
                errorCode = "The request contains an invalid parameter value.";
                break;
            case 5:
                errorCode = "The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.";
                break;
            case 100:
                errorCode = "The video requested was not found.";
                break;
            case 101:
                errorCode = "The owner of the requested video does not allow it to be played in embedded players.";
                break;
            case 150:
                errorCode = "This error is the same as 101. It's just a 101 error in disguise!";
                break
        }
        this.videoMedia.error(errorCode, function(){}, {av_player_error : errorCode});
    }

    onPlaybackQualityChange = (event) => {
        this.videoMedia.quality(function(){}, {av_quality : event.data});
    }

    onPlaybackRateChange = (event) => {
        this.videoMedia.setPlaybackSpeed(event.data);
    }
}

const paYoutubeConnector = new PAYoutubePlayer();