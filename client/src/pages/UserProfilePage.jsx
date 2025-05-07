import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import UserProfileDetails from "../components/userProfile/UserProfileDetails";
import UserProfilePosts from "../components/userProfile/UserProfilePosts";

const UserProfilePage = () => {
  const { userId } = useParams();

  return (
    <Layout>
        <UserProfileDetails userId={userId} />
        <UserProfilePosts userId={userId} />
    </Layout>
  );
};

export default UserProfilePage;