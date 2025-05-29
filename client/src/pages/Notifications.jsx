import React from "react";
import Layout from "../components/Layout";
import Footer from "../components/Footer";

const Notifications = () => {
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="bg-background/80 rounded-xl shadow-lg p-8 max-w-lg w-full flex flex-col items-center">
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
            Stay tuned for updates!
          </p>
          <div className="w-full border-t border-primary/20 my-4" />
          <h2 className="text-xl font-semibold mb-2 text-primary font-newspaper">
            About Vintage
          </h2>
          <p className="text-base text-muted-foreground text-center">
            <span className="font-bold text-primary">Vintage</span> is a modern
            chat and social platform inspired by the warmth and style of the
            past. Connect, share, and relive the golden days with a beautiful,
            intuitive interface and real-time messaging. Whether you're here for
            friends, nostalgia, or new connections, Vintage brings timeless
            vibes to your digital life.
          </p>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default Notifications;
