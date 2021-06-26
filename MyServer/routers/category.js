import { Router } from "express";
import { models } from "mongoose";
const router = Router();

import Category, { findOne, find } from "../models/Category";

router.post("/", async (req, res) => {
  const { title } = req.body;

  // TODO validate
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });

  try {
    const category = await findOne({ title });
    if (category)
      return res
        .status(400)
        .json({ success: false, message: "Category title already taken" });

    const newCategory = new Category({
      title,
    });
    await newCategory.save();

    //return message
    res.json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const categories = await find({});
    return res.json({ success: true, categories});
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;