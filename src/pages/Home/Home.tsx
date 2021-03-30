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
        title: {
            fontWeight: 'bold'
        },
        btn: {
            margin: '10px'
        },
        contr: {
            "& .MuiButton-label": {
                textTransform: 'capitalize'
            }
        }
    }),
);

const MultiStreamsMixer: any = require('multistreamsmixer');

export const Home: React.FC = () => {
    const classes = useStyles()

    // const [isPlay, setIsPlay] = React.useState(false);
    const streamVideoEl = React.useRef<HTMLVideoElement>(null)
    const [cameraTrack, setCameraTrack] = React.useState<MediaStream[]>([]);
    const [buffer, setBuffer] = React.useState<Buffer[]>([]);
    const [mediaRecoder, setMediaRecoder] = React.useState<any>();

    const setVideoSteram = (stream: MediaStream) => {
        const video = streamVideoEl.current;
        if (video) {
            video.srcObject = stream
            try {
                video.src = window?.URL?.createObjectURL(stream);
            } catch (error) { console.log(error) }
            video.onloadedmetadata = function () {
                video.play();
            };
        }
    }

    const handleMultipleCamera = async () => {
        handleCloseAllStream()
        try {
            const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true })
            const mixer = new MultiStreamsMixer([
                cameraStream,
                cameraStream,
                cameraStream,
                cameraStream,
            ]);
            mixer.frameInterval = 1;
            mixer.startDrawingFrames();
            const mixedStream = mixer.getMixedStream();
            setCameraTrack([
                mixedStream,
                cameraStream,
                cameraStream,
                cameraStream,
                cameraStream,])
            setVideoSteram(mixedStream)

        } catch (error) {
            alert(error)
        }
    }

    const handleCompixVideo = () => {
        handleCloseAllStream()
        navigator.mediaDevices.getUserMedia({ video: true }).then(cameraStream => {
            setCameraTrack([cameraStream])
            setVideoSteram(cameraStream)
        })
    }

    const stopRecoder = () => {
        if (buffer.length) {
            mediaRecoder.stop();
            setMediaRecoder(null)
        }
    }

    const handleCloseAllStream = () => {
        if (cameraTrack) {
            cameraTrack.forEach((element) => {
                const Tracks = element.getTracks()
                if (Array.isArray(Tracks)) {
                    Tracks.forEach(track => {
                        track.stop()
                    })
                } else {
                    (Tracks as MediaStreamTrack).stop()
                }
            });
            setCameraTrack([])
            stopRecoder()
        }
    }


    const handleMixedCameraAndScreen = async () => {
        handleCloseAllStream()
        let screenStream;
        try {
            //@ts-ignore
            if (navigator.getDisplayMedia) {
                //@ts-ignore
                screenStream = await navigator?.getDisplayMedia({ video: true })
                //@ts-ignore
            } else if (navigator.mediaDevices?.getDisplayMedia) {
                //@ts-ignore
                screenStream = await navigator.mediaDevices?.getDisplayMedia({ video: true })
            } else {
                alert("getDisplayMedia API is not supported by this browser.");
            }
            const cameraStream = await navigator.mediaDevices.getUserMedia({
                video: true,
            })
            const mixer = new MultiStreamsMixer([screenStream, cameraStream]);
            mixer.frameInterval = 1;
            mixer.startDrawingFrames();
            const mixedStream = mixer.getMixedStream();
            setCameraTrack([mixedStream, cameraStream])
            setVideoSteram(mixedStream)
        } catch (error) {
            alert(error)
        }

    }
    const handleReadingStream = (mediaStream: any) => {
        var options = { mimeType: 'video/webm;codecs=vp8' };
        // @ts-ignore
        if (!window.MediaRecorder.isTypeSupported(options.mimeType)) {
            console.log('Not support' + options.mimeType);
        }
        try {
            // @ts-ignore
            const mediaRecoder = new window.MediaRecorder(mediaStream, options);
            setMediaRecoder(mediaRecoder)
            mediaRecoder.ondataavailable = (event: any) => {
                if (event?.data?.size > 0) {
                    setBuffer([...buffer, event.data])
                }
            };
            // 开始录制，设置录制时间片为10ms(每10s触发一次ondataavilable事件)
            mediaRecoder.start(10);
        } catch (e) {
            console.log('Create MediaRecorder faild!');
        }
    }
    const handleDownloadStream = () => {
        console.log(buffer)

        var blob = new Blob(buffer);
        // 根据缓存数据生成url
        var url = window.URL.createObjectURL(blob);
        // 创建一个a标签，通过a标签指向url来下载
        var a = document.createElement('a');
        a.href = url;
        a.style.display = 'none'; // 不显示a标签
        a.download = 'demo.mp4'; // 下载的文件名
        a.click(); // 调用a标签的点击事件进行下载
        setBuffer([])
    }

    const handleMixedCameraAndAudio = async () => {
        handleCloseAllStream()
        const microphoneStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        // Another: mixed one audio stream and video stream 
        // const cameraStream = await navigator.mediaDevices.getUserMedia({
        //     video: true,
        // })
        const mixer = new MultiStreamsMixer([microphoneStream]);
        mixer.frameInterval = 1;
        mixer.startDrawingFrames();
        const mixedStream = mixer.getMixedStream();
        setCameraTrack([mixedStream, microphoneStream])
        handleReadingStream(microphoneStream)
        setVideoSteram(mixedStream)

    }


    return <DefaultLayout>
        <Typography className={classes.title} variant="h3">Welcome To Demo!</Typography>
        <br />
        <div className={classes.contr}>
            <Button className={classes.btn} onClick={handleCompixVideo} variant="contained">
                Open camera
            </Button>
            <Button className={classes.btn} onClick={handleMultipleCamera} variant="contained">
                Open Multiple camera
            </Button>
            <Button className={classes.btn} onClick={handleMixedCameraAndScreen} variant="contained">
                Open Mixed Camera And Screen
            </Button>
            <Button className={classes.btn} onClick={handleMixedCameraAndAudio} variant="contained">
                Open Mixed recording Audio And Screen
            </Button>
            <Button className={classes.btn} onClick={handleCloseAllStream} variant="contained">
                Close camera
            </Button>
            {
                buffer.length ? <Button className={classes.btn} onClick={handleDownloadStream} variant="contained">
                    Download Audio Video and recording
                </Button> : null
            }

        </div>
        <div>
            {cameraTrack ? <div>
                <video ref={streamVideoEl} autoPlay loop></video>
            </div> : null}
        </div>
    </DefaultLayout>
};

export const HOME_URL = '/'