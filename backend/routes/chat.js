import express from 'express';
import axios from 'axios';
import authUser from '../middleware/auth.js';
import userModel from '../models/userModel.js';
import orderModel from '../models/orderModel.js';
import commentModel from '../models/CommentModel.js';
import productModel from '../models/productModel.js';

const chatRoutes = express.Router();

const FAQ_RESPONSES = {
  cod_available: "Yes! Cash on Delivery is available across most regions in India.",
  return_policy: "Products can be returned within 7 days if unworn and in original packaging.",
  track_order: "Please log in and share your Order ID like #ORD1234 so I can check its status.",
  gift_cards: "Yes, we offer gift cards in denominations like ₹500, ₹1000, and ₹2000.",
  cancel_order: "You can cancel your order from the Orders section before it is shipped.",
  shipping_charges: "Shipping is free for orders above ₹999. Below that, a flat ₹49 fee applies.",
  payment_modes: "We accept UPI, debit/credit cards, Net Banking, and Cash on Delivery.",
  international_shipping: "Currently, we only ship within India. 🌏 International shipping is coming soon!",
  change_address: "Sure! You can update your delivery address before your order is dispatched.",
  order_confirmation: "You’ll receive an SMS and email confirmation once your order is placed.",
  delay_order: "Sorry! If your order is delayed, I can check with our courier partner for an update.",
  order_status: "Just share your Order ID and I’ll check the latest status for you!",
  refund_status: "Refunds usually reflect within 5–7 business days once approved.",
  exchange_policy: "Yes, you can exchange products within 7 days for a different size or color.",
  product_availability: "You can tap 'Notify Me' on the product page to get updates when it’s back.",
  size_guide: "Tap the 'Size Guide' near the Add to Cart button for detailed fit info.",
  account_update: "You can update your name, mobile, or email from the Account section.",
  forgot_password: "Click 'Forgot Password' on the login page to reset it securely.",
  review_product: "Once your order is delivered, you can rate and review from your profile.",
  remove_item_cart: "Go to your cart and tap the ❌ next to the item you wish to remove.",
  add_coupon: "Apply your coupon code during checkout in the 'Promo Code' field.",
  coupon_invalid: "Oh no! That coupon might be expired or not applicable for this product.",
  new_arrivals: "Check out our 'New In' section to see the latest trends.",
  bestsellers: "You’ll love our bestsellers — here are the most loved pieces right now!",
  out_of_stock: "That item is currently out of stock. I’ll notify you once it’s back!",
  product_material: "You’ll find fabric info and care instructions on each product page.",
  wash_instructions: "Most items are machine washable. Detailed care is mentioned per product.",
  delivery_timeline: "Orders usually arrive within 3–6 working days depending on your location.",
  cancel_after_shipping: "Once shipped, cancellations aren’t allowed. You can request a return later.",
  invoice_request: "You’ll get a digital invoice on your registered email after order confirmation.",
  contact_support: "You can reach our support team at support@izzi.in or via live chat.",
  chat_unresponsive: "Oops, I may have missed that. Try rephrasing or ask me a different way!",
  trending_now: "These styles are trending right now 🔥 Want to explore?",
  multiple_items: "Yes! You can add multiple items to cart before placing a single order.",
  bulk_order: "For bulk orders or wholesale queries, drop us a mail at b2b@izzi.in.",
  color_variants: "Click the color dots on the product page to explore different shades.",
  wallet_payment: "We accept payments via Paytm, PhonePe, Google Pay, and more.",
  dispatch_info: "Orders are usually dispatched within 24 hours of confirmation.",
  mobile_app: "You can shop even faster on our iOS and Android apps — available now!",
  newsletter_signup: "Sign up at the bottom of our homepage to get style updates and offers.",
  loyalty_points: "Stay tuned! We’re working on a loyalty rewards program 🛍️",
  festive_offer: "Yes, we have festive discounts live now! Use code FESTIVE15 for 15% off.",
  order_edit: "You can’t edit an order once placed. Cancel and re-order if needed.",
  delivery_partner: "We ship via Blue Dart, Delhivery, and Ekart depending on your pin code.",
  pincode_serviceable: "Let me check if your pincode is serviceable. Please enter it.",
  product_giftwrap: "Yes! Select the gift wrap option at checkout for a festive touch.",
  wallet_cashback: "Cashbacks (if any) are credited within 3 days to your wallet.",
  low_stock: "Hurry! That product is selling fast and only a few left in stock.",
  similar_products: "Looking for similar styles? I’ll pull some suggestions for you!"
};

