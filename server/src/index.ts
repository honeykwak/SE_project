import express, { Express, Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import portfolioRoutes from './routes/portfolioRoutes';
import pageRoutes from './routes/pageRoutes';
import inquiryRoutes from './routes/inquiryRoutes';

// Force load env vars from server root
const envPath = path.resolve(__dirname, '../.env');
console.log(`[server]: Loading .env from ${envPath}`);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.log('[server]: Error loading .env:', result.error.message);
}

// Connect to Database
connectDB();

const app: Express = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging Middleware for debugging CORS
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.path} | Origin: ${req.headers.origin}`);
  next();
});

// CORS Config
app.use(cors({
  origin: true, // Reflects the request origin, efficiently allowing any origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



// Helmet Config (Allow Cross-Origin Resource Sharing)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/page', pageRoutes);
app.use('/api', inquiryRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('SyncUp Server is running!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
