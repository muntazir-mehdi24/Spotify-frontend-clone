import { createContext, useEffect, useState, useRef } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (prop) => {
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    const [track, setTrack] = useState(songsData[0]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: { second: 0, minute: 0 },
        totalTime: { second: 0, minute: 0 },
    });

    const play = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setPlayStatus(true);
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setPlayStatus(false);
        }
    };
      
    const playWithId = async (id) => {
        await setTrack(songsData[id]);
        await audioRef.current.play();
        setPlayStatus(true);
    };

    const previous = async () => {
        if (track.id>0) {
            await setTrack(songsData[track.id-1]);
            await audioRef.current.play();
            setPlayStatus(true);
        }
    };

    const next = async () => {
        if (track.id < songsData.length) {
            await setTrack(songsData[track.id+1]);
            await audioRef.current.play();
            setPlayStatus(true);
        }
    };

    const seekSong = async (e) => {
        audioRef.current.currentTime =((e.nativeEvent.offsetX / seekBg.current.offsetWidth)*audioRef.current.duration)
    };

    useEffect(() => {
        const updateTime = () => {
            if (audioRef.current) {
                seekBar.current.style.width = (Math.floor(audioRef.current.currentTime/audioRef.current.duration*100))+"%";
                setTime({
                    currentTime: {
                        second: Math.floor(audioRef.current.currentTime % 60) || 0,
                        minute: Math.floor(audioRef.current.currentTime / 60) || 0,
                    },
                    totalTime: {
                        second: Math.floor(audioRef.current.duration % 60) || 0,
                        minute: Math.floor(audioRef.current.duration / 60) || 0,
                    },
                });
            }
        };

        if (audioRef.current) {
            audioRef.current.addEventListener("timeupdate", updateTime);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener("timeupdate", updateTime);
            }
        };
    }, []);

    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track, setTrack,
        playStatus, setPlayStatus,
        time, setTime,
        play, pause,
        playWithId,
        previous,
        next,
        seekSong
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {prop.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;
                                               