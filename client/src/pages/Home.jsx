import React, { useEffect } from "react";
import Feed from "../components/Feed";
import CreatePost from "../components/CreatePost";
import Layout from "../components/Layout";
import { useBookmarkStore } from "../store/useBookmarkStore";

const Home = () => {
  const { getSavedPosts } = useBookmarkStore();

  useEffect(() => {
    const initializeApp = async () => {
      await Promise.all([getSavedPosts()]);
    };
    initializeApp();
  }, []);

  return (
    <Layout>
      <CreatePost />
      <Feed />
    </Layout>
  );
};

export default Home;
