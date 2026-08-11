const prisma = require('../db');

async function listMessages(req, res) {
  try {
    const { conversation_id } = req.query;
    const { id: userId, role } = req.user;

    if (!conversation_id) {
      return res.status(400).json({ error: 'conversation_id is required.' });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversation_id },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    if (role === 'AGENT' && conversation.assigned_to !== userId) {
      return res.status(403).json({ error: 'Access denied. Conversation not assigned to you.' });
    }

    const messages = await prisma.message.findMany({
      where: { conversation_id },
      orderBy: { timestamp: 'asc' },
    });

    res.json(messages);
  } catch (error) {
    console.error('List messages error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

async function createMessage(req, res) {
  try {
    const { conversation_id, sender, message, direction } = req.body;
    const { id: userId, role } = req.user;

    if (!conversation_id || !sender || !message || !direction) {
      return res.status(400).json({ error: 'conversation_id, sender, message, and direction are required.' });
    }

    if (!['INBOUND', 'OUTBOUND'].includes(direction)) {
      return res.status(400).json({ error: 'direction must be INBOUND or OUTBOUND.' });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversation_id },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    if (role === 'AGENT' && conversation.assigned_to !== userId) {
      return res.status(403).json({ error: 'Access denied. Conversation not assigned to you.' });
    }

    const newMessage = await prisma.message.create({
      data: {
        conversation_id,
        sender,
        message,
        direction,
        status: direction === 'OUTBOUND' ? 'SENT' : 'DELIVERED',
      },
    });

    await prisma.conversation.update({
      where: { id: conversation_id },
      data: { updated_at: new Date() },
    });

    if (direction === 'OUTBOUND' && conversation.status === 'ASSIGNED') {
      await prisma.conversation.update({
        where: { id: conversation_id },
        data: { status: 'IN_PROGRESS' },
      });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

async function updateMessageStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['SENT', 'DELIVERED', 'READ', 'FAILED'].includes(status)) {
      return res.status(400).json({ error: 'Status must be one of: SENT, DELIVERED, READ, FAILED.' });
    }

    const existing = await prisma.message.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    const updated = await prisma.message.update({
      where: { id },
      data: { status },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { listMessages, createMessage, updateMessageStatus };
