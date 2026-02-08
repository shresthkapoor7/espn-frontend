# GameReel - Super Bowl Clips Platform

Transform epic Super Bowl moments from ESPN NFL into viral-ready reels for your brand.

## Features

- 🎥 **AI-Powered Video Processing**: Automatically extract highlights from ESPN NFL Super Bowl clips
- 🎨 **Modern Landing Page**: Beautiful, responsive design inspired by modern SaaS platforms
- 📊 **Dashboard**: View and manage all your generated reels
- ☁️ **Cloud Storage**: Videos stored securely in Supabase
- 🚀 **Fast**: Built with Next.js 16 and React 19

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Python (FastAPI/Flask) with Whisper AI - hosted on Railway
- **Storage**: Supabase (videos bucket)
- **Deployment**: Vercel (frontend), Railway (backend)

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn
- Supabase account
- Railway account (for backend)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd espn-generate
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
NEXT_PUBLIC_BACKEND_API=https://your-backend.railway.app
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
espn-generate/
├── app/
│   ├── page.tsx           # Landing page
│   ├── dashboard/
│   │   └── page.tsx       # Dashboard with video grid
│   ├── api/
│   │   └── test-backend/  # Backend health check
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   └── supabase.ts        # Supabase client
├── public/                # Static assets
└── .env.local            # Environment variables (gitignored)
```

## Usage

### For Businesses

1. Visit the landing page
2. Enter your company name
3. Click "Get Started"
4. System triggers video processing
5. View your generated reels in the dashboard

### Backend Integration

The frontend triggers video processing via POST request:

```typescript
const response = await fetch('https://your-backend.railway.app/auto-process', {
  method: 'POST',
});
```

Backend should:
1. Download ESPN NFL videos
2. Process with AI (extract highlights)
3. Upload to Supabase `videos/reels/` bucket
4. Videos automatically appear in dashboard

### Supabase Setup

1. Create a bucket named `videos`
2. Inside `videos`, create folder `reels`
3. Set bucket to public or use signed URLs
4. Update policies to allow uploads from backend

## Troubleshooting

Getting a **502 Bad Gateway** error? See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed solutions.

Common issues:
- Backend service is still starting up (wait 2 minutes)
- Backend crashed (check Railway logs)
- Resource limits exceeded (upgrade Railway plan)

Quick test:
```bash
curl -X POST https://your-backend.railway.app/auto-process
```

## Development

### Running Locally

Frontend:
```bash
npm run dev
```

Backend (if running locally):
```bash
# In backend directory
uvicorn main:app --reload
```

Update `.env.local` to point to local backend:
```env
NEXT_PUBLIC_BACKEND_API=http://localhost:8000
```

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Frontend (Vercel)

```bash
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Backend (Railway)

1. Connect your backend repo to Railway
2. Set environment variables
3. Deploy

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_KEY` | Supabase anon key | `eyJhbG...` |
| `NEXT_PUBLIC_BACKEND_API` | Backend API URL | `https://web-production-155f4.up.railway.app` |

## API Endpoints

### POST /auto-process
Triggers video processing pipeline

**Request:**
```bash
curl -X POST https://your-backend.railway.app/auto-process
```

**Response:**
```json
{
  "status": "processing",
  "message": "Started processing videos"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT

## Support

For issues and questions:
- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Open an issue on GitHub
- Check Railway logs for backend errors

## Roadmap

- [ ] Add authentication (Supabase Auth)
- [ ] Add video editing features
- [ ] Add custom branding options
- [ ] Add analytics dashboard
- [ ] Add webhook notifications
- [ ] Add batch processing
- [ ] Add video preview before download
- [ ] Add sharing capabilities
