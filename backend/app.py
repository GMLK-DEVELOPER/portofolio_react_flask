from flask import Flask, jsonify, request, session
from flask_cors import CORS
import requests
import json
import os
from functools import wraps
import datetime

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Change this to a secure random key in production
CORS(app, supports_credentials=True)  # Enable CORS for all routes with credentials

# File path for the JSON database
DATA_FILE = os.path.join(os.path.dirname(__file__), 'data.json')

# Admin credentials - in a real app, these would be stored securely
ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'password123'  # Change this to a secure password

# Helper function to read data from JSON file
def read_data():
    if not os.path.exists(DATA_FILE):
        # Create the file with default structure if it doesn't exist
        with open(DATA_FILE, 'w') as f:
            json.dump({"blacklist": []}, f)
        return {"blacklist": []}
    
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        # Return default structure if file is corrupted
        return {"blacklist": []}

# Helper function to write data to JSON file
def write_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

# Authentication decorator
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if auth_header and auth_header.startswith('Basic '):
            import base64
            try:
                auth_decoded = base64.b64decode(auth_header[6:]).decode('utf-8')
                username, password = auth_decoded.split(':')
                if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
                    return f(*args, **kwargs)
            except Exception:
                pass
        
        return jsonify({'error': 'Unauthorized access'}), 401
    
    return decorated_function

# Sample data
tasks = [
    {"id": 1, "title": "Learn React", "completed": False},
    {"id": 2, "title": "Learn Flask", "completed": False},
    {"id": 3, "title": "Build a full-stack app", "completed": False}
]

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def add_task():
    new_task = request.json
    new_task['id'] = len(tasks) + 1
    tasks.append(new_task)
    return jsonify(new_task), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = next((t for t in tasks if t['id'] == task_id), None)
    if task:
        data = request.json
        task.update(data)
        return jsonify(task)
    return jsonify({"error": "Task not found"}), 404

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    task = next((t for t in tasks if t['id'] == task_id), None)
    if task:
        tasks = [t for t in tasks if t['id'] != task_id]
        return jsonify({"message": "Task deleted"})
    return jsonify({"error": "Task not found"}), 404

@app.route('/api/github/repos', methods=['GET'])
def get_github_repos():
    try:
        # Get blacklisted repositories
        data = read_data()
        blacklist = data.get('blacklist', [])
        
        # GitHub usernames
        usernames = ['yuliitezarygml', 'GMLK-DEVELOPER']
        
        all_processed_repos = []
        
        for username in usernames:
            # GitHub API URL
            url = f'https://api.github.com/users/{username}/repos'
            
            # Make request to GitHub API
            response = requests.get(url, params={'sort': 'updated', 'per_page': 15})
            
            if response.status_code != 200:
                print(f"Failed to fetch repositories for {username}: {response.status_code}")
                continue
            
            repos = response.json()
            
            # Process and format the repositories
            for repo in repos:
                # Skip blacklisted repos
                if repo['name'] in blacklist:
                    continue
                    
                # Skip forks if you want only original projects
                if repo.get('fork', False) and request.args.get('include_forks') != 'true':
                    continue
                    
                processed_repo = {
                    'id': repo['id'],
                    'name': repo['name'],
                    'description': repo['description'] or f"A project named {repo['name']}",
                    'html_url': repo['html_url'],
                    'homepage': repo['homepage'],
                    'language': repo['language'],
                    'created_at': repo['created_at'],
                    'updated_at': repo['updated_at'],
                    'stargazers_count': repo['stargazers_count'],
                    'fork': repo['fork'],
                    'topics': repo.get('topics', []),
                    'owner': username
                }
                all_processed_repos.append(processed_repo)
        
        # Sort all repos by update date
        all_processed_repos.sort(key=lambda x: x['updated_at'], reverse=True)
            
        # Limit to 12 projects for display (6 from each user if available)
        return jsonify(all_processed_repos[:12])
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        return jsonify({"success": True, "message": "Login successful"})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route('/api/blacklist', methods=['GET'])
@admin_required
def get_blacklist():
    data = read_data()
    return jsonify(data.get('blacklist', []))

@app.route('/api/blacklist', methods=['POST'])
@admin_required
def add_to_blacklist():
    # Get the project name from the request
    project_name = request.json.get('name')
    if not project_name:
        return jsonify({"error": "Project name is required"}), 400
    
    # Read current data
    data = read_data()
    blacklist = data.get('blacklist', [])
    
    # Check if project is already blacklisted
    if project_name in blacklist:
        return jsonify({"message": f"Project '{project_name}' is already blacklisted"}), 200
    
    # Add project to blacklist
    blacklist.append(project_name)
    data['blacklist'] = blacklist
    
    # Save the data
    write_data(data)
    
    return jsonify({"message": f"Project '{project_name}' added to blacklist"}), 201

@app.route('/api/blacklist/<project_name>', methods=['DELETE'])
@admin_required
def remove_from_blacklist(project_name):
    # Read current data
    data = read_data()
    blacklist = data.get('blacklist', [])
    
    # Check if project is in blacklist
    if project_name not in blacklist:
        return jsonify({"error": f"Project '{project_name}' is not in the blacklist"}), 404
    
    # Remove project from blacklist
    blacklist.remove(project_name)
    data['blacklist'] = blacklist
    
    # Save the data
    write_data(data)
    
    return jsonify({"message": f"Project '{project_name}' removed from blacklist"}), 200

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    try:
        contact_data = request.json
        if not contact_data:
            return jsonify({"error": "No data provided"}), 400
            
        required_fields = ['name', 'email', 'subject', 'message']
        for field in required_fields:
            if not contact_data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400
                
        # Read current data
        data = read_data()
        
        # Initialize contact_messages if it doesn't exist
        if 'contact_messages' not in data:
            data['contact_messages'] = []
            
        # Add timestamp to the message
        contact_data['timestamp'] = datetime.datetime.now().isoformat()
        
        # Add the message to the database
        data['contact_messages'].append(contact_data)
        
        # Save the data
        write_data(data)
        
        return jsonify({"success": True, "message": "Contact message submitted successfully"}), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/contact/messages', methods=['GET'])
