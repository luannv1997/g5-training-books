require("dotenv").config();
import { Router } from "express";
import { models } from "mongoose";
const router = Router();
import { USER } from '../helpers/constant';
import User from "../models/User";
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";

//  @router POST api/auth/register
//  @desc Register user
//  @access Public

router.post("/register", async (req, res) => {
  const { username, password, firstName, lastName} = req.body;

  // TODO validate
  if (!username || !password || !firstName || !lastName)
    return res
      .status(400)
      .json({ success: false, message: "All field are required" });

  try {
    const user = await User.findOne({ username });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "username already taken" });

    // all good
    const hashPassword = await hash(password, 8);
    const newUser = new User({
      username,
      password: hashPassword,
      firstName,
      lastName,
      role: USER
    });
    console.log(USER)
    await newUser.save();

    //return token
    // const accessToken = jwt.sign(
    //   { userId: newUser._id, userRole: newUser.role, timeCreate: Date.now() },
    //   process.env.ACCESS_TOKEN_SECRET
    // );
    res.json({
      success: true,
      message: "User created successfully"
      // accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//  @router POST api/auth/register
//  @desc login user
//  @access Public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // TODO validate

  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username and/or password" });

  try {
    // check exist username
    const user = await User.findOne({ username });
    if(!user)
    return res
      .status(400)
      .json({ success: false, message: "Incorrect username" });

    const passValid = await compare(password, user.password);

    if (!passValid)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });

    // all OK
    // return token
    const accessToken = sign(
      { userId: user._id, userRole: user.role,  timeCreate: Date.now()},
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: "Logged in  successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



export default router;
