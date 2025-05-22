import React, { useState, useEffect } from 'react';
import './SocialProfile.css';

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  likes_count: number;
  retweets_count: number;
}

interface ITwitterProfile {
  name: string;
  username: string;
  profile_image_url: string;
  banner_image_url: string;
  description: string;
  location: string;
  followers_count: number;
  following_count: number;
  tweets_count: number;
  joined_date: string;
  tweets: Tweet[];
  profile_url: string;
}

const TwitterProfile: React.FC = () => {
  const [profile, setProfile] = useState<ITwitterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set page title
    document.title = 'ОКАК | Twitter Profile';
    
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/twitter/profile');
        
        if (!response.ok) {
          throw new Error('Failed to fetch Twitter profile');
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An error occurred while fetching Twitter profile');
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

  // Format tweet date
  const formatTweetDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return formatDate(dateString);
    }
  };

  // Format numbers (e.g., 1.2K, 3.4M)
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    } else {
      return num.toString();
    }
  };

  if (loading) {
    return (
      <div className="social-profile twitter-profile">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading Twitter profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="social-profile twitter-profile">
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
    <div className="social-profile twitter-profile">
      <div className="twitter-banner">
        <img 
          src={profile.banner_image_url} 
          alt={`${profile.name}'s banner`} 
          className="banner-image"
        />
      </div>
      <div className="container">
        <div className="twitter-header">
          <div className="profile-avatar">
            <img 
              src={profile.profile_image_url} 
              alt={profile.name} 
              className="avatar-image"
            />
          </div>
          <div className="profile-info">
            <h1>{profile.name}</h1>
            <h2>@{profile.username}</h2>
            <p className="bio">{profile.description}</p>
            <div className="profile-meta">
              {profile.location && (
                <span className="meta-item location">
                  <i className="fas fa-map-marker-alt"></i> {profile.location}
                </span>
              )}
              <span className="meta-item joined">
                <i className="fas fa-calendar-alt"></i> Joined {formatDate(profile.joined_date)}
              </span>
            </div>
          </div>
          <div className="profile-actions">
            <a 
              href={profile.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary twitter-btn"
            >
              Follow
            </a>
          </div>
        </div>

        <div className="twitter-stats">
          <div className="stat-item">
            <span className="stat-value">{formatNumber(profile.tweets_count)}</span>
            <span className="stat-label">Tweets</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{formatNumber(profile.followers_count)}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{formatNumber(profile.following_count)}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>

        <div className="profile-section">
          <h2>Recent Tweets</h2>
          <div className="tweets-list">
            {profile.tweets.map((tweet) => (
              <div className="tweet-card" key={tweet.id}>
                <div className="tweet-header">
                  <div className="tweet-author">
                    <img 
                      src={profile.profile_image_url} 
                      alt={profile.name} 
                      className="tweet-avatar"
                    />
                    <div className="tweet-author-info">
                      <span className="author-name">{profile.name}</span>
                      <span className="author-username">@{profile.username}</span>
                    </div>
                  </div>
                  <span className="tweet-date">{formatTweetDate(tweet.created_at)}</span>
                </div>
                <div className="tweet-content">
                  <p>{tweet.text}</p>
                </div>
                <div className="tweet-actions">
                  <span className="tweet-action like">
                    <i className="far fa-heart"></i> {formatNumber(tweet.likes_count)}
                  </span>
                  <span className="tweet-action retweet">
                    <i className="fas fa-retweet"></i> {formatNumber(tweet.retweets_count)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-footer">
          <div className="twitter-cta">
            <p>Follow me on Twitter for more updates and insights!</p>
            <a 
              href={profile.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary twitter-btn"
            >
              Visit Twitter Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterProfile; 