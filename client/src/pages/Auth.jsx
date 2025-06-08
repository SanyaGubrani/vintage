import React, { useState } from "react";
import banner from "/images/banner.png";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";
import Footer from "../components/Footer";

const Auth = () => {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //using react-hook-form to handle login/register forms
  const loginForm = useForm();
  const registerForm = useForm();

  //use the functions and state from auth-store
  const { loginUser, isLoggingIn, registerUser, isRegistering, googleOAuth } =
    useAuthStore();

  //reset and switch to login form
  const switchToLogin = () => {
    if (!isLoginActive) {
      registerForm.reset();
      setIsLoginActive(true);
    }
  };

  //reset and switch to register form
  const switchToRegister = () => {
    if (isLoginActive) {
      loginForm.reset();
      setIsLoginActive(false);
    }
  };

  //submit login form
  const handleLoginSubmit = loginForm.handleSubmit((data) => {
    console.log("Login form submitted with:", data);
    loginUser(data);
  });

  //submit registration form
  const handleRegisterSubmit = registerForm.handleSubmit((data) => {
    console.log("Register form submitted with:", data);
    registerUser(data);
  });

  return (
    <div className="w-full min-h-[calc(100vh-20px)] relative overflow-hidden justify-between flex flex-col">
      {/* Decorative Leaves */}
      <div className="absolute sm:fixed top-0 left-0 -translate-x-1/4 -translate-y-1/3 size-72 md:size-96 opacity-60 z-0">
        <img
          src="/images/leaf.png"
          alt=""
          className="w-full h-full object-contain rotate-[145deg]"
          aria-hidden="true"
        />
      </div>

      <div className="hidden md:block fixed bottom-0 right-0 translate-x-1/3 translate-y-1/4 size-96 opacity-60 pointer-events-none">
        <img
          src="/images/leaf.png"
          alt=""
          className="w-full h-full object-contain"
          aria-hidden="true"
        />
      </div>

      {/* Main content */}
      <div className="w-full max-w-6xl mx-auto py-10 space-y-2 md:space-y-20 md:py-8 px-4">
        <h1
          className="text-center font-newspaper text-5xl md:text-6xl font-display font-semibold tracking-widest text-[#594f43]"
          style={{
            textShadow: "2px 2px 2px #C2B8A3, 4px 4px 0 #A59E8C",
            letterSpacing: "0.2em",
          }}
        >
          VINTAGE
        </h1>

        <div className="flex flex-col-reverse px-2 md:flex-row items-center gap-4 md:gap-10 justify-between mx-auto w-full md:py-5 max-w-7xl ">
          {/* Form Section */}
          <div className="md:w-[75%] w-full max-w-sm md:max-w-md rounded-2xl drop-shadow-lg  border-4 border-secondary bg-secondary/5 p-4 md:py-5 md:px-6 shadow-vintage">
            {/* Tab Navigation */}
            <div className="flex rounded-lg bg-muted/10 p-1 text-sm sm:text-base mb-6 border-2 border-muted/30">
              <button
                className={`w-1/2 py-2 md:py-2.5 px-4 text-center rounded-md font-medium transition-all duration-100 ease-in ${
                  isLoginActive
                    ? "bg-primary text-primary-foreground shadow-md font-typewriter-bold"
                    : "text-primary bg-muted  hover:bg-accent/35  cursor-pointer font-typewriter "
                }`}
                onClick={switchToLogin}
              >
                Login
              </button>
              <button
                className={`w-1/2 py-2 md:py-2.5 px-4 text-center rounded-md font-medium transition-all duration-100 ease-in ${
                  !isLoginActive
                    ? "bg-primary text-primary-foreground shadow-md font-typewriter-bold"
                    : "text-primary bg-muted  hover:bg-accent/35 cursor-pointer font-typewriter "
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
                        className="w-full p-1.5 sm:p-2 md:p-3 placeholder:font-newspaper md:placeholder:text-sm placeholder:text-xs font-newspaper rounded-md bg-muted-foreground/10 border-2 border-primary focus:border-primary/70 focus:outline-none transition"
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
                        className="w-full p-1.5 sm:p-2 md:p-3 font-newspaper rounded-md bg-muted-foreground/10 border-2 border-primary focus:border-primary/70 focus:outline-none transition pr-10"
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
                        className="absolute right-3 top-2 sm:right-3 sm:top-4 text-muted-foreground hover:text-primary focus:outline-none"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff size={24} />
                        ) : (
                          <Eye size={24} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="button-vintage w-full rounded-lg font-typewriter-bold cursor-pointer  text-primary-foreground font-medium p-2 sm:py-3 sm:px-4 transition duration-200"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <div className="flex items-center justify-center text-center gap-2">
                      <Loader2 className="size-6 animate-spin" /> Loading...
                    </div>
                  ) : (
                    "Log In"
                  )}
                </button>

                <div className="relative mt-4 mb-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted-foreground/25"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 font-typewriter text-muted-foreground bg-muted/80 rounded-full font-medium">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google OAuth */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 hover:bg-muted  text-gray-800 font-medium sm:text-base text-sm p-2 sm:py-3 sm:px-4 rounded-xl border-4 border-primary/70 hover:border-muted-foreground font-typewriter-bold"
                  onClick={googleOAuth}
                >
                  <svg
                    width="29"
                    height="29"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="-translate-y-[0.05rem]"
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
              // Registration form
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
                        className="w-full p-1.5 sm:p-2 md:p-3 placeholder:font-newspaper md:placeholder:text-sm placeholder:text-xs font-newspaper rounded-md bg-muted-foreground/10 border-2 border-primary focus:border-primary/70 focus:outline-none transition"
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
                        className="w-full p-1.5 sm:p-2 md:p-3 placeholder:font-newspaper md:placeholder:text-sm placeholder:text-xs font-newspaper rounded-md bg-muted-foreground/10 border-2 border-primary focus:border-primary/70 focus:outline-none transition"
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
                        placeholder="●●●●●●●●"
                        className="w-full p-1.5 sm:p-2 md:p-3 font-newspaper rounded-md bg-muted-foreground/10 border-2 border-primary focus:border-primary/70 focus:outline-none transition pr-10"
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
                        className="absolute right-3 top-2 sm:right-3 sm:top-4 text-muted-foreground hover:text-primary focus:outline-none"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff size={24} />
                        ) : (
                          <Eye size={24} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="button-vintage  w-full rounded-lg font-typewriter-bold cursor-pointer  text-primary-foreground font-medium p-2 sm:py-3 sm:px-4 transition duration-200"
                  disabled={isRegistering}
                >
                  {isRegistering ? (
                    <div className="flex items-center justify-center text-center gap-2">
                      <Loader2 className="size-6 animate-spin" /> Loading...
                    </div>
                  ) : (
                    "Create account"
                  )}
                </button>

                <div className="relative mt-3 mb-7">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted-foreground/25"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 font-typewriter text-muted-foreground bg-muted/80 rounded-full font-medium">
                      Or sign up with
                    </span>
                  </div>
                </div>

                {/* Google OAuth */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 hover:bg-muted  text-gray-800 font-medium sm:text-base text-sm p-2 sm:py-3 sm:px-4 rounded-xl border-4 border-primary/70 hover:border-muted-foreground font-typewriter-bold"
                  onClick={googleOAuth}
                >
                  <svg
                    width="29"
                    height="29"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="-translate-y-[0.05rem]"
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

          {/* Banner Image Section */}
          <div className="w-[85%] -translate-x-2.5 md:-translate-x-0 sm:w-[75%] md:w-[75%] lg:w-[50%] mb-5 md:mb-0 transition-all duration-300 max-w-xl mx-auto md:mx-0">
            <picture>
              <img
                src={banner}
                alt="Vintage illustrations"
                className="w-full h-auto object-cover duration-300 transition-all ease-in-out hover:rotate-3"
                loading="eager"
                width="600"
                height="800"
              />
            </picture>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
