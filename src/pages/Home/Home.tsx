import React from 'react';
import { Button, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import DefaultLayout from 'src/layout/DefaultLayout'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            "& video": {
                height: '50vh',
                margin: theme.spacing(2)

            },
        },
        contr: {
            "& .MuiButton-label": {
                textTransform: 'capitalize'
            }
        }
    }),
);


export const Home: React.FC = () => {
    const classes = useStyles()

    // const [isPlay, setIsPlay] = React.useState(false);
    const streamVideoEl = React.useRef(null)
    const [cameraTrack, setCameraTrack] = React.useState<any>(null);

    const handleMultipleCamera = async () => {
        try {
            const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true })
            const MultiStreamsMixer: any = require('multistreamsmixer');
            const mixer = new MultiStreamsMixer([
                cameraStream,
                cameraStream,
                cameraStream,
                cameraStream,
            ]);
            mixer.frameInterval = 1;
            mixer.startDrawingFrames();
            const track = mixer.getMixedStream();
            setCameraTrack(track)
            const video: any = streamVideoEl.current;
            if ("srcObject" in video) {
                video.srcObject = mixer.getMixedStream();
            } else {
                //避免在新的浏览器中使用它，因为它正在被弃用。
                video.src = window.URL.createObjectURL(mixer.getMixedStream());
            }
            video.onloadedmetadata = function () {
                video.play();
            };
        } catch (error) {
            alert(error)
        }
    }



    const handleCompixVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true }).then(cameraStream => {
            setCameraTrack(cameraStream)
            const video: any = streamVideoEl.current;
            if ("srcObject" in video) {
                video.srcObject = cameraStream;
            } else {
                //避免在新的浏览器中使用它，因为它正在被弃用。
                video.src = window.URL.createObjectURL(cameraStream);
            }
            video.onloadedmetadata = function () {
                video.play();
            };
        })
    }
    const handleStopCompixVideo = () => {
        if (cameraTrack) {
            const Tracks = cameraTrack.getTracks()
            if (Array.isArray(Tracks)) {
                Tracks.forEach(track => {
                    track.stop()
                })
            } else {
                Tracks.stop()
            }
            setCameraTrack(null)
        }
    }
    const handleOpenAudio = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        });
        const mimeType = 'audio/webm';
        let chunks: any = [];
        if ('MediaRecorder' in window) {
            const recorder = new (window as any).MediaRecorder(stream, { type: mimeType });
            recorder.addEventListener('dataavailable', (event: any) => {
                if (typeof event.data === 'undefined') return;
                if (event.data.size === 0) return;
                chunks.push(event.data);
            });
            // recorder.addEventListener('stop', () => {
            //     const recording = new Blob(chunks, {
            //         type: mimeType
            //     });
            //     // renderRecording(recording, list);
            //     chunks = [];
            // });
        }


    }


    return <DefaultLayout>
        <Typography style={{ fontWeight: 'bold' }} variant="h3">Welcome to Recording Demo!</Typography>
        <br />
        <div className={classes.contr}>
            <Button style={{ margin: '10px' }} onClick={handleMultipleCamera} variant="contained">
                Open Multiple camera
            </Button>
            <Button style={{ margin: '10px' }} onClick={handleCompixVideo} variant="contained">
                Open camera
            </Button>
            <Button style={{ margin: '10px' }} onClick={handleStopCompixVideo} variant="contained">
                Close camera
            </Button>
            <Button style={{ margin: '10px' }} onClick={handleOpenAudio} variant="contained">
                recording Audio
            </Button>
            <Button style={{ margin: '10px' }} variant="contained">
                Download recording
            </Button>
            <Button style={{ margin: '10px' }} variant="contained">
                Download Audio Video and recording
            </Button>
        </div>
        <div>
            {cameraTrack ? <div>
                <video ref={streamVideoEl} autoPlay loop></video>
            </div> : null}
            <div className={classes.root}>
                <video src={process.env.REACT_APP_VIDEO_1_SRC} muted autoPlay loop></video>
                <video src={process.env.REACT_APP_VIDEO_2_SRC} muted autoPlay loop></video>
            </div>

        </div>




    </DefaultLayout>
};


export const HOME_URL = '/'