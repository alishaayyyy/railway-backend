import userModel from '../Models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();
// *******************************Signup****************************
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User is already signed up or registered",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user with hashed password
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: "User signed up successfully",
      success: true,
    });

  } catch (error) {
   console.error("Signup Error:", error.message); // ← log the actual message
  res.status(500).json({
    message: "Internal server error",
    error: error.message, // ← send back for debugging
    success: false,
  });
  }
};


// *******************************Login****************************
export const login = async (req, res) => {
  try {
    const {email, password } = req.body;

    // Check if user already exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(403).json({
        message: "Password or Email is wrong",
        success: false,
      });
    }

    //******************************** Hash the password and the check it ****************************
    const CheckPass = await bcrypt.compare(password,user.password);

    //*************If password is not matched then error *************/
    if(!CheckPass){
      return res.status(403).json({
        message: "Password or Email is wrong",
        success: false,
      });
    }
    const jwtToken = jwt.sign(
      {email:user.email,id:user._id,role: user.role},
      process.env.JWT_SECRET,
      {expiresIn:'5d'}
    )

    res.status(200).json({
      message: "User login successfully",
      success: true,
      token:jwtToken,
      email,
      name:user.name,
      role: user.role,
    });

  } catch (error) {
   console.error("login Error:", error.message); // ← log the actual message
  res.status(500).json({
    message: "Internal server error",
    error: error.message, // ← send back for debugging
    success: false,
  });
  }
};

// ********************** Forgot Password ***********************************


// const router = express.Router();

export const ForgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    // Create token with expiry (e.g., 15 mins)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // You can store token in DB if you want (optional, for more control)
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"My App Support" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>Hello ${user.name || "User"},</p>
        <p>Click the link below to reset your password:</p>
       <a href="${process.env.FrontendLink}/reset-password/${token}" target="_blank">
  Reset Password
</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    console.log("Email sent:", info.messageId);
    res.status(200).json({ message: "Verification email sent" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
};


// ******************** Reset Password ***********************************

export const ResetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new password
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

export default {signup,login,ForgotPassword,ResetPassword};
