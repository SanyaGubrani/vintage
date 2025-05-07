import React from "react";
import Feed from "../components/Feed";
import CreatePost from "../components/CreatePost";
import Layout from "../components/Layout";

const Home = () => {
  return (
    <Layout>
      <CreatePost />
      <Feed />
    </Layout>
  );
};

export default Home;