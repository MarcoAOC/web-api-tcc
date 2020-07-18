const mongoose = require("mongoose");
const User = mongoose.model("User");


module.exports = {
  async authenticateMe(req, res){
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
      if (!(await user.compareHash(password))) {
        return res.status(400).json({ error: "Invalid password" });
      }
      return res.json({
        user,
        token: user.generateToken()
      });
    } catch (err) {
      return res.status(400).json({ error: "User authentication failed" });
    }
  },
  async registerUser(req, res){
    const { email, username } = req.body;
  
    try {
      if (await User.findOne({ email })) {
        return res.status(400).json({ error: "User already exists" });
      }
  
      const user = await User.create(req.body);
  
      return res.json({ user });
    } catch (err) {
      return res.status(400).json({ error: "User registration failed" });
    }
  },
  async getMe(req, res){
    try {
      const { userId } = req;
  
      const user = await User.findById(userId);
  
      return res.json({ user });
    } catch (err) {
      return res.status(400).json({ error: "Can't get user information" });
    }
  },
}
