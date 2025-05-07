import React from "react";
import UserProfilePosts from "../components/ourProfile/OurProfilePosts";
import Layout from "../components/Layout";
import ProfileDetails from "../components/ourProfile/ProfileDetails";

const ProfilePage = () => {
  return (
    <Layout>
      <ProfileDetails />
      <UserProfilePosts />
    </Layout>
  );
};

export default ProfilePage;
