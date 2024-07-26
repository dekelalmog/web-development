import { NextFunction, Request, Response } from "express";
import UserModel, { User } from "../models/user";
import { OAuth2Client } from "google-auth-library";
import { Document } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const client = new OAuth2Client();

// Get user info by ID function
export const getById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    res.status(200).json({ user });
  } catch (error) {
    res.status(404).json({ error: "Not Found" });
  }
};

// Register function
export const register = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const imageUrl = req.body.imageUrl;
  const name = req.body.name;

  if (!email || !password) {
    return res.status(400).send("Invalid email or password");
  }

  try {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      return res.status(400).send("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      email: email,
      password: hashedPassword,
      imageUrl: imageUrl,
      name: name,
    });

    const tokens = await generateTokens(newUser);

    newUser.tokens.push(tokens.accessToken);

    return res.status(201).send(newUser);


  } catch (error) {
    return res.status(400).send(error);
  }
};

// Login function
export const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send("Invalid email or password");
  }

  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(400).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }

    const tokens = await generateTokens(user);

    res.status(200).json({ message: "User logged in successfully", tokens });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Logout function
export const logout = async (req: Request, res: Response) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).send("Error extracting token");
  }

  try {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) {
        return res.status(401).send("Invalid token");
      }

      const userDoc = await UserModel.findById(user._id);
      if (!userDoc) {
        return res.status(401).send("User not found");
      }

      if (!userDoc.tokens.includes(token)) {
        userDoc.tokens = [];
        await userDoc.save();
        return res.status(401).send("Invalid user token");
      }

      userDoc.tokens = userDoc.tokens.filter((t: string) => t !== token);
      await userDoc.save();
      return res.status(200).send("User logged out successfully");
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Refresh token function
export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = extractToken(req);

  if (!refreshToken) {
    return res.status(401).send("Invalid token");
  }

  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          return res.status(401).send("Invalid token");
        }

        const userDoc = await UserModel.findById(user._id);
        if (!userDoc) {
          return res.status(401).send("User not found");
        }

        if (!userDoc.tokens?.includes(refreshToken)) {
          userDoc.tokens = [];
          await userDoc.save();
          return res.status(401).send("Invalid token");
        }

        userDoc.tokens = userDoc.tokens.filter((t) => t !== refreshToken);
        const tokens = await generateTokens(userDoc);
        userDoc.tokens.push(tokens.refreshToken);
        await userDoc.save();

        return res.status(200).json({ tokens });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Google sign-in function
export const googleLogin = async (req: Request, res: Response) => {
  const credential = req.body.credential;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;

    let user = await UserModel.findOne({ email: email });

    // Create a new user if the user does not exist
    if (user == null) {
      user = await UserModel.create({
        email: email,
        imgageUrl: payload?.picture,
        name: email,
        password: "",
      });
    }

    // Generate tokens for login
    const tokens = await generateTokens(user);

    return res.status(200).send({
      email: user.email,
      _id: user._id,
      imgUrl: user.imageUrl,
      tokens: tokens,
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

export type AuthRequest = Request & { user: { _id: string } };

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (token == null) {
      return res.sendStatus(401);
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err, data: jwt.JwtPayload) => {
      if (err) {
          return res.sendStatus(401);
      }
      const id = data._id;
      req.user = { _id: id };
      return next();
  });
}

// Generate token function
export const generateTokens = async (user: Document & User) => {

  const accessToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
  });

  const random = Math.floor(Math.random() * 1000000).toString();
  const refreshToken = jwt.sign(
    { _id: user._id, random: random },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
  );

  if (user.tokens == null) {
    user.tokens = [];
  }

  user.tokens.push(refreshToken);

  try {
    await user.save();

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (err) {
    return { error: "Failed to generate tokens" };
  }
};

// Extract token function
const extractToken = (req: Request): string => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  return token;
};

export default {getById, register, login, logout, refreshToken, googleLogin, authMiddleware};