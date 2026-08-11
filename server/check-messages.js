const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

p.message.findMany({
  orderBy: { timestamp: 'desc' },
  take: 5,
  include: { conversation: { include: { customer: true } } }
}).then(m => {
  console.log('=== 5 NEW MESSAGES ===');
  m.forEach((x, i) => {
    console.log('[' + (i + 1) + '] From: ' + x.sender);
    console.log('    Message: ' + x.message);
    console.log('    Direction: ' + x.direction);
    console.log('    Meta ID: ' + x.meta_message_id);
    console.log('    Customer: ' + (x.conversation && x.conversation.customer ? x.conversation.customer.name : 'N/A'));
    console.log('    Conv ID: ' + (x.conversation ? x.conversation.id : 'N/A'));
    console.log('    Conv Status: ' + (x.conversation ? x.conversation.status : 'N/A'));
    console.log('---');
  });
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
