"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Profile from '@components/Profile';

const Loading = () => {
  return <h2>🌀 Loading...</h2>;
}

const UserProfile = ({ params }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [ posts, setPosts ] = useState([]);
    const [ user, setUser ] = useState({});

    const fetchPosts = async (userId) => {
      if (userId) {
        const response = await fetch(`/api/users/${userId}/posts`);
        const data = await response.json();
        setPosts(data);

        return data;
      }

      return [];
    }

    const fetchUser = async (userId) => {
      if (userId) {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUser(data);

        return data;
      }

      return {};
    }

    const handleTagClick = (tag) => {
      router.push(`/?search=${tag}`);
    }

    useEffect(() => {
      if (params.id === session?.user?.id) {
        // redirect to My profile
        router.push('/profile');
      } else {
        fetchUser(params.id);
        fetchPosts(params.id);
      }
    }, [params.id]);

  return (
    <Suspense fallback={<Loading />}>
      <Profile 
          name={user.username}
          desc={`Viewing ${user.username} profile page`}
          data={posts}
          handleTagClick={handleTagClick}
      />
    </Suspense>
  )
}

export default UserProfile