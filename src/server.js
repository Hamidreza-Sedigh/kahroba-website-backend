const express =    require('express');
const bodyParser = require("body-parser");
const cors =       require('cors');

const config =     require("./config");
const newsRoutes = require("./routes/newsRoutes");
const userRoutes = require("./routes/userRoutes");
const sourceRoutes = require("./routes/sourceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const publicRoutes = require('./routes/public');
const rateRoutes = require('./routes/rateRoutes.js');
const contactRoutes = require('./routes/contactRoutes');
const sitemapRoutes = require('./routes/sitemapRoutes');


const connectDB =  require('./config/db');
// const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = config.app.port;

// اتصال به دیتابیس
connectDB(config.db.uri);


// Middleware
//app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// فعال‌سازی CORS
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001", 'http://kahrobanet.ir'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

console.log("Registering routes...");


// Routes
app.get('/api/status', (req, res) => {
  res.send({ status: 200 });
});
app.use("/api/news", newsRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/sources", sourceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/rate", rateRoutes);
app.use("/api/contact", contactRoutes);
app.use('/api', publicRoutes);
app.use('/', sitemapRoutes);


console.log("Routes registered:");
console.log("- /api/* -> publicRoutes");
console.log("- /sitemap-news.xml + /sitemap-news-:fileNum.xml -> sitemapRoutes");


// صفحه 404
app.use((req, res) => {
  console.log("404 hit for:", req.originalUrl); // << این خیلی مهمه

    res.status(404).send('<h1>صفحه پیدا نشد</h1><a href="/">بازگشت به خانه</a>');
});

app.listen(PORT, () => {
    console.log(`Server is running ... on ${config.app.host}`);
});
