import React from "react";
import Layout from "../components/Layout";
import Footer from "../components/Footer";

const Notifications = () => {
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center md:justify-between md:mt-20 mt-5 px-4">
        <div className="bg-background/80 rounded-xl shadow-lg shadow-vintage p-8 max-w-xl w-full flex flex-col items-center">
          <span className="text-5xl mb-4">🔔</span>
          <h1 className="text-2xl font-bold mb-2 text-primary font-newspaper">
            Notifications
          </h1>
          <p className="text-lg text-muted-foreground mb-6 text-center">
            The notifications feature is{" "}
            <span className="font-semibold text-primary">
              under development
            </span>{" "}
            and will be available soon.
            <br />
          </p>
          <div className="w-full border-t border-primary/20 my-4" />
          <h2 className="text-xl font-semibold mb-2 text-primary font-newspaper">
            About Vintage
          </h2>
          <p className="text-base text-muted-foreground text-center">
            <span className="font-bold text-primary">Vintage</span> is a
            practice project built to learn fullstack development. It’s a social
            media app where you can create posts, like, comment, bookmark, edit
            your profile, follow others, and chat in real time — including with
            the built-in AI chatbot, Vinty. It’s not perfect, but it's made with
            love to explore and grow while building!
          </p>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default Notifications;
