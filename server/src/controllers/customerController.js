const prisma = require('../db');

async function listCustomers(req, res) {
  try {
    const { search } = req.query;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { whatsapp_number: { contains: search } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        conversations: {
          select: { id: true, status: true, updated_at: true },
          orderBy: { updated_at: 'desc' },
          take: 1,
        },
      },
    });

    res.json(customers);
  } catch (error) {
    console.error('List customers error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

async function getCustomer(req, res) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
      include: {
        conversations: {
          orderBy: { updated_at: 'desc' },
          include: {
            agent: { select: { id: true, name: true } },
            messages: {
              orderBy: { timestamp: 'desc' },
              take: 5,
            },
          },
        },
      },
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

async function findByWhatsApp(req, res) {
  try {
    const { number } = req.query;

    if (!number) {
      return res.status(400).json({ error: 'WhatsApp number is required.' });
    }

    const customer = await prisma.customer.findUnique({
      where: { whatsapp_number: number },
    });

    res.json(customer);
  } catch (error) {
    console.error('Find customer error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

async function createCustomer(req, res) {
  try {
    const { name, whatsapp_number, email } = req.body;

    if (!name || !whatsapp_number) {
      return res.status(400).json({ error: 'Name and WhatsApp number are required.' });
    }

    const existing = await prisma.customer.findUnique({
      where: { whatsapp_number },
    });
    if (existing) {
      return res.status(409).json({ error: 'Customer with this WhatsApp number already exists.' });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        whatsapp_number,
        ...(email && { email }),
      },
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

async function updateCustomer(req, res) {
  try {
    const { name, email } = req.body;
    const { id } = req.params;

    const existing = await prisma.customer.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email !== undefined && { email }),
      },
    });

    res.json(customer);
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

async function deleteCustomer(req, res) {
  try {
    const { id } = req.params;

    const existing = await prisma.customer.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    await prisma.customer.delete({ where: { id } });

    res.json({ message: 'Customer deleted successfully.' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { listCustomers, getCustomer, findByWhatsApp, createCustomer, updateCustomer, deleteCustomer };
