import { useSocket } from '../Context/SocketContext';
import  { useCallback, useEffect, useState } from 'react'
import ReactPlayer from "react-player";
import peer from '../Service/peer';

import { PhoneForwarded, PhoneCall, PhoneOff, Mic, MicOff, Camera, CameraOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Room = () => {
    const socket: any = useSocket(); 
    const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
    const [myStream, setMyStream] = useState<MediaStream | undefined>();
    const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>();
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [isCameraOff, setIsCameraOff] = useState<boolean>(false);
    const navigate = useNavigate();

    const toggleCamera = () => {
        if (myStream) {
            myStream.getVideoTracks().forEach((track: MediaStreamTrack) => {
                track.enabled = !track.enabled;
            });
            setIsCameraOff(prevState => !prevState);
        }
    };
    
    const toggleMute = () => {
        setIsMuted(prevState => !prevState);
    };

    const handleEndCall = () => {
        if (socket) {
            socket.emit("call:ended", { to: remoteSocketId });
            socket.emit("call:ended", { to: socket.id });
        }
        setRemoteSocketId(null);
        setMyStream(undefined);
        setRemoteStream(undefined);
        navigate('/');
    };

    useEffect(() => {

    }, [handleEndCall])


    const handleUserJoined = useCallback(({ email, id }:{ email: string, id: any }) => {
        console.log(`Email ${email} joined room`);
        setRemoteSocketId(id);
    }, []);

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        const offer = await peer.getOffer();
        socket?.emit("user:call", { to: remoteSocketId, offer, isCameraOff });
        
        setMyStream(stream);
    }, [remoteSocketId, socket, isCameraOff]);
    

    const handleIncommingCall = useCallback(
        async ({ from, offer }:{ from: any, offer: any }) => {
            setRemoteSocketId(from);
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setMyStream(stream);
            console.log(`Incoming Call`, from, offer);
            const ans = await peer.getAnswer(offer);
            setIsCameraOff(isCameraOff);     
            socket?.emit("call:accepted", { to: from, ans });
        },
        [socket]
    );

    const sendStreams = useCallback(() => {
        if (myStream) {
            for (const track of myStream.getTracks()) {
                peer.peer?.addTrack(track, myStream);
            }
        }
    }, [myStream]);
    

    const handleCallAccepted = useCallback(
        ({  ans }: { from: string, ans: any }) => {
            peer.setLocalDescription(ans);
            console.log("Call Accepted!");
            sendStreams();
        },
        [sendStreams]
    );

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket?.emit("peer:nego:needed", { offer, to: remoteSocketId });
    }, [remoteSocketId, socket]);

    useEffect(() => {
        peer.peer?.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
            peer.peer?.removeEventListener("negotiationneeded", handleNegoNeeded);
        };
    }, [handleNegoNeeded]);

    const handleNegoNeedIncomming = useCallback(
        async ({ from, offer }: { from: string, offer: any }) => {
            const ans = await peer.getAnswer(offer);
            socket?.emit("peer:nego:done", { to: from, ans });
        },
        [socket]
    );

    const handleNegoNeedFinal = useCallback(async ({ ans }: { ans: any }) => {
        await peer.setLocalDescription(ans);
    }, []);

    useEffect(() => {
        peer.peer?.addEventListener("track", async (ev) => {
            const remoteStream = ev.streams;
            console.log("GOT TRACKS!!");
            setRemoteStream(remoteStream[0]);
        });
    }, []);

    useEffect(() => {
        socket?.on("user:joined", handleUserJoined);
        socket?.on("incomming:call", handleIncommingCall);
        socket?.on("call:accepted", handleCallAccepted);
        socket?.on("peer:nego:needed", handleNegoNeedIncomming);
        socket?.on("peer:nego:final", handleNegoNeedFinal);

        return () => {
            socket?.off("user:joined", handleUserJoined);
            socket?.off("incomming:call", handleIncommingCall);
            socket?.off("call:accepted", handleCallAccepted);
            socket?.off("peer:nego:needed", handleNegoNeedIncomming);
            socket?.off("peer:nego:final", handleNegoNeedFinal);
        };
    }, [
        socket,
        handleUserJoined,
        handleIncommingCall,
        handleCallAccepted,
        handleNegoNeedIncomming,
        handleNegoNeedFinal,
    ]);



    return (
        <div className="flex flex-col items-center min-h-screen bg-black text-white text-sm bg-gradient-to-tr from-gray-900 to-gray-700">

        <h4 className="mb-4">{remoteSocketId ? "Connected" : "No one in room"}</h4>
    
        <div className="flex flex-wrap justify-center w-full mb-4 space-y-2 md:space-y-0 md:space-x-2">
            {myStream &&
                <button onClick={sendStreams} className="px-4 py-2">
                    <PhoneCall /> Accept
                </button>
            }
    
            {remoteSocketId &&
                <button onClick={handleCallUser} className="px-4 py-2">
                    <PhoneForwarded /> Call
                </button>
            }
        </div>
    
        <div className="flex flex-col md:flex-row items-center justify-center mb-4">
            {remoteStream && (
                <div className="mr-4 mb-4 md:mb-0 md:w-1/2">

                    <div className="">
                        <div className=''>
                            <ReactPlayer
                                playing
                                muted={isMuted}
                                height=""
                                width="auto"
                                url={remoteStream}
                                className="w-6/12"
                            />
                            <br />
                              <div className="justify-items-end ">
                                
                            <div className='flex space-x-2'>
                                <button onClick={toggleMute} className="">
                                    {isMuted ? <MicOff /> : <Mic />}
                                </button>
                                <button onClick={handleEndCall} className="">
                                    <PhoneOff />
                                </button>
                                {myStream && (
                                    <button onClick={toggleCamera} className="">
                                        {isCameraOff ? <CameraOff /> : <Camera/>} 
                                    </button>
                                )}
                            </div>
                        </div>
                        </div>
                        {myStream && (
                <div className=''>
                    <div className="mt-4 md flex justify-end space-x-2">
                        <h1 className="text-sm mt">You</h1>
                        <ReactPlayer
                            playing
                            muted={isMuted}
                            height="100px"
                            width="auto"
                            url={myStream}
                            className=""
                        />
                    </div>
                </div>
            )}
                       
                    
                      
                    </div>
                </div>
            )}
    
         
    
            {isCameraOff && remoteStream && (
                <div className='flex flex-col mr-4'>
                    <CameraOff />
                </div>
            )}
        </div>
    </div>
    
    
    );
};
export default Room