import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

interface Project {
  id: number;
  name: string;
  description: string;
  html_url: string;
}

interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}

const AdminPanel: React.FC = () => {
  const [blacklist, setBlacklist] = useState<string[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [projectToAdd, setProjectToAdd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsAuthenticated(true);
        // Store credentials for API calls
        sessionStorage.setItem('auth', btoa(`${username}:${password}`));
        fetchData();
      } else {
        setLoginError(data.message || 'Login failed');
      }
    } catch (err) {
      setLoginError('An error occurred during login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('auth');
    setUsername('');
    setPassword('');
    setBlacklist([]);
    setAllProjects([]);
  };

  // Fetch blacklist and GitHub projects
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const auth = sessionStorage.getItem('auth');
      
      // Fetch blacklist
      const blacklistResponse = await fetch('http://localhost:5000/api/blacklist', {
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      });
      
      if (!blacklistResponse.ok) {
        if (blacklistResponse.status === 401) {
          setIsAuthenticated(false);
          sessionStorage.removeItem('auth');
          throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch blacklist');
      }
      
      const blacklistData = await blacklistResponse.json();
      setBlacklist(blacklistData);
      
      // Fetch all GitHub repositories
      const reposResponse = await fetch('http://localhost:5000/api/github/repos?include_forks=true');
      if (!reposResponse.ok) {
        throw new Error('Failed to fetch repositories');
      }
      
      const reposData = await reposResponse.json();
      setAllProjects(reposData);

      // Fetch contact messages
      const messagesResponse = await fetch('http://localhost:5000/api/contact/messages', {
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      });
      
      if (!messagesResponse.ok) {
        if (messagesResponse.status !== 401) { // Already handled above
          throw new Error('Failed to fetch contact messages');
        }
      } else {
        const messagesData = await messagesResponse.json();
        setContactMessages(messagesData);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error fetching data');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Check authentication on component mount
  useEffect(() => {
    const auth = sessionStorage.getItem('auth');
    if (auth) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  // Add a project to the blacklist
  const addToBlacklist = async () => {
    if (!projectToAdd.trim()) return;
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const auth = sessionStorage.getItem('auth');
      
      const response = await fetch('http://localhost:5000/api/blacklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        },
        body: JSON.stringify({ name: projectToAdd.trim() }),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          sessionStorage.removeItem('auth');
          throw new Error('Authentication required');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add project to blacklist');
      }
      
      const data = await response.json();
      setSuccessMessage(data.message);
      setBlacklist([...blacklist, projectToAdd.trim()]);
      setProjectToAdd('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error adding project to blacklist');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Remove a project from the blacklist
  const removeFromBlacklist = async (projectName: string) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const auth = sessionStorage.getItem('auth');
      
      const response = await fetch(`http://localhost:5000/api/blacklist/${projectName}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          sessionStorage.removeItem('auth');
          throw new Error('Authentication required');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove project from blacklist');
      }
      
      const data = await response.json();
      setSuccessMessage(data.message);
      setBlacklist(blacklist.filter(name => name !== projectName));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error removing project from blacklist');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Format date for displaying
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="admin-panel login-container">
        <div className="admin-header">
          <h2>Admin Login</h2>
        </div>
        
        {loginError && (
          <div className="admin-error">
            <p>{loginError}</p>
          </div>
        )}
        
        <div className="login-form">
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin panel content (shown after successful authentication)
  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Panel</h2>
        <p>Manage blacklisted projects</p>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      
      {loading && <div className="admin-loading">Loading...</div>}
      
      {error && (
        <div className="admin-error">
          <p>{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="admin-success">
          <p>{successMessage}</p>
        </div>
      )}
      
      <div className="add-to-blacklist">
        <h3>Add Project to Blacklist</h3>
        <div className="input-group">
          <input
            type="text"
            value={projectToAdd}
            onChange={(e) => setProjectToAdd(e.target.value)}
            placeholder="Enter project name"
          />
          <button onClick={addToBlacklist} disabled={loading || !projectToAdd.trim()}>
            Add
          </button>
        </div>
      </div>
      
      <div className="current-blacklist">
        <h3>Current Blacklist</h3>
        {blacklist.length === 0 ? (
          <p>No projects are currently blacklisted.</p>
        ) : (
          <ul>
            {blacklist.map((projectName) => (
              <li key={projectName}>
                <span>{projectName}</span>
                <button onClick={() => removeFromBlacklist(projectName)} disabled={loading}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="available-projects">
        <h3>Available GitHub Projects</h3>
        {allProjects.length === 0 ? (
          <p>No projects found on GitHub.</p>
        ) : (
          <ul>
            {allProjects.map((project) => (
              <li key={project.id} className={blacklist.includes(project.name) ? 'blacklisted' : ''}>
                <span className="project-name">{project.name}</span>
                <span className="project-desc">{project.description}</span>
                {blacklist.includes(project.name) ? (
                  <button 
                    onClick={() => removeFromBlacklist(project.name)} 
                    disabled={loading}
                    className="unblacklist-btn"
                  >
                    Unblacklist
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setProjectToAdd(project.name);
                      addToBlacklist();
                    }} 
                    disabled={loading}
                    className="blacklist-btn"
                  >
                    Blacklist
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="contact-messages">
        <h3>Contact Messages</h3>
        {contactMessages.length === 0 ? (
          <p>No contact messages received yet.</p>
        ) : (
          <div className="messages-list">
            {contactMessages.map((msg, index) => (
              <div className="message-card" key={index}>
                <div className="message-header">
                  <h4>{msg.subject}</h4>
                  <span className="message-time">{formatDate(msg.timestamp)}</span>
                </div>
                <div className="message-sender">
                  <strong>{msg.name}</strong> ({msg.email})
                </div>
                <div className="message-content">
                  <p>{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 