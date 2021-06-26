import { Router } from "express";
import { models } from "mongoose";
const router = Router();
import handleCheckPermissions from "../middleware/permissions/permission";
import { USER }  from "../helpers/constant";
import { hash } from "bcrypt";
import User from "../models/User";

//  @router GET api/auth/Users
//  @desc Get all Users
//  @access Private

router.get("/", handleCheckPermissions, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    return res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Interval server error" });
  }
});

//  @router POST api/auth/books
//  @desc create new user
//  @access Private
router.post("/", handleCheckPermissions, async (req, res) => {
  const { username, password, firstName, lastName, role } = req.body;
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
      role: role || _USER,
      lastedLogout: Date.now(),
      lastChangePassword: Date.now()
    });

    await newUser.save();
    res.json({
      success: true,
      message: "User created successfully",
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//  @router DELETE api/auth/books
//  @desc delete book
//  @access Private

router.delete("/:id", handleCheckPermissions, async (req, res) => {
  try {
    const deleteUser = await User.findOneAndDelete({ _id: req.params.id });
    if (!deleteUser)
      return res.status(401).json({
        success: false,
        message: "User not found or user not authorised",
      });

    return res.json({
      success: true,
      message: "Delete User successfully",
      deleteUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Interval server error" });
  }
});

//  @router PATCH api/auth/user
//  @desc update user
//  @access Private

router.patch("/:id", handleCheckPermissions, async (req, res) => {
  const { firstName, lastName, role } = req.body;

  // TODO validate

  try {
    let updatedUser = {
      firstName,
      lastName,
      role: role || USER.USER
    };

    updatedUser = await User.findOneAndUpdate({ _id: req.params.id }, updatedUser, {
      new: true,
    });
    if (!updatedUser)
      return res.status(401).json({
        success: false,
        message: "User not found or user not authorised",
      });
    return res.json({
      success: true,
      message: "Updated User Excellent!",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Interval server error" });
  }
});

export default router;
