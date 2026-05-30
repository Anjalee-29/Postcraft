import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PostStore from "../store/postStore";

const PostsCtx = createContext(null);

export function PostsProvider({ children }) {
  const [posts,        setPosts]        = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const reload = useCallback(async () => {
    const p = await PostStore.list();
    setPosts(p);
    setPostsLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const savePost     = async (data)       => { await PostStore.create(data);             await reload(); };
  const removePost   = async (id)         => { await PostStore.delete(id);               await reload(); };
  const changeStatus = async (id, status) => { await PostStore.updateStatus(id, status); await reload(); };

  return (
    <PostsCtx.Provider value={{ posts, postsLoading, reload, savePost, removePost, changeStatus }}>
      {children}
    </PostsCtx.Provider>
  );
}

export const usePosts = () => useContext(PostsCtx);
