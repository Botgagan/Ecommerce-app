import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';
import razorpay from 'razorpay';
import nodemailer from "nodemailer";

// global variables
const currency = 'inr';
const deliveryCharge = 10;

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// helper: send confirmation email
const sendOrderEmail = async (userId, orderId) => {
  const user = await userModel.findById(userId);
  const order = await orderModel.findById(orderId);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NOTIFY_EMAIL,
      pass: process.env.NOTIFY_PASS,
    },
    debug: true,
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP connection failed:", error);
    } else {
      console.log("SMTP server ready:", success);
    }
  });
  
const formattedAddress = `${order.address.street}, ${order.address.city}, ${order.address.state} ${order.address.zipcode}, ${order.address.country}`;

const html = `
  <div style="font-family:'Segoe UI', sans-serif; max-width:600px; margin:auto; border:1px solid #eee; padding:24px;">
    <h2 style="color:#4D5DFB;">Your Order #${order._id}</h2>
    <p style="font-size:16px;">Hi ${user.name},</p>
    <p style="font-size:16px;">
      Your order is currently: 
      <span style="font-weight:bold; color:#4D5DFB;">${order.status}</span>
    </p>

    <hr style="margin:20px 0;"/>

    <h3 style="color:#333;">🛍️ Order Summary</h3>
    ${order.items.map(i => `
      <div style="display:flex; align-items:center; margin-bottom:12px;">
        <img src="${i.image[0]}" alt="${i.name}" width="64" height="64" style="border-radius:8px; margin-right:12px; object-fit:cover;"/>
        <div>
          <p style="margin:0; font-size:15px;">${i.name} × ${i.quantity}</p>
          <p style="margin:4px 0 0; font-size:13px; color:#777;">₹${i.price}</p>
        </div>
      </div>
    `).join('')}

    <p style="font-size:15px;">
      <strong>Delivery Address:</strong><br/>${formattedAddress}
    </p>
    <p style="font-size:15px;">
      <strong>Payment Method:</strong> ${order.paymentMethod}<br/>
      <strong>Total Amount:</strong> ₹${order.amount}
    </p>

    <hr style="margin:20px 0;"/>

    <p style="font-size:14px; color:#555;">
      Need help? Visit our <a href="https://izzi.support" style="color:#4D5DFB;">support center</a>.
    </p>
    <p style="font-size:13px; color:#999;">
      This is an automated message from izzi Ecommerce. Please do not reply directly.
    </p>
  </div>
`;
  
  try {
    const info = await transporter.sendMail({
      from: `"izzi" <${process.env.NOTIFY_EMAIL}>`,
      to: user.email,
      subject: `Order Confirmation – #${order._id}`,
      html,
    });

    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
};


// placing orders using COD method
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user._id;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    await sendOrderEmail(userId, newOrder._id);

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// placing orders using Stripe method
const placeOrderStripe = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user._id;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: { name: 'Delivery Charges' },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Stripe
const verifyStripe = async (req, res) => {
  const { orderId, success } = req.body;
  const userId = req.user._id;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      await sendOrderEmail(userId, orderId);
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// placing orders using Razorpay method
const placeOrderRazorpay = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user._id;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, message: error });
      }
      res.json({ success: true, order });
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const userId = req.user._id;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status === 'paid') {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      await sendOrderEmail(userId, orderInfo.receipt);
      res.json({ success: true, message: "Payment Successful" });
    } else {
      res.json({ success: false, message: "Payment False" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Order data for Frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update order status from Admin Panel and then sending email to user on changing status

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });

    const user = await userModel.findById(updatedOrder.userId);
    await sendOrderEmail(user._id, updatedOrder._id);

    res.json({ success: true, message: 'Status Updated & Email Sent 🚀' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderRazorpay,
  verifyRazorpay,
  placeOrderStripe,
  verifyStripe,
  allOrders,
  userOrders,
  updateStatus,
};