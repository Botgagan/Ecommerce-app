import userModel from "../models/userModel.js"

// Add products to user cart
const addToCart = async (req,res) => {
    
  try {
    
    const { itemId, size } = req.body //extracting userId,itemid and size which is coming in body from frontend
    const userId = req.user._id;// gets from the auth user , in authuser we have req.user = user
    const userData = await userModel.findById(userId)// by this userid we will get whole user data
    let cartData = await userData.cartData;

    if(cartData[itemId]) {
        if(cartData[itemId][size]) {
            cartData[itemId][size] += 1;
        }
        else {
            cartData[itemId][size] = 1
        }
    } else {
        cartData[itemId] = {}
        cartData[itemId][size] = 1
       }
       await userModel.findByIdAndUpdate(userId,{cartData})
       res.json({success: true,message: "Added To Cart"})
    
} catch (error) {
    console.log(error);
    res.json({success: false, message: error.message})
  }
}

//update user cart
const updateCart = async (req,res) => {
     try {
      
       const { itemId, size, quantity} = req.body
       const userId = req.user._id;
       const userData = await userModel.findById(userId)
       let cartData = await userData.cartData;

       cartData[itemId][size] = quantity

       await userModel.findByIdAndUpdate(userId,{cartData})
       res.json({success: true, message: "Cart Updated"})

     } catch (error) {
      console.log(error);
      res.json({success: false, message: error.message})
     }
}

//get user cart data
const getUserCart = async (req,res) => {
    try {

      const userId = req.user._id;
      const userData = await userModel.findById(userId)
      let cartData = await userData.cartData;
      res.json({success: true, cartData })
      
    } catch (error) {
      console.log(error);
      res.json({success: false, message: error.message})
    }
}

export {addToCart,updateCart,getUserCart}