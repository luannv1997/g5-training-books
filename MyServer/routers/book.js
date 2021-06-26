import { Router } from "express";
import { models } from "mongoose";
const router = Router();
import handleCheckPermissions from "../middleware/permissions/permission";
import { ADMIN } from "../helpers/constant";

import { findOne } from "../models/Category";
import Book, { find, findOneAndDelete, findOneAndUpdate } from "../models/Book";

//  @router GET api/auth/books
//  @desc Get books
//  @access Private

router.get("/", handleCheckPermissions, async (req, res) => {
  try {
    const books =
      req.userRole === ADMIN
        ? await find({})
            .populate("owner", ["firstName", "lastName"])
            .populate("category", ["title"])
        : await find({ owner: req.userId })
            .populate("owner", ["firstName", "lastName"])
            .populate("category", ["title"]);

    return res.json({ success: true, books });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Interval server error" });
  }
});

//  @router POST api/auth/books
//  @desc create new book
//  @access Private
router.post("/", handleCheckPermissions, async (req, res) => {
  const { title, author, cover, description, categoryTitle } = req.body;

  // TODO validate

  if (!title || !author || !categoryTitle)
    return res
      .status(400)
      .json({ success: false, message: "Input all required field" });

  try {
    const category = await findOne({ title: categoryTitle });
    if (!category)
      return res
        .status(400)
        .json({ success: false, message: "Category not found" });

    const newBook = new Book({
      title,
      author,
      owner: req.userId,
      cover: cover || "Link Image",
      description: description || "Good Book",
      category: category._id,
    });
    await newBook.save();
    return res.json({ success: true, message: "Happy Reading", newBook });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Interval server error" });
  }
});

//  @router DELETE api/auth/books
//  @desc delete book
//  @access Private

router.delete("/:id", handleCheckPermissions, async (req, res) => {
  try {
    const deleteBook =
      req.userRole === ADMIN
        ? await findOneAndDelete({ _id: req.params.id })
        : await findOneAndDelete({
            _id: req.params.id,
            owner: req.userId,
          });
    if (!deleteBook)
      return res.status(401).json({
        success: false,
        message: "Book not found or user not authorised",
      });

    return res.json({
      success: true,
      message: "Delete Book successfully",
      book: deleteBook,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Interval server error" });
  }
});

//  @router PUT api/auth/books
//  @desc update book
//  @access Private

router.patch("/:id", handleCheckPermissions, async (req, res) => {
  const { title, author, cover, description, categoryTitle } = req.body;

  // TODO validate
  try {
    const category = await findOne({ title: categoryTitle });
    if (!category)
      return res
        .status(400)
        .json({ success: false, message: "Category not found" });

    let updatedBook = {
      title: title || "No Title",
      author: author || "Update After",
      cover: cover || "Link Image",
      description: description || "Good Book",
      category: category._id,
    };

    const conditionU = { _id: req.params.id };
    const conditionU2 = { _id: req.params.id, owner: req.userId };
    updatedBook =
      req.userRole === ADMIN
        ? await findOneAndUpdate(conditionU, updatedBook, {
            new: true,
          })
        : await findOneAndUpdate(conditionU2, updatedBook, { new: true });
    if (!updatedBook)
      return res.status(401).json({
        success: false,
        message: "Book not found or user not authorised",
      });

    return res.json({
      success: true,
      message: "Updated Book Excellent!",
      book: updatedBook,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Interval server error" });
  }
});

export default router;
