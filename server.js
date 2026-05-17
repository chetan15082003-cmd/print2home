const express    = require('express');
const cors       = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app  = express();
const PORT = 3001;

// ⚠️ REPLACE WITH YOUR SUPABASE DETAILS
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-public-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// ===== GENERATE TICKET NUMBER =====
function generateTicket() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ticket = 'P2H-';
  for (let i = 0; i < 7; i++) {
    ticket += chars[Math.floor(Math.random() * chars.length)];
  }
  return ticket;
}

// ===== SAVE LEAD → PostgreSQL =====
app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, phone, country, brand, issue, device } = req.body;
    const ticket = generateTicket();

    const { data, error } = await supabase
      .from('leads')
      .insert([{
        ticket,
        name,
        email,
        phone,
        country,
        brand,
        issue,
        device,
        status: 'Open'
      }])
      .select();

    if (error) throw error;

    console.log('✅ Lead saved:', ticket, name, brand);
    res.json({ status: 'success', ticket, data });

  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ===== GET ALL LEADS (Admin Panel) =====
app.get('/api/leads', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ status: 'success', data });

  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ===== UPDATE TICKET STATUS =====
app.patch('/api/leads/:ticket', async (req, res) => {
  try {
    const { ticket } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('ticket', ticket)
      .select();

    if (error) throw error;

    res.json({ status: 'success', data });

  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ===== DELETE LEAD =====
app.delete('/api/leads/:ticket', async (req, res) => {
  try {
    const { ticket } = req.params;

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('ticket', ticket);

    if (error) throw error;

    res.json({ status: 'success', message: 'Lead deleted' });

  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ===== GET STATS =====
app.get('/api/stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('status, brand');

    if (error) throw error;

    const stats = {
      total:    data.length,
      open:     data.filter(d => d.status === 'Open').length,
      progress: data.filter(d => d.status === 'In Progress').length,
      resolved: data.filter(d => d.status === 'Resolved').length,
      hp:       data.filter(d => d.brand === 'HP').length,
      canon:    data.filter(d => d.brand === 'Canon').length,
      epson:    data.filter(d => d.brand === 'Epson').length,
      brother:  data.filter(d => d.brand === 'Brother').length,
    };

    res.json({ status: 'success', stats });

  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Print2Home server running on http://localhost:${PORT}`);
  console.log(`📊 PostgreSQL connected via Supabase`);
});