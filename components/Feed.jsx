'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PromptCardList from './PromptCardList';

const Feed = () => {
  const [searchText, setSearchText] = useState(useSearchParams().get('search'));
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [posts, setPosts] = useState([]);

  const filterPosts = (allPosts, keyword) => {
    if (!keyword) return allPosts;

    return allPosts.filter(post => {
      return post.tag.toLowerCase().includes(keyword) || 
        post.prompt.toLowerCase().includes(keyword) || 
        post.creator.username.toLowerCase().includes(keyword);
    });
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce from typing
    setSearchTimeout(
      setTimeout(() => {
        setPosts(filterPosts(allPosts, e.target.value.toLowerCase()));
      }, 500)
    )
  };

  const handleTagClick = (tag) => {
    setSearchText(tag);
    setPosts(filterPosts(tag.toLowerCase()));
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('api/prompt');
      const data = await response.json();

      setAllPosts(data);
      if (searchText) {
        setPosts(filterPosts(data, searchText.toLowerCase()));
      } else {
        setPosts(data);
      }
    }

    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input type="text"
          placeholder="Search for a tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      <PromptCardList 
        data={posts} 
        handleTagClick={handleTagClick}
      />
    </section>
  )
}

export default Feed