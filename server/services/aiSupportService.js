const mongoose = require('mongoose');
const Order = require('../models/Order');
const Return = require('../models/Return');

const AI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const OPENAI_API_URL = process.env.OPENAI_API_URL || 'https://api.openai.com/v1/responses';

const REPAIR_SERVICES = [
  { key: 'walk-in', label: 'Walk-in Service', note: 'Best when the customer can visit the store directly.' },
  { key: 'pickup', label: 'Pickup Service', note: 'Best when the customer wants the device collected from their location.' },
  { key: 'doorstep', label: 'Doorstep Service', note: 'Best for on-site checks or basic fixes where available.' },
];

const REPAIR_GUIDANCE = {
  screen: { estimate: 'around Rs. 5,499', urgency: 'high', suggestion: 'Book a screen repair and avoid pressure on the display.' },
  battery: { estimate: 'around Rs. 2,499', urgency: 'medium', suggestion: 'Book a battery replacement if the phone drains quickly or shuts down unexpectedly.' },
  'charging-port': { estimate: 'around Rs. 1,999', urgency: 'medium', suggestion: 'Book a charging port inspection if charging is loose, slow, or inconsistent.' },
  speaker: { estimate: 'around Rs. 1,499', urgency: 'low', suggestion: 'Book a speaker or mic diagnostic if audio is muffled or intermittent.' },
  camera: { estimate: 'around Rs. 3,299', urgency: 'medium', suggestion: 'Book a camera repair if focus, image shake, or lens issues are visible.' },
  'water-damage': { estimate: 'around Rs. 3,999', urgency: 'high', suggestion: 'Power the phone off and request urgent inspection for water damage.' },
  software: { estimate: 'around Rs. 999', urgency: 'low', suggestion: 'Book a software repair for crashes, boot loops, or update issues.' },
  other: { estimate: 'after inspection', urgency: 'medium', suggestion: 'Share the issue details and book an inspection so a technician can confirm the fault.' },
};

const RETURN_POLICY = [
  'Returns should be checked against the order status and return request data already stored in the app.',
  'The assistant can explain current return status, but it must not approve or reject returns on its own.',
  'Damaged, defective, or wrong-item issues should be escalated to the returns flow with supporting details.',
];

function detectIntent(message = '', context = {}) {
  const text = `${message} ${JSON.stringify(context || {})}`.toLowerCase();

  if (/(track|where|status|shipped|delivered|order)/.test(text)) {
    return 'order_status';
  }

  if (/(return|refund|replace|damaged|wrong item|defective)/.test(text)) {
    return 'return_eligibility';
  }

  if (/(repair|screen|battery|charging|speaker|camera|water damage|software)/.test(text)) {
    return 'repair_guidance';
  }

  if (/(charger|cable|case|glass|compatib|accessor|fit|iphone|samsung|oneplus|usb-c|lightning)/.test(text)) {
    return 'product_compatibility';
  }

  return 'general_support';
}

function buildStoreContext() {
  return {
    businessName: 'Phone Palace',
    supportedTopics: ['products', 'accessories', 'orders', 'returns', 'repairs', 'referrals', 'coupons'],
    repairServices: REPAIR_SERVICES,
    returnPolicy: RETURN_POLICY,
  };
}

async function buildOrderContext(userPhone, orderId) {
  if (!userPhone || mongoose.connection.readyState !== 1) {
    return null;
  }

  const filter = { userId: userPhone };
  if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
    filter._id = orderId;
  }

  const order = await Order.findOne(filter).sort({ createdAt: -1 }).lean();
  if (!order) {
    return null;
  }

  return {
    id: String(order._id),
    orderNumber: order.orderNumber,
    product: order.product,
    productId: order.productId,
    quantity: order.quantity,
    totalPrice: order.total_price,
    paymentStatus: order.payment_status,
    orderStatus: order.order_status,
    trackingId: order.tracking_id,
    createdAt: order.createdAt,
    shippedAt: order.shippedAt,
    deliveredAt: order.deliveredAt,
    returnStatus: order.returnStatus,
  };
}

