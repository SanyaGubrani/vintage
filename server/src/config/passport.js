import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/user.model.js";
import dotenvFlow from "dotenv-flow";
dotenvFlow.config();

// Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: "username" },
    async (username, password, done) => {
      try {
        // Find user by username
        const user = await User.findOne({ username });

        // User not found
        if (!user) {
          console.log("Login failed: User not registered.");
          return done(null, false, {
            message: "User not found. Please register.",
          });
        }

        // Check password
        const isPasswordCorrect = await user.comparePassword(password);

        // Incorrect password
        if (!isPasswordCorrect) {
          console.log("Login failed: Incorrect password.");
          return done(null, false, {
            message: "Invalid username or password.",
          });
        }

        // Success
        return done(null, user);
      } catch (error) {
        console.error("Local authentication error:", error.message);
        return done(error);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `https://vintagestorybook.com/api/v1/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
        });

        // If user doesn't exist, create a new one with a unique username
        if (!user) {
          let baseUsername = profile.displayName
            .toLowerCase()
            .replace(/\s+/g, "");

          let existingUser = await User.findOne({ username: baseUsername });
          let username = baseUsername;

          let counter = 1;
          while (existingUser) {
            username = `${baseUsername}${counter}`;
            existingUser = await User.findOne({ username });
            counter++;
          }

          user = await User.create({
            username: username, // unique username
            email: profile.emails[0].value,
            googleId: profile.id,
            profile_picture: profile.photos[0].value,
          });
        }

        return done(null, user);
      } catch (error) {
        console.log("Google authentication error:", error);
        return done(error);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  console.log(
    "PASSPORT_SERIALIZE: Attempting to serialize user:",
    user
      ? { id: user.id || user._id, username: user.username }
      : "User object is undefined/null"
  );
  if (!user || !(user.id || user._id)) {
    console.error(
      "PASSPORT_SERIALIZE: User or user ID is missing for serialization!"
    );
    return done(new Error("User or user ID missing for serialization"), null);
  }
  const userIdToStore = user.id || user._id;
  console.log(
    "PASSPORT_SERIALIZE: Calling done(null, userId) with ID:",
    userIdToStore
  );
  done(null, userIdToStore);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  console.log(
    "PASSPORT_DESERIALIZE: Attempting to deserialize user with ID:",
    id
  );
  try {
    const user = await User.findById(id);
    if (!user) {
      console.error("PASSPORT_DESERIALIZE: User not found for ID:", id);
      return done(null, false, { message: "User not found." });
    }
    console.log("PASSPORT_DESERIALIZE: User found:", {
      id: user.id || user._id,
      username: user.username,
    });
    done(null, user);
  } catch (err) {
    console.error("PASSPORT_DESERIALIZE: Error fetching user by ID:", id, err);
    done(err, null);
  }
});

export default passport;
