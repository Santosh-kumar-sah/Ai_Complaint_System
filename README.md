# SmartComplain — AI-Based Smart Complaint Management System

SmartComplain is a production-ready MERN stack platform for registering, tracking, and analyzing civic complaints with OpenRouter-powered AI routing and response generation.

## Features
- Complaint registration with a multi-step guided form
- AI-powered analysis using OpenRouter API
- JWT authentication with user and admin roles
- Complaint tracking, filtering, and admin status management
- Responsive dark UI with glassmorphism cards and gradient accents

## Tech Stack
| Area | Stack |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| AI | OpenRouter via Axios |
| Auth | JWT, bcryptjs |
| Deployment | Render dashboard |

## Getting Started
1. Clone the repository.
2. Run `cd server && npm install`.
3. Run `cd client && npm install`.
4. Copy the template in `server/.env` and replace the placeholder values.
5. Copy the template in `client/.env` and set the API base URL.
6. Get a free OpenRouter key from https://openrouter.ai/keys.
7. Run `node server/seed.js` to populate demo data.
8. Start both apps with `npm run dev` in each folder.

## Environment Variables
### Server
| Variable | Description |
|---|---|
| `PORT` | API port |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `OPENROUTER_MODEL` | OpenRouter model ID |
| `OPENROUTER_BASE_URL` | OpenRouter API base URL |
| `NODE_ENV` | Environment mode |
| `CLIENT_URL` | Frontend origin |

### Client
| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API URL |

## API Endpoints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a user |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/health` | No | Health check |
| POST | `/api/complaints` | Yes | Create complaint |
| GET | `/api/complaints` | Yes | List complaints |
| GET | `/api/complaints/:id` | Yes | Complaint details |
| PUT | `/api/complaints/:id` | Yes | Update complaint |
| DELETE | `/api/complaints/:id` | Yes | Delete complaint |
| GET | `/api/complaints/search` | Yes | Search complaints |
| POST | `/api/ai/analyze` | Yes | Analyze complaint with AI |

## Test Credentials
- Admin: `admin@smartcomplain.com` / `Admin@123`
- User: `user@smartcomplain.com` / `User@123`

## OpenRouter Models
- `mistralai/mistral-7b-instruct`
- `google/gemma-3-4b-it:free`
- `meta-llama/llama-3.1-8b-instruct:free`
- `deepseek/deepseek-r1:free`

## Deployment
No `render.yaml` file is required. Deploy manually through the Render dashboard:
1. Push the repository to GitHub.
2. Create a new Render web service for the backend from `server/`.
3. Set the backend environment variables in Render.
4. Create a new Render static site for the frontend from `client/`.
5. Set `VITE_API_BASE_URL` to the deployed backend URL.
6. Set `CLIENT_URL` on the backend to the deployed frontend URL.
7. Redeploy both services after updating env vars.

## License
MIT