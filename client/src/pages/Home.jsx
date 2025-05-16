import React, { useEffect } from "react";
import Feed from "../components/Feed";
import CreatePost from "../components/CreatePost";
import Layout from "../components/Layout";
import { useBookmarkStore } from "../store/useBookmarkStore";
import { useCommentStore } from "../store/useCommentStore";
import { usePostStore } from "../store/usePostStore";

const Home = () => {
  const { getSavedPosts } = useBookmarkStore();
  const { getAllPosts, allPosts } = usePostStore();

  const { initializeCommentCounts } = useCommentStore();

  useEffect(() => {
    const initializeApp = async () => {
      await Promise.all([getSavedPosts(), getAllPosts()]);
    };
    initializeApp();
  }, []);

  useEffect(() => {
    if (allPosts.length > 0) {
      initializeCommentCounts(allPosts);
    }
  }, [allPosts]);

  return (
    <Layout>
      <CreatePost />
      <Feed />
    </Layout>
  );
};

export default Home;
