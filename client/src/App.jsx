import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "@/pages/Auth";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader } from "lucide-react";
import Home from "@/pages/Home";
import { Toaster } from "react-hot-toast";
const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    console.log("App mounted, checking authentication...");
    checkAuth();

    const fromGoogle =
      location.search.includes("fromGoogle") ||
      document.referrer.includes("accounts.google.com");

    if (fromGoogle) {
      console.log("Detected redirect from Google, checking auth status...");
      checkAuth();
    }
  }, [checkAuth, location]);

  console.log("Auth state:", { authUser, isCheckingAuth });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-20 animate-spin text-primary" />
      </div>
    );

  return (
    <div>
      <Routes>
        <Route
          exact
          path="/"
          element={authUser ? <Home /> : <Navigate to="/auth" replace />}
        />
        {/* Do it in end */}
        {/* <Route
          path="/auth"
          element={!authUser ? <Auth /> : <Navigate to="/" replace />}
        /> */}
        <Route path="/auth" element={<Auth />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#F4F1EA",
            border: "1px solid #775E59",
            color: "#2B2628",
          },
        }}
      />
    </div>
  );
};

export default App;
