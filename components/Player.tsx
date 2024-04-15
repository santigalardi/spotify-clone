'use client';

import useGetSongById from '@/hooks/useGetSongById';
import useLoadSongUrl from '@/hooks/useLoadSongUrl';
import usePlayer from '@/hooks/usePlayer';
import PlayerContent from './PlayerContent';

const Player = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);

  const songUrl = useLoadSongUrl(song!);

  if (!songUrl || !song || !player.activeId) return null;

  return (
    <div className="fixed bottom-0 bg-black w-full py-4 min-h-[100px] px-4">
      <PlayerContent song={song} songUrl={songUrl} />
    </div>
  );
};

export default Player;
