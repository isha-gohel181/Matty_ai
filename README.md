Matty_AI
“One tool, many designs — supercharged with AI.”

Matty_AI is a web application where users can visually design graphics (posters, social media assets, banners, etc.) and leverage AI assist to enhance, suggest, or auto-correct visual elements.

Features

Drag-and-drop canvas editor with support for images, text, shapes

AI enhance filters: upscale, denoise, background removal

Smart design suggestions and template generation

Save & edit design projects

Export to PNG, PDF, SVG

User authentication, role management

Tech Stack
React + Redux | Node.js + Express | MongoDB | TailwindCSS + Shadcn UI | Cloudinary / S3 | AI microservices

API Access

Matty_AI provides API access to allow external applications to integrate AI-powered design features.

### Authentication

To use the API, you need an API key. Users can generate API keys from their account dashboard.

Include the API key in requests using the `X-API-Key` header:

```
X-API-Key: your-api-key-here
```

### Endpoints

#### AI Suggestions
- **POST** `/api/v1/ai/suggestions`
- Generate design suggestions based on a prompt.

Request Body:
```json
{
  "prompt": "Create a modern poster for a tech conference"
}
```

Response:
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

#### Color Palette Generation
- **POST** `/api/v1/ai/palette`
- Generate a color palette from an uploaded image.

Request: Multipart form with `image` file.

Response:
```json
{
  "success": true,
  "palette": {
    "primary": ["#FF6B6B", "#4ECDC4"],
    "complementary": ["#45B7D1", "#96CEB4"],
    "fullPalette": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"]
  },
  "remainingRequests": 2
}
```

#### Design Management
- **POST** `/api/v1/designs` - Create a new design
- **GET** `/api/v1/designs` - Get user's designs
- **GET** `/api/v1/designs/:id` - Get design by ID
- **PUT** `/api/v1/designs/:id` - Update design
- **DELETE** `/api/v1/designs/:id` - Delete design

#### API Key Management
- **POST** `/api/v1/api-keys` - Generate new API key
- **GET** `/api/v1/api-keys` - List user's API keys
- **DELETE** `/api/v1/api-keys/:id` - Delete API key
- **PATCH** `/api/v1/api-keys/:id` - Toggle API key active status

Getting Started

Clone repo

Setup .env for both frontend & backend

cd backend && npm install && npm run dev

cd frontend && npm install && npm run dev

(If AI services) start AI microservices

Roadmap / Future Enhancements

Real-time collaboration

Mobile / native app

Premium template marketplace

Community sharing / design gallery