function detectIntent(text = '') {
  const input = text.toLowerCase();

  if (/cod|cash\s?on\s?delivery|delivery cash/.test(input)) return 'cod_available';
  if (/return|refund|exchange|give back/.test(input)) return 'return_policy';
  if (/track.*order|order.*status|order\s?#|where.*order/.test(input)) return 'track_order';
  if (/gift\s?card|voucher|gift|redeem code/.test(input)) return 'gift_cards';
  if (/cancel.*order/.test(input)) return 'cancel_order';
  if (/shipping.*charge|delivery.*fee/.test(input)) return 'shipping_charges';
  if (/payment.*mode|how.*pay|methods.*payment/.test(input)) return 'payment_modes';
  if (/international.*shipping|ship.*outside/.test(input)) return 'international_shipping';
  if (/change.*address|update.*address/.test(input)) return 'change_address';
  if (/order.*confirmation|confirm.*order/.test(input)) return 'order_confirmation';
  if (/delay.*order|late.*delivery/.test(input)) return 'delay_order';
  if (/order.*status|status.*order/.test(input)) return 'order_status';
  if (/refund.*status|my.*refund/.test(input)) return 'refund_status';
  if (/exchange.*policy|change.*product/.test(input)) return 'exchange_policy';
  if (/product.*availability|back.*stock/.test(input)) return 'product_availability';
  if (/size.*guide|which.*size|fit.*info/.test(input)) return 'size_guide';
  if (/account.*update|change.*details/.test(input)) return 'account_update';
  if (/forgot.*password|reset.*password/.test(input)) return 'forgot_password';
  if (/review.*product|rate.*item/.test(input)) return 'review_product';
  if (/remove.*cart|delete.*cart/.test(input)) return 'remove_item_cart';
  if (/apply.*coupon|promo.*code/.test(input)) return 'add_coupon';
  if (/invalid.*coupon|coupon.*not.*working/.test(input)) return 'coupon_invalid';
  if (/new.*arrival|latest.*product/.test(input)) return 'new_arrivals';
  if (/bestseller|top.*selling|trending/.test(input)) return 'bestsellers';
  if (/out.*stock|sold.*out/.test(input)) return 'out_of_stock';
  if (/product.*material|fabric|cloth/.test(input)) return 'product_material';
  if (/wash.*instruction|how.*wash/.test(input)) return 'wash_instructions';
  if (/delivery.*time|how.*long|shipping.*time/.test(input)) return 'delivery_timeline';
  if (/cancel.*after.*shipping|cancel.*shipped/.test(input)) return 'cancel_after_shipping';
  if (/invoice.*request|bill.*copy/.test(input)) return 'invoice_request';
  if (/contact.*support|talk.*agent|help.*desk/.test(input)) return 'contact_support';
  if (/not.*responding|not.*working|bot.*issue/.test(input)) return 'chat_unresponsive';
  if (/trending.*now|hot.*product/.test(input)) return 'trending_now';
  if (/multiple.*items|add.*more/.test(input)) return 'multiple_items';
  if (/bulk.*order|wholesale/.test(input)) return 'bulk_order';
  if (/color.*variant|other.*color/.test(input)) return 'color_variants';
  if (/wallet.*pay|upi|phonepe|paytm/.test(input)) return 'wallet_payment';
  if (/dispatch.*time|when.*dispatched/.test(input)) return 'dispatch_info';
  if (/mobile.*app|android|ios.*app/.test(input)) return 'mobile_app';
  if (/newsletter|subscribe.*email/.test(input)) return 'newsletter_signup';
  if (/loyalty.*points|reward.*program/.test(input)) return 'loyalty_points';
  if (/festive.*offer|diwali.*deal|discount.*code/.test(input)) return 'festive_offer';
  if (/edit.*order|modify.*order/.test(input)) return 'order_edit';
  if (/delivery.*partner|courier/.test(input)) return 'delivery_partner';
  if (/check.*pincode|service.*area/.test(input)) return 'pincode_serviceable';
  if (/gift.*wrap|wrap.*option/.test(input)) return 'product_giftwrap';
  if (/wallet.*cashback|credit.*wallet/.test(input)) return 'wallet_cashback';
  if (/low.*stock|only.*few.*left/.test(input)) return 'low_stock';
  if (/similar.*product|like.*this|related.*item/.test(input)) return 'similar_products';

  return null;
}

chatRoutes.post('/chat', authUser, async (req, res) => {
  try {
    const { message } = req.body;
    const user = req.user;
    const input = message?.toLowerCase() || '';

    if (!user) return res.json({ reply: 'Session expired or not authorized. Please log in again.' });

    // ✅ Static FAQ replies
    const intent = detectIntent(input);
    if (intent && FAQ_RESPONSES[intent]) {
      return res.json({ reply: FAQ_RESPONSES[intent] });
    }

    // 🧾 "What's my name?"
    if (/what(?:'s| is)? my name/.test(input)) {
      return res.json({ reply: `Your name is ${user.name}. Glad to have you back!` });
    }

    // 🛒 "What's in my cart?"
    if (/cart|what.*in.*cart|my.*cart/.test(input)) {
      const cartData = user.cartData;
      if (!cartData || Object.keys(cartData).length === 0) {
        return res.json({ reply: "Your cart is currently empty. Let's go shopping! 🛍️" });
      }

      const productIds = Object.keys(cartData);
      const products = await productModel.find({ _id: { $in: productIds } });

      let itemList = '';
      for (let product of products) {
        const sizes = cartData[product._id.toString()];
        for (let size in sizes) {
          const quantity = sizes[size];
          if (quantity > 0) {
            const price = product.price * quantity;
            itemList += `• ${product.name} (${size}) × ${quantity} – ₹${price}\n`;
          }
        }
      }

      if (!itemList) {
        return res.json({ reply: "Your cart is currently empty. Let's go shopping! 🛍️" });
      }

      return res.json({ reply: `Here's what's in your cart:\n\n${itemList}` });
    }

    // 📦 Last order or previous orders
    if (/\b(last|previous)\b.*\border\b/.test(input)) {
      const recentOrders = await orderModel.find({ userId: user._id.toString() }).sort({ date: -1 });

      if (!recentOrders.length) {
        return res.json({ reply: "You haven’t placed any orders yet." });
      }

      if (/last order|most recent order/.test(input)) {
        const order = recentOrders[0];
        return res.json({ reply: `Your last order was #${order._id} for ₹${order.amount}. Status: ${order.status}` });
      }

      const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const filtered = recentOrders.filter(order => order.date >= oneMonthAgo);

      if (!filtered.length) {
        return res.json({ reply: "You haven’t placed any orders in the last month." });
      }

      const summaries = filtered.map(order =>
        `• Order #${order._id} – ₹${order.amount} – ${order.status}`
      ).join('\n');

      return res.json({ reply: `Here are your recent orders:\n\n${summaries}` });
    }

    // 🚚 Delivery estimate
    if (/deliver|when.*order|arrive|reach|shipping estimate/.test(input)) {
      const latestOrder = await orderModel.findOne({ userId: user._id.toString() }).sort({ date: -1 });

      if (!latestOrder || !latestOrder.date) {
        return res.json({ reply: "I couldn’t find a recent order to estimate delivery for." });
      }

      const orderedDaysAgo = Math.floor((Date.now() - latestOrder.date) / (1000 * 60 * 60 * 24));
      const expectedDays = 5;
      const eta = expectedDays - orderedDaysAgo;

      const reply =
        eta > 0
          ? `📦 Your order is expected to arrive in approximately ${eta} day${eta === 1 ? '' : 's'}.`
          : `✅ Your order should have arrived already. If not, feel free to contact support.`;

      return res.json({ reply });
    }

    // 💬 Specific review check (for jeans, saree, etc)
    if (/review.*(jeans|kurta|saree|tshirt)/.test(input)) {
      const keyword = input.match(/(jeans|kurta|saree|tshirt)/)?.[1];
      const products = await productModel.find({ name: { $regex: keyword, $options: 'i' } });

      if (!products.length) {
        return res.json({ reply: `I couldn't find products matching "${keyword}".` });
      }

      const productIds = products.map(p => p._id.toString());
      const comment = await commentModel.findOne({
        user: user.name,
        productId: { $in: productIds }
      });

      if (comment) {
        const date = new Date(comment.timestamp).toLocaleDateString();
        return res.json({ reply: `Yes, you commented on a ${keyword} on ${date}: "${comment.text}"` });
      } else {
        return res.json({ reply: `You haven’t left a review for any ${keyword} yet.` });
      }
    }

    // 💬 General: "Show my reviews"
    if (/my reviews|reviews i wrote|my feedback/.test(input)) {
      const comments = await commentModel.find({ user: user.name });

      if (!comments.length) {
        return res.json({ reply: "You haven't submitted any reviews yet." });
      }

      const formatted = comments.map(c => {
        const date = new Date(c.timestamp).toLocaleDateString();
        return `• ${c.text} (on ${date})`;
      }).join('\n');

      return res.json({ reply: `Here are your reviews:\n\n${formatted}` });
    }

    
function formatProductCard(p, format = 'markdown') {
  const img = p.image || '/fallback.jpg';
  if (format === 'html') {
    return `
      <img src="${img}" alt="${p.name}" style="max-width:100%; border-radius:8px; /><br/>
      <b>${p.name}</b><br/>₹${p.price} · ${p.category}<br/>
      <a href="/product/${p._id}">View Product</a>
    `;
  } else {
    return `![${p.name}](${img})\n🛍️ *${p.name}*\n₹${p.price} · ${p.category}\n[View Product](/product/${p._id})`;
  }
}

// show me your trending or best products and function logic is above

if (/best.*product|top.*product|bestseller|trending/.test(input)) {
  const bestProducts = await productModel.find({ bestseller: true }).sort({ date: -1 }).limit(4);

  if (!bestProducts.length) {
    return res.json({ reply: "No bestsellers yet — izzi's still curating 🧵" });
  }

  const formatType = 'markdown'; // change to 'html' if frontend prefers HTML
  const cards = bestProducts.map(p => formatProductCard(p, formatType));

  return res.json({
    reply: `Here's what's trending:\n\n${cards.join('\n\n')}`
  });
}
    // 🧠 Fallback to openrouter(any model like mistral, claude, deepseek) AI
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/auto',
        messages: [
          {
            role: 'system',
            content: `You are a helpful ecommerce chatbot for an Indian clothing site. Assist users with product questions, orders, support, and more. The user’s name is ${user.name}. so, your name is 🤖 izzi and introduce yourself but be specific, short, clear and concise.If someone appreciates you then give them compliment with emoji.`
          },
          {
            role: 'user',
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content || "🤖 Sorry, I couldn't generate a reply.";
    res.json({ reply });

  } catch (error) {
    console.error('Chat error:', error.message);
    res.json({ reply: '⚠️ Something went wrong. Please try again later.' });
  }
});

export default chatRoutes;