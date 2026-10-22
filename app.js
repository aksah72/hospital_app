/*function isWeekday(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay(); // 0 = Sunday, 6 = Saturday
  return day !== 0 && day !== 6;
}*/

require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const User = require('./models/user');
const Appointment = require('./models/appointment');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is NOT defined");
  process.exit(1);
}

const SESSION_SECRET = process.env.SESSION_SECRET || 'changeme';

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 15000
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection failed:", err));



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).lean();
      res.locals.currentUser = user;
    } catch {
      res.locals.currentUser = null;
    }
  } else {
    res.locals.currentUser = null;
  }
  next();
});

function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

app.get('/', requireLogin, (req, res) => {
  res.render('index', { title: 'Book Appointment', error: null });
});

app.get('/appointments', requireLogin, async (req, res) => {
  let query = {};

  if (req.session.role !== 'admin') {
    query.createdBy = req.session.userId;
  }

  const appointments = await Appointment.find(query)
    .sort({ date: 1, time: 1 });

  res.render('appointments', { appointments });
});



app.post('/book', requireLogin, async (req, res) => {
  try {
    const { patientName, patientEmail, doctor, date, time } = req.body;

    if (!patientName || !patientEmail || !doctor || !date || !time) {
      return res.render('index', {
        title: 'Book Appointment',
        error: 'All fields are required.'
      });
    }

    // ❌ block duplicate 15-min slot
    const exists = await Appointment.findOne({ doctor, date, time });
    if (exists) {
      return res.render('index', {
        title: 'Book Appointment',
        error: 'This slot is already booked. Please choose another time.'
      });
    }

    await Appointment.create({
      patientName,
      patientEmail,
      doctor,
      date,
      time,
      createdBy: req.session.userId
    });

    res.redirect('/appointments');

  } catch (err) {
    console.error(err);
    res.render('index', {
      title: 'Book Appointment',
      error: 'Something went wrong'
    });
  }
});



app.get('/register', (req, res) => {
  res.render('register', { title: 'Register', error: null });
});

app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.render('register', { title: 'Register', error: 'All fields are required.' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.render('register', { title: 'Register', error: 'Email already registered.' });
  }

  const hash = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    passwordHash: hash,
    role: role === 'admin' ? 'admin' : 'staff'
  });

  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login', error: null });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.render('login', { title: 'Login', error: 'Invalid email or password.' });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.render('login', { title: 'Login', error: 'Invalid email or password.' });
  }

  req.session.userId = user._id.toString();
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});
app.get("/doctor-slots", async (req, res) => {
  const { doctor, date } = req.query;

  const allSlots = generateSlots();

  const booked = await Appointment.find(
    { doctor, date },
    { time: 1, _id: 0 }
  );

  const bookedTimes = booked.map(a => a.time);

  const freeSlots = allSlots.filter(
    slot => !bookedTimes.includes(slot)
  );

  res.json(freeSlots);
});
const generateSlots = require("./utils/slots");
function isWeekday(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay();
  return day !== 0 && day !== 6; // no Sun, Sat
}


app.get("/free-slots", async (req, res) => {
  const { doctor, date } = req.query;

  if (!doctor || !date) return res.json([]);

  // ❌ Weekend check
  if (!isWeekday(date)) return res.json([]);

  const allSlots = generateSlots();

  const booked = await Appointment.find(
    { doctor, date },
    { time: 1, _id: 0 }
  );

  const bookedTimes = booked.map(b => b.time);

  const freeSlots = allSlots.filter(
    slot => !bookedTimes.includes(slot)
  );

  res.json(freeSlots);
});


console.log("Deploy test");

app.listen(PORT, '0.0.0.0', () => {
  console.log(`App running at http://localhost:${PORT}`);
});
