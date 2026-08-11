const crypto = require('crypto');
const prisma = require('../db');
const { sendTextMessage, sendTemplateMessage } = require('../services/whatsappService');

function verifyWebhookSignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) return false;

  const rawBody = req.rawBody;
  if (!rawBody) return false;

  const expected = `sha256=${crypto
    .createHmac('sha256', process.env.META_APP_SECRET)
    .update(rawBody)
    .digest('hex')}`;

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

function verifyWebhook(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  const expected = process.env.VERIFY_TOKEN;

  console.log('[webhook-verify] mode=', mode);
  console.log('[webhook-verify] token=', token);
  console.log('[webhook-verify] expected=', expected);
  console.log('[webhook-verify] token matches =', token === expected);

  if (mode === 'subscribe' && token === expected) {
    console.log('Webhook verified.');
    return res.status(200).send(challenge);
  }

  const reason =
    mode !== 'subscribe'
      ? `mode is "${mode}" (expected "subscribe")`
      : 'verify_token does not match';
  console.error(`[webhook-verify] FAILED: ${reason}`);
  return res.sendStatus(403);
}

async function receiveWebhook(req, res) {
  try {
    if (!verifyWebhookSignature(req)) {
      const signature = req.headers['x-hub-signature-256'];
      const expected = req.rawBody
        ? `sha256=${crypto
            .createHmac('sha256', process.env.META_APP_SECRET)
            .update(req.rawBody)
            .digest('hex')}`
        : '(no raw body captured)';
      console.error('[webhook-receive] SIGNATURE FAILED');
      console.error('[webhook-receive] received:', signature || '(none)');
      console.error('[webhook-receive] expected:', expected);
      console.error('[webhook-receive] meta_app_secret set:', Boolean(process.env.META_APP_SECRET));
      return res.sendStatus(403);
    }

    const body = req.body;

    if (body.object !== 'whatsapp_business_account') {
      console.error(`[webhook-receive] UNKNOWN OBJECT: "${body.object}"`);
      return res.sendStatus(404);
    }

    const entries = body.entry || [];

    for (const entry of entries) {
      const changes = entry.changes || [];

      for (const change of changes) {
        const value = change.value || {};

        if (change.field === 'messages') {
          await handleIncomingMessage(value);
        } else if (change.field === 'message_status') {
          await handleStatusUpdate(value);
        }
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error('[webhook-receive] processing error:', error.stack || error);
    console.error('[webhook-receive] body:', JSON.stringify(req.body));
    return res.sendStatus(500);
  }
}

async function handleIncomingMessage(value) {
  const messages = value.messages || [];
  const metadata = value.metadata || {};
  const contacts = value.contacts || [];

  for (const msg of messages) {
    const from = msg.from;
    const messageType = msg.type;
    const messageId = msg.id;
    const timestamp = new Date(parseInt(msg.timestamp) * 1000);

    let messageBody = '';

    if (messageType === 'text') {
      messageBody = msg.text?.body || '';
    } else if (messageType === 'image') {
      messageBody = '[Image]';
    } else if (messageType === 'video') {
      messageBody = '[Video]';
    } else if (messageType === 'audio') {
      messageBody = '[Audio]';
    } else if (messageType === 'document') {
      messageBody = '[Document]';
    } else {
      messageBody = `[${messageType}]`;
    }

    const contactName = contacts[0]?.profile?.name || from;

    let customer = await prisma.customer.findUnique({
      where: { whatsapp_number: from },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: contactName,
          whatsapp_number: from,
        },
      });
    }

    let conversation = await prisma.conversation.findFirst({
      where: {
        customer_id: customer.id,
        status: { in: ['NEW', 'ASSIGNED', 'IN_PROGRESS'] },
      },
      orderBy: { updated_at: 'desc' },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          customer_id: customer.id,
          status: 'NEW',
        },
      });
    }

    const existingMessage = await prisma.message.findFirst({
      where: { meta_message_id: messageId },
    });

    if (existingMessage) {
      console.log(`Duplicate message ${messageId} skipped.`);
      continue;
    }

    await prisma.message.create({
      data: {
        conversation_id: conversation.id,
        sender: from,
        message: messageBody,
        timestamp,
        direction: 'INBOUND',
        status: 'DELIVERED',
        meta_message_id: messageId,
      },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updated_at: new Date() },
    });

    console.log(`Stored inbound message from ${from} in conversation ${conversation.id}`);
  }
}

