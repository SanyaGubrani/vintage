import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import PostCard from "../components/PostCard";
import CommentBox from "../components/CommentBox";
import CommentList from "../components/CommentList";
import { usePostStore } from "../store/usePostStore";
import { Loader2 } from "lucide-react";

const CommentsPage = () => {
  const { postId } = useParams();
  const { getAllPosts, allPosts, isPosting } = usePostStore();

  const currentPost = useMemo(() => {
    return allPosts.find(post => post._id === postId);
  }, [allPosts, postId]);

  useEffect(() => {
    if (!allPosts.length) {
      getAllPosts();
    }
  }, [getAllPosts]);

  if (isPosting || (!currentPost && !allPosts.length)) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="animate-spin" size={24} />
        </div>
      </Layout>
    );
  }

  if (!currentPost) {
    return (
      <Layout>
        <div className="text-center py-8 text-muted-foreground">
          Post not found
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto w-full">
        <PostCard post={currentPost} />
        <div className="bg-accent/15 rounded-lg border max-w-lg shadow-md mt-4">
        <h3 className="text-lg md:text-xl font-newspaper p-2 tracking-wider text-stone-600">Comments</h3>
          <CommentBox postId={postId} />
          <CommentList postId={postId} />
        </div>
      </div>
    </Layout>
  );
};

export default CommentsPage;