async function buildReturnContext(userPhone, orderId) {
  if (!userPhone || mongoose.connection.readyState !== 1) {
    return null;
  }

  const filter = { userId: userPhone };
  if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
    filter.orderId = orderId;
  }

  const returnRequest = await Return.findOne(filter).sort({ createdAt: -1 }).lean();
  if (!returnRequest) {
    return null;
  }

  return {
    orderId: String(returnRequest.orderId),
    productName: returnRequest.productName,
    reason: returnRequest.reason,
    description: returnRequest.description,
    status: returnRequest.status,
    refundAmount: returnRequest.refundAmount,
    refundMethod: returnRequest.refundMethod,
    requestedAt: returnRequest.requestedAt,
    adminNotes: returnRequest.adminNotes,
    returnTrackingId: returnRequest.returnTrackingId,
  };
}

function buildRepairContext(message = '', context = {}) {
  const lowered = `${message} ${JSON.stringify(context || {})}`.toLowerCase();
  const matchedIssue = Object.keys(REPAIR_GUIDANCE).find((issue) => lowered.includes(issue.replace('-', ' ')));
  const issue = matchedIssue || context.problemType || 'other';
  const guidance = REPAIR_GUIDANCE[issue] || REPAIR_GUIDANCE.other;

  return {
    issue,
    guidance,
    services: REPAIR_SERVICES,
  };
}

function buildProductContext(message = '', context = {}) {
  const productSummary = context.productSummary || null;
  const lowered = `${message} ${JSON.stringify(context || {})}`.toLowerCase();

  const family =
    /iphone|lightning|magsafe/.test(lowered) ? 'iPhone' :
    /samsung|galaxy|android/.test(lowered) ? 'Samsung/Android' :
    /oneplus/.test(lowered) ? 'OnePlus' :
    /usb-c/.test(lowered) ? 'USB-C' :
    null;

  return {
    productSummary,
    deviceFamily: family,
  };
}

function buildPromptPayload({ message, intent, storeContext, orderContext, returnContext, repairContext, productContext, userPhone }) {
  return [
    'You are Phone Palace Support Assistant.',
    'Answer only from the supplied store context and user/account context.',
    'Do not invent policies, stock, delivery dates, refund outcomes, or repair guarantees.',
    'If the answer is uncertain, say so clearly and suggest the next safe step.',
    'Keep responses concise, warm, and support-focused.',
    '',
    `Intent: ${intent}`,
    `User phone: ${userPhone || 'guest'}`,
    `Store context: ${JSON.stringify(storeContext, null, 2)}`,
    `Order context: ${JSON.stringify(orderContext, null, 2)}`,
    `Return context: ${JSON.stringify(returnContext, null, 2)}`,
    `Repair context: ${JSON.stringify(repairContext, null, 2)}`,
    `Product context: ${JSON.stringify(productContext, null, 2)}`,
    '',
    `Customer message: ${message}`,
  ].join('\n');
}

async function callOpenAI(prompt) {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: prompt,
            },
          ],
        },
      ],
      temperature: 0.3,
      max_output_tokens: 220,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.output_text?.trim() || null;
}

