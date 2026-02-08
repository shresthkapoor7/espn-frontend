# Troubleshooting Guide

## 502 Bad Gateway Error

### What does it mean?
A **502 Bad Gateway** error means the Railway server cannot reach your backend application. This is **not** a frontend issue.

### Common Causes & Solutions

#### 1. Backend Service is Down
**Check:**
- Go to your Railway dashboard: https://railway.app/
- Check if the service is running
- Look at the deployment logs for errors

**Fix:**
- Restart the service in Railway
- Check if the build succeeded
- Verify environment variables are set correctly

#### 2. Backend is Still Starting Up
Backend services with AI models (like Whisper) can take 1-2 minutes to start.

**Fix:**
- Wait 2 minutes and try again
- Check Railway logs for "Application startup complete"

#### 3. Backend Timeout
The request is taking too long (>30 seconds typically).

**Fix:**
- Increase timeout limits in Railway settings
- Optimize your video processing code
- Consider making the endpoint async (return immediately, process in background)

#### 4. Resource Limits Exceeded
Railway may kill your app if it uses too much memory/CPU.

**Fix:**
- Upgrade your Railway plan
- Optimize memory usage in your Python app
- Reduce Whisper model size (use 'tiny' or 'base' instead of 'large')

#### 5. CORS Issues
While not a 502, CORS can cause similar connection problems.

**Fix:**
Add CORS headers to your FastAPI/Flask backend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Testing the Backend

#### Test 1: Direct API Call
Open terminal and run:

```bash
curl -X POST https://web-production-155f4.up.railway.app/auto-process
```

Expected: Response (any response, even error is good)
If timeout or connection refused: Backend is down

#### Test 2: Check Backend Health (if you have a health endpoint)
```bash
curl https://web-production-155f4.up.railway.app/health
```

#### Test 3: Use the built-in test endpoint
Visit: http://localhost:3000/api/test-backend

### Running Backend Locally

If Railway is down, you can point the frontend to your local backend:

1. Update `.env.local`:
```env
NEXT_PUBLIC_BACKEND_API=http://localhost:8000
```

2. Update the fetch call in `app/page.tsx`:
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auto-process`, {
  method: 'POST',
});
```

3. Make sure your local backend is running:
```bash
# In your backend directory
python main.py
# or
uvicorn main:app --reload
```

### Quick Fixes Checklist

- [ ] Check Railway dashboard - is service running?
- [ ] Check Railway logs - any error messages?
- [ ] Wait 2 minutes - did it just deploy?
- [ ] Test with curl - does it respond?
- [ ] Check environment variables - are they set?
- [ ] Check resource usage - memory/CPU limits hit?
- [ ] Try restarting the Railway service
- [ ] Check if domain is correct in code

### Getting Help

If none of the above works:
1. Check Railway logs (most important!)
2. Share the full error from Railway logs
3. Check Railway status page: https://status.railway.app/
4. Contact Railway support if platform issue

### Production Recommendations

For a production app, consider:

1. **Add a queue system** (Redis + Celery/RQ)
   - Frontend submits job to queue
   - Returns immediately with job ID
   - Backend processes in background
   - Frontend polls for completion

2. **Add health checks**
   - Create `/health` endpoint in backend
   - Frontend can check before submitting

3. **Add retry logic**
   - Automatically retry failed requests
   - Exponential backoff

4. **Add status page**
   - Show if backend is healthy
   - Display processing status
   - Show queue length

5. **Use webhooks**
   - Backend calls frontend when done
   - No need for polling
