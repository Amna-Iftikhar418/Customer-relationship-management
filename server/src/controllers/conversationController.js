const prisma = require('../db');

const VALID_STATUSES = ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

const ALLOWED_TRANSITIONS = {
  NEW: ['ASSIGNED', 'CLOSED'],
  ASSIGNED: ['IN_PROGRESS', 'CLOSED'],
  IN_PROGRESS: ['RESOLVED', 'CLOSED'],
  RESOLVED: ['CLOSED'],
  CLOSED: [],
};

async function listConversations(req, res) {
  try {
    const { status, assigned_to } = req.query;
    const { id: userId, role } = req.user;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (assigned_to) {
      where.assigned_to = assigned_to;
    }

    if (role === 'AGENT') {
      where.assigned_to = userId;
    }

    const conversations = await prisma.conversation.findMany({
      where,
      orderBy: { updated_at: 'desc' },
      include: {
        customer: { select: { id: true, name: true, whatsapp_number: true } },
        agent: { select: { id: true, name: true } },
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    res.json(conversations);
  } catch (error) {
    console.error('List conversations error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

async function getConversation(req, res) {
  try {
    const { id } = req.params;
    const { id: userId, role } = req.user;

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, name: true, whatsapp_number: true } },
        agent: { select: { id: true, name: true } },
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    if (role === 'AGENT' && conversation.assigned_to !== userId) {
      return res.status(403).json({ error: 'Access denied. Conversation not assigned to you.' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

async function createConversation(req, res) {
  try {
    const { customer_id, status } = req.body;

    if (!customer_id) {
      return res.status(400).json({ error: 'customer_id is required.' });
    }

    const customer = await prisma.customer.findUnique({ where: { id: customer_id } });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const conversation = await prisma.conversation.create({
      data: {
        customer_id,
        status: status || 'NEW',
      },
      include: {
        customer: { select: { id: true, name: true, whatsapp_number: true } },
      },
    });

    res.status(201).json(conversation);
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { id: userId, role } = req.user;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const conversation = await prisma.conversation.findUnique({ where: { id } });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    if (role === 'AGENT' && conversation.assigned_to !== userId) {
      return res.status(403).json({ error: 'Access denied. Conversation not assigned to you.' });
    }

    const allowedNext = ALLOWED_TRANSITIONS[conversation.status];
    if (!allowedNext.includes(status)) {
      return res.status(400).json({
        error: `Cannot transition from ${conversation.status} to ${status}. Allowed: ${allowedNext.join(', ') || 'none'}`,
      });
    }

    const updated = await prisma.conversation.update({
      where: { id },
      data: { status },
      include: {
        customer: { select: { id: true, name: true, whatsapp_number: true } },
        agent: { select: { id: true, name: true } },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

async function assignConversation(req, res) {
  try {
    const { id } = req.params;
    const { agent_id } = req.body;

    if (!agent_id) {
      return res.status(400).json({ error: 'agent_id is required.' });
    }

    const conversation = await prisma.conversation.findUnique({ where: { id } });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    const agent = await prisma.user.findUnique({ where: { id: agent_id } });
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found.' });
    }

    const updated = await prisma.conversation.update({
      where: { id },
      data: {
        assigned_to: agent_id,
        status: conversation.status === 'NEW' ? 'ASSIGNED' : conversation.status,
      },
      include: {
        customer: { select: { id: true, name: true, whatsapp_number: true } },
        agent: { select: { id: true, name: true } },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Assign conversation error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

async function reassignConversation(req, res) {
  try {
    const { id } = req.params;
    const { agent_id } = req.body;

    if (!agent_id) {
      return res.status(400).json({ error: 'agent_id is required.' });
    }

    const conversation = await prisma.conversation.findUnique({ where: { id } });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    const agent = await prisma.user.findUnique({ where: { id: agent_id } });
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found.' });
    }

    const updated = await prisma.conversation.update({
      where: { id },
      data: {
        assigned_to: agent_id,
        status: 'ASSIGNED',
      },
      include: {
        customer: { select: { id: true, name: true, whatsapp_number: true } },
        agent: { select: { id: true, name: true } },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Reassign conversation error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = {
  listConversations,
  getConversation,
  createConversation,
  updateStatus,
  assignConversation,
  reassignConversation,
};
