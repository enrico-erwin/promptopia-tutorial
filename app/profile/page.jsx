"use client";

import {useState, useEffect} from 'react';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';

import Profile from '@components/Profile';

const MyProfile = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [ posts, setPosts ] = useState([]);

    const fetchPosts = async (userId) => {
      if (userId) {
        const response = await fetch(`api/users/${userId}/posts`);
        const data = await response.json();
        setPosts(data);

        return data;
      }

      return [];
    }

    const handleEdit = (post) => {
      router.push(`update-prompt?id=${post._id}`);
    }

    const handleDelete = async (post) => {
      const hasConfirmed = confirm('Are you sure you want to delete this prompt?');

      if (hasConfirmed) {
        try {
          await fetch(`api/prompt/${post._id.toString()}`, {method: 'DELETE'});

          // fetchPosts(session?.user.id);
          const filteredPosts = posts.filter((p) => p._id !== post._id);
          setPosts(filteredPosts);
        } catch (error) {
          console.log(error);
        }
      }
    }

    useEffect(() => {
        if (session?.user.id) {
          fetchPosts(session.user.id);
        }
    }, [session?.user.id]);

  return (
    <Profile 
        name="My"
        desc="Welcome to your personalized profile page"
        data={posts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
    />
  )
}

export default MyProfile