@admin_required
def get_contact_messages():
    try:
        data = read_data()
        messages = data.get('contact_messages', [])
        
        # Sort messages by timestamp (newest first)
        if messages:
            messages = sorted(
                messages, 
                key=lambda x: x.get('timestamp', ''), 
                reverse=True
            )
            
        return jsonify(messages)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/github/profile', methods=['GET'])
def get_github_profile():
    try:
        # GitHub username
        username = 'yuliitezarygml'
        
        # GitHub API URL for user profile
        url = f'https://api.github.com/users/{username}'
        
        # Make request to GitHub API
        response = requests.get(url)
        
        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch GitHub profile"}), response.status_code
        
        profile_data = response.json()
        
        # Process and format the profile data
        processed_profile = {
            'username': profile_data['login'],
            'name': profile_data['name'] or username,
            'avatar_url': profile_data['avatar_url'],
            'bio': profile_data['bio'] or 'Full Stack Developer',
            'location': profile_data['location'] or 'Moldova',
            'company': profile_data['company'],
            'blog': profile_data['blog'],
            'public_repos': profile_data['public_repos'],
            'followers': profile_data['followers'],
            'following': profile_data['following'],
            'created_at': profile_data['created_at'],
            'html_url': profile_data['html_url']
        }
        
        # Get repositories data
        repos_response = requests.get(f'https://api.github.com/users/{username}/repos', 
                                      params={'sort': 'updated', 'per_page': 10})
        
        if repos_response.status_code == 200:
            repos_data = repos_response.json()
            
            # Get blacklisted repositories
            data = read_data()
            blacklist = data.get('blacklist', [])
            
            # Filter out blacklisted repos
            processed_repos = []
            for repo in repos_data:
                if repo['name'] not in blacklist:
                    processed_repo = {
                        'name': repo['name'],
                        'description': repo['description'] or f"A project named {repo['name']}",
                        'html_url': repo['html_url'],
                        'language': repo['language'],
                        'stars': repo['stargazers_count'],
                        'forks': repo['forks_count'],
                        'updated_at': repo['updated_at']
                    }
                    processed_repos.append(processed_repo)
            
            processed_profile['repositories'] = processed_repos
        
        # Get contribution statistics
        contributions = {
            'total': 752,  # Placeholder value
            'last_year': 423,  # Placeholder value
            'longest_streak': 15  # Placeholder value
        }
        processed_profile['contributions'] = contributions
        
        return jsonify(processed_profile)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/linkedin/profile', methods=['GET'])
def get_linkedin_profile():
    try:
        # Read LinkedIn data from JSON file
        # Note: Direct LinkedIn API access requires OAuth authorization and is complex to implement
        # For a portfolio site, using static data in a JSON file is more practical
        # To update your profile information, modify the data.json file
        data = read_data()
        
        # Check if LinkedIn data exists
        if 'linkedin' not in data:
            return jsonify({"error": "LinkedIn profile data not found"}), 404
            
        return jsonify(data['linkedin'])
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/twitter/profile', methods=['GET'])
def get_twitter_profile():
    try:
        # Read Twitter data from JSON file since direct API access requires authorization
        data = read_data()
        
        # Check if Twitter data exists or create default placeholder data
        if 'twitter' not in data:
            # Create placeholder data
            data['twitter'] = {
                'name': 'ОКАК',
                'username': 'okak_dev',
                'profile_image_url': 'https://via.placeholder.com/150',
                'banner_image_url': 'https://via.placeholder.com/1500x500',
                'description': 'Full Stack Developer | Creating web applications with modern technologies | Follow for tech tips and updates',
                'location': 'Moldova',
                'followers_count': 1024,
                'following_count': 512,
                'tweets_count': 2048,
                'joined_date': '2018-06-01',
                'tweets': [
                    {
                        'id': '1',
                        'text': 'Just launched my new portfolio website built with React and Flask! Check it out at https://okak.dev #webdevelopment #react #flask',
                        'created_at': '2023-09-15T12:00:00Z',
                        'likes_count': 42,
                        'retweets_count': 12
                    },
                    {
                        'id': '2',
                        'text': 'Working on a new open source project. Stay tuned for updates! #opensource #programming',
                        'created_at': '2023-09-10T15:30:00Z',
                        'likes_count': 31,
                        'retweets_count': 8
                    },
                    {
                        'id': '3',
                        'text': 'TypeScript + React is my favorite tech stack for frontend development. What\'s yours? #typescript #react #frontend',
                        'created_at': '2023-09-05T09:45:00Z',
                        'likes_count': 56,
                        'retweets_count': 15
                    }
                ],
                'profile_url': 'https://www.linkedin.com/in/terentii-iulian-ba5728275/'
            }
            
            # Save to data file
            write_data(data)
        
        return jsonify(data['twitter'])
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not found", "status": 404}), 404

if __name__ == '__main__':
    app.run(debug=True) 