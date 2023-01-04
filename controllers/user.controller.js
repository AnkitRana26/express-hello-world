const userModel = require("../database/user");
const bcrypt = require("bcrypt");
const { generateToken } = require("../miscFunction/CommonFunction");
const User = require("../database/user");
const { request } = require("express");
require("dotenv").config();

const signUp = async (body) => {
  // console.log(body);
  let user = await userModel.findOne({ email: body.email });
  if (user) {
    throw new Error("Email Already Registered");
  }
  const salt = 10;
  body.password = bcrypt.hashSync(body.password, salt);
  body.authType = "normal";
  let newUser = await userModel.create(body);
  return "Sucessfully Sign Up";
};

const googleAuth = async (request, accessToken, refreshToken, profile, done) => {
  let user = await userModel.findOne({ email: profile['_json'].email });
  
  console.log(profile['_json']['given_name'],"Hello");
  if (!user) {
    let body = {
      authType: "google",
      firstName: profile['_json']['given_name'],
      image: profile['_json'].picture,
      email: profile['_json'].email,
    };
    let newUser = await User.create(body);
    
  }

  return done(null, profile);
};

const login = async (body) => {
  let user = await userModel.findOne({ email: body.email });
  if (!user) {
    throw new Error("User Not Found");
  }

  let password = bcrypt.compareSync(body.password, user.password);
  if (!password) {
    throw new Error("Incorrect Password");
  }
  return generateToken(user.toJSON());
};
module.exports = { signUp, login, googleAuth };
