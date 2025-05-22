# React + Flask Portfolio Application

A full-featured portfolio application built with React (TypeScript) frontend and Flask backend. This application displays developer profiles, GitHub repositories, and provides an admin panel to manage displayed content.

## Project Structure

```
portofolio_react_flask/
├── frontend/                     # React TypeScript frontend
│   ├── src/                      # Source code
│   │   ├── components/           # React components
│   │   │   ├── AdminPanel.tsx    # Admin panel component
│   │   │   ├── AdminPanel.css    # Admin panel styles
│   │   │   ├── Footer.tsx        # Footer component
│   │   │   ├── Footer.css        # Footer styles
│   │   │   ├── GitHubProfile.tsx # GitHub profile component
│   │   │   ├── Header.tsx        # Header component
│   │   │   ├── Header.css        # Header styles
│   │   │   ├── LinkedInProfile.tsx # LinkedIn profile component
│   │   │   ├── NotFound.tsx      # 404 page component
│   │   │   ├── NotFound.css      # 404 page styles
│   │   │   ├── Portfolio.tsx     # Portfolio component
│   │   │   ├── Portfolio.css     # Portfolio styles
│   │   │   ├── SocialProfile.css # Social profile styles
│   │   │   └── TwitterProfile.tsx # Twitter profile component
│   │   ├── assets/               # Static assets
│   │   │   └── cat.png           # Image asset
│   │   ├── App.tsx               # Main application component
│   │   ├── App.css               # Main application styles
│   │   ├── index.tsx             # Application entry point
│   │   ├── index.css             # Global styles
│   │   └── reportWebVitals.ts    # Performance measurement
│   │
│   ├── public/                   # Public assets
│   │   ├── index.html            # HTML entry point
│   │   ├── favicon.ico           # Site favicon
│   │   ├── manifest.json         # PWA manifest
│   │   └── robots.txt            # Robots configuration
│   │
│   ├── package.json              # Frontend dependencies
│   ├── package-lock.json         # Dependency lock file
│   └── tsconfig.json             # TypeScript configuration
│
└── backend/                      # Flask Python backend
    ├── app.py                    # Flask application
    ├── data.json                 # Local JSON database
    └── requirements.txt          # Backend dependencies
```

## Features

- **Portfolio Showcase**: Display your professional skills, experience, and projects
- **GitHub Integration**: Automatically fetch and display public repositories
- **Social Media Profiles**: Display LinkedIn and Twitter profiles
- **Project Filtering**: Admin panel for blacklisting specific repositories
- **Contact Form**: Allow visitors to send contact messages
- **Admin Panel**: Secure admin interface for managing content
- **Responsive Design**: Mobile-friendly layout
- **Custom 404 Page**: Animated error page

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment:
   
   **Windows:**
   ```
   python -m venv venv
   .\venv\Scripts\activate
   ```
   
   **macOS/Linux:**
   ```
   python -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```
   python app.py
   ```

The backend will be running at http://localhost:5000

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The frontend will be running at http://localhost:3000

## API Endpoints

### Task Management
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### GitHub Integration
- `GET /api/github/repos` - Get GitHub repositories
- `GET /api/github/profile` - Get GitHub profile information

### Social Media
- `GET /api/linkedin/profile` - Get LinkedIn profile
- `GET /api/twitter/profile` - Get Twitter profile

### Admin Features
- `POST /api/login` - Admin authentication
- `GET /api/blacklist` - Get blacklisted repositories
- `POST /api/blacklist` - Add repository to blacklist
- `DELETE /api/blacklist/:name` - Remove repository from blacklist
- `GET /api/contact/messages` - Get contact form submissions (admin only)

### Contact Form
- `POST /api/contact` - Submit contact form

## Application Routes

- `/` - Portfolio home page
- `/admin` - Admin panel (requires authentication)
- `/github` - GitHub profile page
- `/linkedin` - LinkedIn profile page
- `/twitter` - Twitter profile page
- Any other path - Custom 404 page with animation

## Technologies Used

### Frontend
- React 19
- TypeScript
- React Router v7
- CSS3

### Backend
- Flask 3.1.1
- Flask-CORS 6.0.0
- Requests 2.31.0

## Security Notes

- The admin authentication in this demo uses basic auth - in production, implement a more secure authentication system
- Update the app's secret key in app.py when deploying to production

## Authors

- **GMLK-DEVELOPER** - Project creator and maintainer
  - GitHub: [GMLK-DEVELOPER](https://github.com/GMLK-DEVELOPER)

## License

This project is available as open source under the terms of the MIT License.

```
MIT License

Copyright (c) 2023 GMLK-DEVELOPER

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## How It Works

### Architecture Overview

This portfolio application uses a client-server architecture:

- **Frontend (React)**: Handles UI rendering, user interactions, and API calls to the backend
- **Backend (Flask)**: Provides REST API endpoints, processes data, and manages authentication

### Data Flow

1. **Frontend Components** → Make API requests to backend endpoints
2. **Backend API** → Processes requests and returns JSON responses
3. **Data Storage** → Backend stores data in a local JSON file (`data.json`)

### Key Features Explained

#### Portfolio Display
- The main Portfolio component fetches GitHub repositories from the backend API
- Repositories are displayed as cards with project details
- Users can visit the repository links directly from the portfolio page

#### GitHub Integration
- The backend makes API calls to GitHub to fetch repository data
- Repository data is cached to improve performance
- The admin can blacklist specific repositories from being displayed

#### Social Media Profiles
- LinkedIn and Twitter profile components fetch profile data from the backend
- The backend acts as a proxy to fetch and format social media data
- Profile data is displayed with consistent styling across platforms

#### Admin Authentication
- Admin login uses basic authentication with credentials stored in the backend
- Once authenticated, the admin can access protected routes and functionality
- Session management is handled through Flask's session mechanisms

#### Blacklist Management
- Admin can add repositories to a blacklist
- Blacklisted repositories won't appear in the portfolio display
- Blacklist data is stored in the `data.json` file

#### Contact Form
- Visitors can send messages through a contact form
- Messages are stored in the `data.json` file
- Admin can view all received messages through the admin panel

### Component Interaction

```
User → Frontend Routes → Layout Components → Feature Components → API Calls → Backend Endpoints
```

- **Routes** (`App.tsx`): Define URL paths and their corresponding layout components
- **Layout Components**: Combine Header, feature component, and Footer
- **Feature Components**: Implement specific functionality (Portfolio, Admin Panel, etc.)
- **API Services**: Handle communication with the backend through HTTP requests

### Security

- The backend implements basic authentication for admin features
- API endpoints for administrative functions are protected with the `@admin_required` decorator
- Frontend hides admin functionality from unauthorized users

### Deployment Architecture

For production deployment:
- Frontend is built into static files that can be served from any web server
- Backend runs as a Flask application, typically behind a WSGI server like Gunicorn
- Both can be hosted on the same server or separately on dedicated hosting platforms 