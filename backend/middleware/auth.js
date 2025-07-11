import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"

const authUser = async (req, res, next) => {
  const { token } = req.headers

  if (!token) {
    return res.json({ success: false, message: 'Not Authorized. Login Again.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findById(decoded.id)

    if (!user) {
      return res.json({ success: false, message: 'User not found' })
    }

    req.user = user // ✅ Attach full user object
    next()
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export default authUser