async function handleStatusUpdate(value) {
  const statuses = value.statuses || [];

  for (const status of statuses) {
    const messageId = status.id;
    const messageStatus = status.status;

    if (!messageId || !messageStatus) continue;

    const statusMap = {
      sent: 'SENT',
      delivered: 'DELIVERED',
      read: 'READ',
      failed: 'FAILED',
    };

    const mappedStatus = statusMap[messageStatus.toLowerCase()];
    if (!mappedStatus) continue;

    try {
      const updated = await prisma.message.findFirst({
        where: { meta_message_id: messageId },
      });

      if (updated) {
        await prisma.message.update({
          where: { id: updated.id },
          data: { status: mappedStatus },
        });
        console.log(`Updated message ${messageId} status to ${mappedStatus}`);
      }
    } catch (error) {
      console.error(`Failed to update status for message ${messageId}:`, error);
    }
  }
}

async function sendMessage(req, res) {
  try {
    const { conversation_id, message } = req.body;
    const { id: userId, role } = req.user;

    if (!conversation_id || !message) {
      return res.status(400).json({ error: 'conversation_id and message are required.' });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversation_id },
      include: { customer: true },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    if (role === 'AGENT' && conversation.assigned_to !== userId) {
      return res.status(403).json({ error: 'Access denied. Conversation not assigned to you.' });
    }

    const whatsappResponse = await sendTextMessage(conversation.customer.whatsapp_number, message);
    const metaMessageId = whatsappResponse?.messages?.[0]?.id;

    const newMessage = await prisma.message.create({
      data: {
        conversation_id,
        sender: conversation.customer.whatsapp_number,
        message,
        direction: 'OUTBOUND',
        status: 'SENT',
        meta_message_id: metaMessageId,
      },
    });

    await prisma.conversation.update({
      where: { id: conversation_id },
      data: { updated_at: new Date() },
    });

    if (conversation.status === 'ASSIGNED') {
      await prisma.conversation.update({
        where: { id: conversation_id },
        data: { status: 'IN_PROGRESS' },
      });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('[send-message] error:', error.response?.data || error.message);
    console.error('[send-message] status:', error.response?.status);
    console.error('[send-message] stack:', error.stack);
    res.status(500).json({ error: 'Failed to send message via WhatsApp API.' });
  }
}

async function sendTemplate(req, res) {
  try {
    const { conversation_id, template_name, language_code } = req.body;
    const { id: userId, role } = req.user;

    if (!conversation_id || !template_name) {
      return res.status(400).json({ error: 'conversation_id and template_name are required.' });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversation_id },
      include: { customer: true },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    if (role === 'AGENT' && conversation.assigned_to !== userId) {
      return res.status(403).json({ error: 'Access denied. Conversation not assigned to you.' });
    }

    const whatsappResponse = await sendTemplateMessage(
      conversation.customer.whatsapp_number,
      template_name,
      language_code || 'en'
    );

    const metaMessageId = whatsappResponse?.messages?.[0]?.id;

    const newMessage = await prisma.message.create({
      data: {
        conversation_id,
        sender: conversation.customer.whatsapp_number,
        message: `[Template: ${template_name}]`,
        direction: 'OUTBOUND',
        status: 'SENT',
        meta_message_id: metaMessageId,
      },
    });

    await prisma.conversation.update({
      where: { id: conversation_id },
      data: { updated_at: new Date() },
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('[send-template] error:', error.response?.data || error.message);
    console.error('[send-template] status:', error.response?.status);
    console.error('[send-template] stack:', error.stack);
    res.status(500).json({ error: 'Failed to send template via WhatsApp API.' });
  }
}

module.exports = {
  verifyWebhook,
  receiveWebhook,
  sendMessage,
  sendTemplate,
};