function formatDate(date) {
  if (!date) {
    return null;
  }

  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function generateFallbackReply({ intent, orderContext, returnContext, repairContext, productContext, userPhone }) {
  switch (intent) {
    case 'order_status':
      if (!userPhone) {
        return 'I can help with order status once you log in. If you are already signed in, ask again and I will check your latest order details.';
      }

      if (!orderContext) {
        return 'I could not find an order tied to this account yet. If you placed one recently, please share the order number or check My Orders.';
      }

      return `Your latest order ${orderContext.orderNumber || ''} for ${orderContext.product} is currently ${orderContext.orderStatus}. Payment is ${orderContext.paymentStatus}.${orderContext.trackingId ? ` Tracking ID: ${orderContext.trackingId}.` : ''}${orderContext.deliveredAt ? ` Delivered on ${formatDate(orderContext.deliveredAt)}.` : orderContext.shippedAt ? ` Shipped on ${formatDate(orderContext.shippedAt)}.` : ''}`.trim();

    case 'return_eligibility':
      if (returnContext) {
        return `Your latest return request for ${returnContext.productName} is currently ${returnContext.status}. Reason: ${returnContext.reason}.${returnContext.refundAmount ? ` Refund amount marked so far: Rs. ${returnContext.refundAmount}.` : ''}${returnContext.adminNotes ? ` Admin note: ${returnContext.adminNotes}` : ''}`.trim();
      }

      if (orderContext) {
        return `I can see order ${orderContext.orderNumber || ''} is ${orderContext.orderStatus} with return status ${orderContext.returnStatus}. I cannot approve a return from chat, but you can use the returns flow if the item is damaged, defective, or not as expected.`;
      }

      return 'I can explain return status and next steps, but I cannot approve refunds from chat. If you share the order or open the returns flow, I can guide you more precisely.';

    case 'repair_guidance': {
      const issueLabel = repairContext.issue === 'other' ? 'that issue' : repairContext.issue.replace('-', ' ');
      const recommendedService = repairContext.services[repairContext.issue === 'screen' || repairContext.issue === 'battery' ? 1 : 0];
      return `For ${issueLabel}, I would start with ${recommendedService.label.toLowerCase()}. Typical estimate is ${repairContext.guidance.estimate}, and urgency looks ${repairContext.guidance.urgency}. ${repairContext.guidance.suggestion}`;
    }

    case 'product_compatibility':
      if (productContext.productSummary) {
        const compatible = productContext.productSummary.compatibleWith?.slice(0, 4).join(', ');
        return `${productContext.productSummary.name} is best suited for ${compatible || 'the listed compatible devices on the product page'}. It is currently ${productContext.productSummary.stockStatus} and priced at Rs. ${productContext.productSummary.price}.`;
      }

      if (productContext.deviceFamily === 'iPhone') {
        return 'For iPhone users, a good starter combination is a 30W charger plus a compatible Lightning or MagSafe-style accessory depending on the model. If you tell me the exact iPhone model, I can narrow it down.';
      }

      if (productContext.deviceFamily) {
        return `For ${productContext.deviceFamily} devices, I can help with chargers, cables, cases, and glass. Share the exact phone model for a more precise recommendation.`;
      }

      return 'I can help with product compatibility for chargers, cases, cables, tempered glass, and repair accessories. Share the exact phone model or open a product page for a more specific answer.';

    default:
      return 'I can help with orders, returns, repairs, and product compatibility. Ask about a recent order, a repair issue, or the phone model you are shopping for.';
  }
}

async function getSupportReply({ message, context = {}, userPhone = null }) {
  const intent = detectIntent(message, context);
  const storeContext = buildStoreContext();
  const [orderContext, returnContext] = await Promise.all([
    buildOrderContext(userPhone, context.orderId),
    buildReturnContext(userPhone, context.orderId),
  ]);
  const repairContext = buildRepairContext(message, context);
  const productContext = buildProductContext(message, context);

  const prompt = buildPromptPayload({
    message,
    intent,
    storeContext,
    orderContext,
    returnContext,
    repairContext,
    productContext,
    userPhone,
  });

  try {
    const aiReply = await callOpenAI(prompt);
    if (aiReply) {
      return {
        reply: aiReply,
        intent,
        usedModel: true,
      };
    }
  } catch (error) {
    console.error('AI support model error:', error.message);
  }

  return {
    reply: generateFallbackReply({
      intent,
      orderContext,
      returnContext,
      repairContext,
      productContext,
      userPhone,
    }),
    intent,
    usedModel: false,
  };
}

module.exports = {
  detectIntent,
  getSupportReply,
};
