import express from "express";
import HijabStyle from "../Models/HijabStyle.js";
import Review from "../Models/Review.js";
import { verifyToken } from "../MiddleWares/verifyToken.js";

const router = express.Router();

// GET all hijab styles with avgRating and reviewsCount
router.get("/", async (req, res) => {
  try {
    const styles = await HijabStyle.find().sort({ createdAt: -1 });

    const stylesWithRatings = await Promise.all(
      styles.map(async (style) => {
        const reviews = await Review.find({ hijabStyle: style._id });
        const avgRating = reviews.length
          ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
          : 0;
        return {
          ...style.toObject(),
          avgRating: Number(avgRating),
          reviewsCount: reviews.length,
        };
      })
    );

    res.json(stylesWithRatings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET one style + reviews + avg rating
router.get("/:id", async (req, res) => {
  try {
    const style = await HijabStyle.findById(req.params.id);
    if (!style) return res.status(404).json({ message: "Style not found" });

    const reviews = await Review.find({ hijabStyle: req.params.id })
      .sort({ createdAt: -1 })
      .populate("user", "name email");
    const avgRating = reviews.length
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.json({ style, reviews, avgRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST review (protected)
router.post("/:id/reviews", verifyToken, async (req, res) => {
  try {
    const { text, rating } = req.body;
    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: "Rating must be 1-5" });

    const review = await Review.create({
      hijabStyle: req.params.id,
      user: req.user._id,
      userName: req.user.name || req.user.email,
      text: text || "",
      rating,
    });
    res.json({ message: "Review added", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT - Edit review (protected, only owner)
router.put("/:id/reviews/:reviewId", verifyToken, async (req, res) => {
  try {
    const { text, rating } = req.body;
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Check if the logged in user owns the review
    if (review.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "Not authorized to edit this review" });
    }

    // Update fields if provided
    if (text !== undefined) review.text = text;
    if (rating !== undefined) review.rating = rating;

    await review.save();

    res.json({ message: "Review updated", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE - Delete review (protected, only owner)
router.delete("/:id/reviews/:reviewId", verifyToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Check ownership
    if (review.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await Review.deleteOne({ _id: req.params.reviewId });

    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all reviews by a user
router.get("/reviews/user/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user._id !== req.params.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const reviews = await Review.find({ user: req.params.userId }).populate('hijabStyle', 'name image');
    res.json({ reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
