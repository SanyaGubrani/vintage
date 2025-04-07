import React, { useState } from "react";
import banner from "/images/banner.png";
import Container from "@/components/Container";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const loginForm = useForm();
  const registerForm = useForm();

  const { loginUser, isLoggingIn, registerUser, isRegistering, googleOAuth } =
    useAuthStore();

  const switchToLogin = () => {
    if (!isLoginActive) {
      registerForm.reset();
      setIsLoginActive(true);
    }
  };

  const switchToRegister = () => {
    if (isLoginActive) {
      loginForm.reset();
      setIsLoginActive(false);
    }
  };

  const handleLoginSubmit = loginForm.handleSubmit((data) => {
    console.log("Login form submitted with:", data);
    loginUser(data);
  });

  const handleRegisterSubmit = registerForm.handleSubmit((data) => {
    console.log("Register form submitted with:", data);
    registerUser(data);
  });

  return (
    <Container className="py-10 md:py-20 ">
      <div className="flex flex-col-reverse md:flex-row items-center gap-8 justify-center mx-auto w-full max-w-6xl">
        {/* Form Section */}
        <div className="md:w-[55%] w-full max-w-md rounded-2xl border-4 border-primary/50 p-6 shadow-vintage">
          {/* Tab Navigation */}
          <div className="flex rounded-lg bg-muted/10 p-1 mb-6 border-2 border-muted/30 ">
            <button
              className={`w-1/2 py-2.5 px-4 text-center rounded-md transition duration-200 font-medium ${
                isLoginActive
                  ? "bg-primary text-primary-foreground shadow-md font-typewriter-bold"
                  : "text-primary bg-muted hover:bg-accent/30 cursor-pointer font-typewriter"
              }`}
              onClick={switchToLogin}
            >
              Login
            </button>
            <button
              className={`w-1/2 py-2.5 px-4 text-center rounded-md transition duration-200 font-medium ${
                !isLoginActive
                  ? "bg-primary text-primary-foreground shadow-md font-typewriter-bold"
                  : "text-primary bg-muted hover:bg-accent/30 cursor-pointer font-typewriter"
              }`}
              onClick={switchToRegister}
            >
              Register
            </button>
          </div>

          {isLoginActive ? (
            /* Login Form */
            <form className="space-y-5" onSubmit={handleLoginSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="login-username"
                    className="block text-sm font-medium text-foreground font-newspaper"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="login-username"
                      placeholder="@nyxofweb"
                      className="w-full p-3 placeholder:font-newspaper font-newspaper rounded-md bg-muted-foreground/10 border-2 border-primary focus:border-primary/70 focus:outline-none transition"
                      {...loginForm.register("username", {
                        required: "Username is required",
                      })}
                    />
                    {/* {errors.username && toast.error(errors.username.message)} */}
                    {loginForm.formState.errors.username && (
                      <p className="text-destructive text-xs mt-1">
                        {loginForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium font-newspaper text-foreground"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="login-password"
                      placeholder="●●●●●●●●"
                      className="w-full p-3 font-newspaper rounded-md bg-muted-foreground/10 border-2 border-primary focus:border-primary/70 focus:outline-none transition pr-10"
                      {...loginForm.register("password", {
                        required: "Password is required",
                      })}

                      // {...(errors.password &&
                      //   toast.error(errors.password.message))}
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-destructive text-xs mt-1">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                    <button
                      type="button"
                      className="absolute right-3 top-4 text-muted-foreground hover:text-primary focus:outline-none"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="button-vintage  w-full rounded-lg font-typewriter-bold cursor-pointer  text-primary-foreground font-medium py-3 px-4 transition duration-200"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="size-6 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Log In"
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted-foreground/25"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 font-typewriter text-muted-foreground bg-muted/80 rounded-full font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="w-full hover:text-background hover:bg-muted/60 cursor-pointer hover:border-muted-foreground text-primary font-typewriter-bold flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-lg border-3 border-primary transition-all ease-in-out duration-200"
                onClick={googleOAuth}
              >
                <svg
                  width="29"
                  height="29"
                  viewBox="0 0 26 26"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#493f3d"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#775e59"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#493f3d "
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#775e59"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleRegisterSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="register-email"
                    className="block text-sm font-newspaper font-medium text-foreground"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="register-email"
                      placeholder="your.email@example.com"
                      className="w-full p-3 placeholder:font-newspaper font-newspaper rounded-md bg-muted-foreground/10 border-2 border-primary focus:border-primary/70 focus:outline-none transition"
                      {...registerForm.register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-destructive text-xs mt-1">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="register-username"
                    className="block font-newspaper text-sm font-medium text-foreground"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="register-username"
                      placeholder="Choose a username"
                      className="w-full p-3 placeholder:font-newspaper font-newspaper rounded-md bg-muted-foreground/10 border-2 border-primary focus:border-primary/70 focus:outline-none transition"
                      {...registerForm.register("username", {
                        required: "Username is required",
                        minLength: {
                          value: 3,
                          message: "Username must be at least 3 characters",
                        },
                      })}
                    />
                    {registerForm.formState.errors.username && (
                      <p className="text-destructive text-xs mt-1">
                        {registerForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="register-password"
                    className="block font-newspaper text-sm font-medium text-foreground"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="register-password"
                      placeholder="Create a strong password"
                      className="w-full p-3 placeholder:font-newspaper font-newspaper rounded-md bg-muted-foreground/10 border-2 border-primary focus:border-primary/70 focus:outline-none transition"
                      {...registerForm.register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-destructive text-xs mt-1">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted hover:text-primary focus:outline-none"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="button-vintage  w-full rounded-lg font-typewriter-bold cursor-pointer  text-primary-foreground font-medium py-3 px-4 transition duration-200"
                disabled={isRegistering}
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="size-6 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Create account"
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted/50"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 text-muted-foreground bg-muted/80 rounded-full ">
                    Or sign up with
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 hover:bg-success/40 text-gray-800 font-medium py-3 px-4 rounded-md border-3 border-primary hover:border-success transition duration-200"
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#493f3d"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#775e59"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#493f3d "
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#775e59"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </button>
            </form>
          )}
        </div>

        {/* Image Section */}
        <div className="md:w-[45%] w-[80%] mb-6 md:mb-0">
          <img
            src={banner}
            alt="Vintage illustrations"
            className="w-full h-auto object-cover "
          />
        </div>
      </div>
    </Container>
  );
};

export default Auth;
