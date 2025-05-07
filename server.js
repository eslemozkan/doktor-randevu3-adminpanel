const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Supabase bağlantı bilgilerini doğrudan burada tanımla
const SUPABASE_URL = 'https://xtezjzgzwckufeoziwfu.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0ZXpqemd6d2NrdWZlb3ppd2Z1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTYxNTg4NiwiZXhwIjoyMDYxMTkxODg2fQ.My02ndkmJm0G-IUsHDLIoL3IYDY0Hj5VmIhFSwXFfmM'; // Buraya kendi service_role key'ini yapıştır

console.log('SUPABASE_URL:', SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY);

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));
app.use(express.json());

app.options('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

// Tüm randevuları getir (Supabase'den)
app.get('/api/appointments', async (req, res) => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// Randevu güncelle (Supabase'de)
app.put('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return res.status(404).json({ error: error?.message || "Randevu bulunamadı" });
  }
  res.json(data);
});

// Mail gönderme endpointi
const sendAppointmentMail = require('./send-appointment-mail');
app.use('/api/send-appointment-mail', sendAppointmentMail);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
}); 