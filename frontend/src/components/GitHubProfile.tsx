import React, { useState, useEffect } from 'react';
import './SocialProfile.css';

interface Repository {
  name: string;
  description: string;
  html_url: string;
  language: string;
  stars: number;
  forks: number;
  updated_at: string;
}

interface IGitHubProfile {
  username: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  company: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
  repositories: Repository[];
  contributions: {
    total: number;
    last_year: number;
    longest_streak: number;
  };
}

const GitHubProfile: React.FC = () => {
  const [profile, setProfile] = useState<IGitHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set page title
    document.title = 'ОКАК | GitHub Profile';
    
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/github/profile');
        
        if (!response.ok) {
          throw new Error('Failed to fetch GitHub profile');
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An error occurred while fetching GitHub profile');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="social-profile github-profile">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading GitHub profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="social-profile github-profile">
        <div className="container">
          <div className="error-message">
            <h2>Error Loading Profile</h2>
            <p>{error || 'Unknown error'}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="social-profile github-profile">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={profile.avatar_url} alt={profile.name} />
          </div>
          <div className="profile-info">
            <h1>{profile.name}</h1>
            <h2>@{profile.username}</h2>
            <p className="bio">{profile.bio}</p>
            <div className="profile-meta">
              {profile.location && (
                <span className="meta-item location">
                  <i className="fas fa-map-marker-alt"></i> {profile.location}
                </span>
              )}
              {profile.company && (
                <span className="meta-item company">
                  <i className="fas fa-building"></i> {profile.company}
                </span>
              )}
              {profile.blog && (
                <span className="meta-item website">
                  <i className="fas fa-globe"></i>
                  <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} 
                     target="_blank" 
                     rel="noopener noreferrer">
                    Website
                  </a>
                </span>
              )}
              <span className="meta-item joined">
                <i className="fas fa-calendar-alt"></i> Joined {formatDate(profile.created_at)}
              </span>
            </div>
          </div>
          <div className="profile-actions">
            <a 
              href={profile.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{profile.public_repos}</span>
            <span className="stat-label">Repositories</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{profile.followers}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{profile.following}</span>
            <span className="stat-label">Following</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{profile.contributions.total}</span>
            <span className="stat-label">Contributions</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{profile.contributions.last_year}</span>
            <span className="stat-label">Last Year</span>
          </div>
        </div>

        <div className="profile-section">
          <h2>Top Repositories</h2>
          <div className="repositories-grid">
            {profile.repositories.map((repo) => (
              <div className="repository-card" key={repo.name}>
                <h3 className="repo-name">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    {repo.name}
                  </a>
                </h3>
                <p className="repo-desc">{repo.description}</p>
                <div className="repo-meta">
                  {repo.language && (
                    <span className="meta-item language">
                      <span className={`language-color ${repo.language.toLowerCase()}`}></span>
                      {repo.language}
                    </span>
                  )}
                  <span className="meta-item stars">
                    <i className="fas fa-star"></i> {repo.stars}
                  </span>
                  <span className="meta-item forks">
                    <i className="fas fa-code-branch"></i> {repo.forks}
                  </span>
                  <span className="meta-item updated">
                    Updated on {formatDate(repo.updated_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h2>Contribution Activity</h2>
          <div className="contribution-stats">
            <div className="contrib-item">
              <h4>Total Contributions</h4>
              <div className="contrib-count">{profile.contributions.total}</div>
            </div>
            <div className="contrib-item">
              <h4>Last Year</h4>
              <div className="contrib-count">{profile.contributions.last_year}</div>
            </div>
            <div className="contrib-item">
              <h4>Longest Streak</h4>
              <div className="contrib-count">{profile.contributions.longest_streak} days</div>
            </div>
          </div>
          <div className="github-cta">
            <p>For more detailed statistics and repositories, check out my full GitHub profile.</p>
            <a 
              href={profile.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              View Full Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubProfile; 