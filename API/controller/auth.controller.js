import User from "../models/user.model.js";
import { sendOtpMail } from "../utils/mail.js";
import genToken from "../utils/token.js";
import bcrypt from 'bcryptjs'

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;

    if(!fullName?.trim()){
      return res.status(400).json({message: "Please Enter the full Name."})
    }
    if(!email?.trim()){
      return res.status(400).json({message: "Please Enter the email"})
    }
    if(!password?.trim()){
      return res.status(400).json({message: "Please Enter the password"})
    }
    if(!mobile?.trim()){
      return res.status(400).json({message: "Please Enter your mobile No."})
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "user already exists." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }
    if (mobile.length<10) {
      return res
        .status(400)
        .json({ message: "Mobile length must be atleast 10 characters." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      role,
    });

    const token = await genToken(user._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 5 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(401).json({ message: `Signup error ${error}` });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email.trim()){
      return res.status(400).json({message: "Please Enter the email."})
    }
    if(!password.trim()){
      return res.status(400).json({message: "Please Enter the password."})
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exists." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrrect password" });
    }
    const token = await genToken(user._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 5 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.status(200).json({ message: "sigin successfully" });
  } catch (error) {
    return res.status(500).json({ message: `SignIn error ${error}` });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Signout successfully" });
  } catch (error) {
    return res.status(500).json({ message: `SignOut error ${error}` });
  }
};

export const sendOtp = async(req, res) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message: "User does not exist"})
    }
    const otp = Math.floor(1000+ Math.random()*9000);
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5*60*1000;
    user.isOtpVerified = false;
    await user.save();
    await sendOtpMail(email, otp);
    return res.status(200).json({message: "Otp Sent Successfully"})
  } catch (error) {
    return res.status(500).json({message: `send otp error ${error}.`})
  }
}

export const verifyOtp = async(req, res) => {
  try {
    const {email, otp} = req.body;
    const user = await User.findOne({email});
    if(!user || user.resetOtp != otp || user.otpExpires<Date.now()){
      return res.status(400).json({message: "Invalid/Expires otp"})
    }
    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return res.status(200).json({message: "Otp Verifed successfully"})
  } catch (error) {
    return res.status(500).json({message: "something went wrong try again."})
  }
}

export const resetOtp = async(req, res) => {
  try {
    const {email, newPassword} = req.body;
    const user = await User.findOne({email});
    if(!user || !user.isOtpVerified){
      return res.status(400).json({message: "Otp verification requires"})
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();
    return res.status(200).json({message: "Otp reset successfully."})
  } catch (error) {
    return res.status(500).json({message: `Reset otp error ${error}`})
  }
}


