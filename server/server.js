import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory state
const state = {
  companies: {},
  listings: [],
  wallets: {},
  transactions: [],
};

// Helper broadcast
const clients = new Set();
function broadcast(type, data) {
  const msg = JSON.stringify({ type, data, ts: Date.now() });
  for (const ws of clients) {
    try { ws.send(msg); } catch {}
  }
}

// REST endpoints
app.get('/health', (_, res) => res.json({ ok: true }));

app.get('/listings', (_, res) => res.json(state.listings.filter(l => l.status === 'active')));

app.post('/listings', (req, res) => {
  const { sellerId, seller, sellerLogo, quantity, price, type, vintage, project, location } = req.body;
  const listing = {
    id: `ML${Date.now()}`,
    sellerId, seller, sellerLogo,
    quantity, price, total: quantity * price,
    type, vintage, project, location,
    dateCreated: new Date().toISOString(),
    status: 'active'
  };
  state.listings.push(listing);
  broadcast('MARKETPLACE_UPDATE', { action: 'add', listing });
  res.json(listing);
});

app.post('/purchase', (req, res) => {
  const { buyerId, listingId } = req.body;
  const listing = state.listings.find(l => l.id === listingId && l.status === 'active');
  if (!listing) return res.status(404).json({ error: 'Listing not found' });

  const amount = listing.total;
  const buyerBal = state.wallets[buyerId] ?? 2500000;
  const sellerBal = state.wallets[listing.sellerId] ?? 2500000;
  if (buyerBal < amount) return res.status(400).json({ error: 'Insufficient funds' });

  state.wallets[buyerId] = buyerBal - amount;
  state.wallets[listing.sellerId] = sellerBal + amount;
  listing.status = 'sold';

  const txn = {
    id: `TXN${Date.now()}`,
    type: 'purchase',
    buyerId,
    sellerId: listing.sellerId,
    listingId,
    amount,
    quantity: listing.quantity,
    price: listing.price,
    ts: Date.now()
  };
  state.transactions.push(txn);

  broadcast('TRANSACTION', txn);
  broadcast('WALLET_UPDATE', { userId: buyerId, balance: state.wallets[buyerId] });
  broadcast('WALLET_UPDATE', { userId: listing.sellerId, balance: state.wallets[listing.sellerId] });
  broadcast('MARKETPLACE_UPDATE', { action: 'remove', listingId });
  res.json({ ok: true, txn, buyerBalance: state.wallets[buyerId], sellerBalance: state.wallets[listing.sellerId] });
});

app.get('/wallet/:id', (req, res) => {
  const bal = state.wallets[req.params.id] ?? 2500000;
  res.json({ balance: bal });
});

const server = app.listen(process.env.PORT || 5178, () => {
  console.log('Server listening on', server.address().port);
});

// WebSocket
const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
  // Send initial snapshot
  ws.send(JSON.stringify({ type: 'SNAPSHOT', data: {
    listings: state.listings.filter(l => l.status === 'active'),
    wallets: state.wallets,
    transactions: state.transactions.slice(-50)
  }}));
});
