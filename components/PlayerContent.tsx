'use client';

import { useEffect, useState, use, useRef } from 'react';
import { Song } from '@/types';
import { BsPauseFill, BsPlayFill } from 'react-icons/bs';
import { AiFillStepBackward, AiFillStepForward } from 'react-icons/ai';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';
import { Howl } from 'howler';
import usePlayer from '@/hooks/usePlayer';
import MediaItem from './MediaItem';
import LikeButton from './LikeButton';
import Slider from './Slider';

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // Progress in seconds
  const soundRef = useRef<Howl | null>(null);
  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }

    player.setId(nextSong);
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(previousSong);
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    soundRef.current?.volume(value);
  };
  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(event.target.value, 10);
    setProgress(newProgress);
    soundRef.current?.seek(newProgress);
  };

  useEffect(() => {
    soundRef.current = new Howl({
      src: [songUrl],
      autoplay: true,
      volume: volume,
      onplay: () => setIsPlaying(true),
      onend: () => {
        setIsPlaying(false);
        onPlayNext();
      },
      onpause: () => setIsPlaying(false),
      format: ['mp3'],
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songUrl]);

  useEffect(() => {
    const updateProgress = () => {
      const seek = soundRef.current?.seek() || 0;
      setProgress(seek);
      requestAnimationFrame(updateProgress);
    };

    if (isPlaying) {
      requestAnimationFrame(updateProgress);
    }
  }, [isPlaying]);

  const handlePlay = () => {
    if (!isPlaying) {
      soundRef.current?.play();
    } else {
      soundRef.current?.pause();
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setVolume(0);
    } else {
      setVolume(1);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="flex w-full justify-start">
        <div className="flex items-center gap-x-4">
          <MediaItem data={song} />
          <LikeButton songId={song.id} />
        </div>
      </div>
      <div className="flex md:hidden col-auto w-full justify-end items-center">
        <div
          onClick={handlePlay}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer"
        >
          <Icon size={30} className="text-black" />
        </div>
      </div>
      <div className="hidden h-full md:flex flex-col justify-center items-center gap-y-2">
        <div className="h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-6">
          <AiFillStepBackward
            onClick={onPlayPrevious}
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
          <div
            onClick={handlePlay}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer hover:bg-green-500 transition"
          >
            <Icon size={30} className="text-black" />
          </div>
          <AiFillStepForward
            onClick={onPlayNext}
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
        </div>
        <input
          type="range"
          min={0}
          max={soundRef.current?.duration() || 0}
          value={progress}
          onChange={handleProgressChange}
          className="w-full flex-1 accent-white hover:accent-neutral-200 h-1 rounded-lg"
        />
      </div>
      <div className="hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon
            onClick={toggleMute}
            className="cursor-pointer"
            size={34}
          />
          <Slider value={volume} onChange={handleVolumeChange} />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
