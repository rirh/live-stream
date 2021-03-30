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

const MultiStreamsMixer: any = require('multistreamsmixer');

export const Home: React.FC = () => {
    const classes = useStyles()

    // const [isPlay, setIsPlay] = React.useState(false);
    const streamVideoEl = React.useRef(null)
    const [cameraTrack, setCameraTrack] = React.useState<any>(null);
    let buffer: any = []
    const [mediaRecoder, setMediaRecoder] = React.useState<any>(null);

    const handleMultipleCamera = async () => {
        handleStopCompixVideo()
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
            const track = mixer.getMixedStream();
            setCameraTrack([
                track,
                cameraStream,
                cameraStream,
                cameraStream,
                cameraStream,])
            const video: any = streamVideoEl.current;
            if ("srcObject" in video) {
                video.srcObject = mixer.getMixedStream();
            } else {
                //避免在新的浏览器中使用它，因为它正在被弃用。
                video.src = (window as any).URL.createObjectURL(mixer.getMixedStream());
            }
            video.onloadedmetadata = function () {
                video.play();
            };
        } catch (error) {
            alert(error)
        }
    }

    const handleCompixVideo = () => {
        handleStopCompixVideo()
        navigator.mediaDevices.getUserMedia({ video: true }).then(cameraStream => {
            setCameraTrack([cameraStream])
            const video: any = streamVideoEl.current;
            if ("srcObject" in video) {
                video.srcObject = cameraStream;
            } else {
                //避免在新的浏览器中使用它，因为它正在被弃用。
                video.src = (window as any).URL.createObjectURL(cameraStream);
            }
            video.onloadedmetadata = function () {
                video.play();
            };
        })
    }
    const handleStopCompixVideo = () => {
        if (cameraTrack) {
            cameraTrack.forEach((element: any) => {
                const Tracks = element.getTracks()

                if (Array.isArray(Tracks)) {
                    Tracks.forEach(track => {

                        track.stop()
                    })
                } else {
                    Tracks.stop()
                }
            });

            setCameraTrack(null)
            if (buffer.length) {
                mediaRecoder.stop();
                setMediaRecoder(null)
            }
        }
    }

    const handleGetMixedCameraAndScreen = async () => {
        handleStopCompixVideo()
        let screenStream;
        try {
            if ((navigator as any).getDisplayMedia) {
                screenStream = await (navigator as any)?.getDisplayMedia({ video: true })
            } else if ((navigator as any).mediaDevices?.getDisplayMedia) {
                screenStream = await (navigator as any).mediaDevices?.getDisplayMedia({ video: true })
            } else {
                alert("getDisplayMedia API is not supported by this browser.");
            }
            const cameraStream = await navigator.mediaDevices.getUserMedia({
                video: true,
            })
            const mixer = new MultiStreamsMixer([screenStream, cameraStream]);
            mixer.frameInterval = 1;
            mixer.startDrawingFrames();
            const track = mixer.getMixedStream();
            setCameraTrack([track, cameraStream])
            const video: any = streamVideoEl.current;
            if ("srcObject" in video) {
                video.srcObject = mixer.getMixedStream();
            } else {
                //避免在新的浏览器中使用它，因为它正在被弃用。
                video.src = (window as any).URL.createObjectURL(mixer.getMixedStream());
            }
            video.onloadedmetadata = function () {
                video.play();
            };
        } catch (error) {
            alert(error)
        }

    }
    const handleReadingStream = (mediaStream: any) => {
        var options = { mimeType: 'video/webm;codecs=vp8' };
        if (!(window as any).MediaRecorder.isTypeSupported(options.mimeType)) {
            console.log('不支持' + options.mimeType);
            return;
        }
        try {
            const mediaRecoder = new (window as any).MediaRecorder(mediaStream, options);
            setMediaRecoder(mediaRecoder)
            mediaRecoder.ondataavailable = (event: any) => {
                if (event?.data?.size > 0) {
                    buffer.push(event.data)
                    console.log(buffer)

                }
            };
            // 开始录制，设置录制时间片为10ms(每10s触发一次ondataavilable事件)
            mediaRecoder.start(10);
        } catch (e) {
            console.log('创建(window as any).MediaRecorder失败!');
        }
    }
    const handleDownloadStream = () => {
        var blob = new Blob(buffer, { type: 'video/webm' });
        // 根据缓存数据生成url
        var url = window.URL.createObjectURL(blob);
        // 创建一个a标签，通过a标签指向url来下载
        var a = document.createElement('a');
        a.href = url;
        a.style.display = 'none'; // 不显示a标签
        a.download = 'demo.webm'; // 下载的文件名
        a.click(); // 调用a标签的点击事件进行下载
        buffer = []
    }

    const handleOpenAudio = async () => {
        handleStopCompixVideo()
        const microphoneStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        // const cameraStream = await navigator.mediaDevices.getUserMedia({
        //     video: true,
        // })
        const mixer = new MultiStreamsMixer([microphoneStream]);
        mixer.frameInterval = 1;
        mixer.startDrawingFrames();
        const track = mixer.getMixedStream();
        setCameraTrack([track, microphoneStream])
        handleReadingStream(microphoneStream)
        const video: any = streamVideoEl.current;
        if ("srcObject" in video) {
            video.srcObject = mixer.getMixedStream();
        } else {
            //避免在新的浏览器中使用它，因为它正在被弃用。
            video.src = (window as any).URL.createObjectURL(mixer.getMixedStream());
        }
        video.onloadedmetadata = function () {
            video.play();
        };
    }


    return <DefaultLayout>
        <Typography style={{ fontWeight: 'bold' }} variant="h3">Welcome To Demo!</Typography>
        <br />
        <div className={classes.contr}>
            <Button style={{ margin: '10px' }} onClick={handleCompixVideo} variant="contained">
                Open camera
            </Button>
            <Button style={{ margin: '10px' }} onClick={handleMultipleCamera} variant="contained">
                Open Multiple camera
            </Button>
            <Button style={{ margin: '10px' }} onClick={handleGetMixedCameraAndScreen} variant="contained">
                Open Mixed Camera And Screen
            </Button>
            <Button style={{ margin: '10px' }} onClick={handleOpenAudio} variant="contained">
                Open Mixed recording Audio And Screen
            </Button>
            <Button style={{ margin: '10px' }} onClick={handleStopCompixVideo} variant="contained">
                Close camera
            </Button>
            {
                buffer.length ? <Button style={{ margin: '10px' }} onClick={handleDownloadStream} variant="contained">
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