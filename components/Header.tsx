'use client';

import { useRouter } from 'next/navigation';
import { BiSearch } from 'react-icons/bi';
import { HiHome } from 'react-icons/hi';
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';
import { twMerge } from 'tailwind-merge';
import Button from './Button';
import useAuthModal from '@/hooks/useAuthModal';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useUser } from '@/hooks/useUser';
import { FaUserAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import usePlayer from '@/hooks/usePlayer';

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const player = usePlayer();
  const authModal = useAuthModal();
  const router = useRouter();

  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    player.reset();
    router.refresh();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged out!');
    }
  };

  return (
    <div
      className={twMerge(
        `h-fit bg-gradient-to-b from-emerald-800 p-6`,
        className
      )}
    >
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center rounded-full bg-black bg-opacity-75 p-2 transition hover:bg-opacity-100"
          >
            <IoMdArrowBack size={18} />
          </button>
          <button
            onClick={() => router.forward()}
            className="flex items-center justify-center rounded-full bg-black bg-opacity-75 p-2 transition hover:bg-opacity-100"
          >
            <IoMdArrowForward size={18} />
          </button>
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
          <button
            onClick={() => router.push('/')}
            className="rounded-full p-2 bg-white flex items-center justify-center transition hover:opacity-75"
          >
            <HiHome className="text-black" size={20} />
          </button>
          <button
            onClick={() => router.push('/search')}
            className="rounded-full p-2 bg-white flex items-center justify-center transition hover:opacity-75"
          >
            <BiSearch className="text-black" size={20} />
          </button>
        </div>
        <div className="flex justify-between items-center gap-x-4">
          {user ? (
            <div className="flex gap-x-4 items-center">
              <Button onClick={handleLogout} className="bg-white px-6 py-2">
                Logout
              </Button>
              <Button onClick={() => router.push('/account')}>
                <FaUserAlt className="text-white" size={20} />
              </Button>
            </div>
          ) : (
            <>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className="bg-transparent text-neutral-300 font-medium"
                >
                  Sign up
                </Button>
              </div>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className="bg-white px-6 py-2"
                >
                  Log in
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
