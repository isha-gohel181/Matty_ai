# Postman API Testing Guide for Matty-AI

## Common Issues and Solutions

### Issue: 400 Bad Request

**Possible Causes:**

1. **Missing GEMINI_API_KEY**
   - **Solution**: Add `GEMINI_API_KEY=your-api-key` to your `.env` file
   - Get a free API key from: https://makersuite.google.com/app/apikey

2. **Invalid JSON in Request Body**
   - **Solution**: Ensure your JSON is properly formatted
   - Example:
   ```json
   {
     "prompt": "Create a modern poster for a tech conference"
   }
   ```

3. **Missing Content-Type Header**
   - **Solution**: Add header `Content-Type: application/json`

### Issue: 401 Unauthorized

**Possible Causes:**

1. **Missing X-API-Key Header**
   - **Solution**: Add header `X-API-Key: your-api-key-here`

2. **Invalid or Inactive API Key**
   - **Solution**: Generate a new API key from the web interface
   - Go to: http://localhost:5173 → Profile → API Keys

3. **API Key from Different Database**
   - **Solution**: Ensure your backend is connected to the correct MongoDB database

### Issue: 503 Service Unavailable

**Cause**: GEMINI_API_KEY not configured
**Solution**: Add the API key to your `.env` file

---

## Step-by-Step Setup for Testing

### 1. Configure Environment Variables

Create/Update `.env` file in the `backend` folder:

```env
PORT=3000
DBNAME=matty-ai-db
CONNECTIONSTRING=mongodb://localhost:27017
# Or use MongoDB Atlas connection string

CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your-random-secret-key-here
ACCESS_TOKEN_EXPIRY=7d
REFRESH_TOKEN_SECRET=another-random-secret-key-here
REFRESH_TOKEN_EXPIRY=30d

# REQUIRED FOR AI FEATURES
GEMINI_API_KEY=your-gemini-api-key-here

# Optional for OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback

SESSION_SECRET=your-session-secret
```

### 2. Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

Server should start on: `http://localhost:3000`

### 3. Generate an API Key

1. Open frontend: http://localhost:5173
2. Sign up/Login with email or Google
3. Navigate to **Profile** → **API Keys** tab
4. Click **"Generate API Key"**
5. Name it (e.g., "Postman Testing")
6. **Copy the generated key** (you'll see it only once!)

### 4. Configure Postman Request

#### For AI Suggestions Endpoint:

**Request Setup:**
- Method: `POST`
- URL: `http://localhost:3000/api/v1/ai/suggestions`

**Headers:**
```
Content-Type: application/json
X-API-Key: ee0d5ad3daa0f9fa5ab9e5a0f9583ba2ab66...
```

**Body (raw JSON):**
```json
{
  "prompt": "Create a modern poster for a tech conference"
}
```

**Expected Success Response:**
```json
{
  "success": true,
  "suggestions": {
    "palette": ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    "fonts": {
      "heading": "Montserrat",
      "body": "Lato"
    },
    "layout": "A large, centered image with a bold title at the top and contact information at the bottom."
  },
  "remainingRequests": 4
}
```

---

## Testing Checklist

Before making a request, ensure:

- [ ] Backend server is running (`npm run dev` in backend folder)
- [ ] MongoDB is connected (check console logs)
- [ ] `.env` file has `GEMINI_API_KEY`
- [ ] API key is generated from the web interface
- [ ] API key is copied correctly (no extra spaces)
- [ ] `X-API-Key` header is added in Postman
- [ ] `Content-Type: application/json` header is set
- [ ] Request body is valid JSON
- [ ] Request body contains required fields (e.g., `prompt`)

---

## Available API Endpoints for Testing

### 1. AI Design Suggestions
```
POST http://localhost:3000/api/v1/ai/suggestions
Headers: X-API-Key, Content-Type: application/json
Body: { "prompt": "your design description" }
```

### 2. AI Color Palette from Image
```
POST http://localhost:3000/api/v1/ai/palette
Headers: X-API-Key
Body: form-data with "image" file field
```

### 3. Get User's Designs
```
GET http://localhost:3000/api/v1/designs
Headers: X-API-Key
```

### 4. Create New Design
```
POST http://localhost:3000/api/v1/designs
Headers: X-API-Key
Body: form-data
  - title: "My Design"
  - excalidrawJSON: {"elements": []}
  - thumbnail: [file]
```

### 5. List API Keys
```
GET http://localhost:3000/api/v1/api-keys
Headers: X-API-Key
```

### 6. Generate New API Key (via API)
```
POST http://localhost:3000/api/v1/api-keys
Headers: X-API-Key, Content-Type: application/json
Body: { "name": "New Key Name" }
```

---

## How to Get GEMINI_API_KEY

1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated key
5. Add to `.env` file: `GEMINI_API_KEY=your-copied-key`
6. Restart the backend server

---

## Debugging Tips

### Check Backend Logs
Look at the terminal where you ran `npm run dev` for error messages.

### Test with Console Log
Add this to `ai.controller.js` temporarily:
```javascript
console.log('Request body:', req.body);
console.log('User from API key:', req.user);
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
```

### Verify Database Connection
Check if MongoDB is connected by looking for:
```
Server is running on port 3000
MongoDB Connected!
```

### Test API Key in Database
Use MongoDB Compass or shell to verify the API key exists:
```javascript
db.apikeys.find({ key: "your-api-key" })
```

---

## Common Error Messages and Fixes

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Prompt is required" | Missing or empty prompt in body | Add `"prompt": "your text"` to JSON body |
| "API key is required" | Missing X-API-Key header | Add X-API-Key header in Postman |
| "Invalid or inactive API key" | Wrong key or deactivated | Generate new key from web interface |
| "AI service is not configured" | Missing GEMINI_API_KEY | Add to .env and restart server |
| "User not found" | API key's user deleted | Generate new API key |
| "Free limit exceeded" | Used all free requests | Upgrade to premium or wait for next month |

---

## Need Help?

1. Check the console logs in both frontend and backend terminals
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Try generating a fresh API key
5. Restart both frontend and backend servers
