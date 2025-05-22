import React, { useState, useEffect } from 'react';
import './SocialProfile.css';

interface Experience {
  title: string;
  company: string;
  location: string;
  from: string;
  to: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  from: string;
  to: string;
}

interface Language {
  name: string;
  level: string;
}

interface ILinkedInProfile {
  name: string;
  headline: string;
  location: string;
  summary: string;
  profile_image_url: string;
  banner_image_url: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: Language[];
  profile_url: string;
}

const LinkedInProfile: React.FC = () => {
  const [profile, setProfile] = useState<ILinkedInProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set page title
    document.title = 'ОКАК | LinkedIn Profile';
    
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/linkedin/profile');
        
        if (!response.ok) {
          throw new Error('Failed to fetch LinkedIn profile');
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An error occurred while fetching LinkedIn profile');
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
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return dateString === 'Present' ? 'Present' : new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="social-profile linkedin-profile">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading LinkedIn profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="social-profile linkedin-profile">
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
    <div className="social-profile linkedin-profile">
      <div className="linkedin-banner">
        <img 
          src="https://media.licdn.com/dms/image/v2/D4E16AQG4gYRAXF-Ejg/profile-displaybackgroundimage-shrink_350_1400/profile-displaybackgroundimage-shrink_350_1400/0/1684476989538?e=1753315200&v=beta&t=nsv0zDfEqd--HWdwRS1r7MiOYiLt0Vo9lNxdjeqORRo" 
          alt={`${profile.name}'s banner`} 
          className="banner-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "https://media.licdn.com/dms/image/v2/D4E16AQG4gYRAXF-Ejg/profile-displaybackgroundimage-shrink_350_1400/profile-displaybackgroundimage-shrink_350_1400/0/1684476989538?e=1753315200&v=beta&t=nsv0zDfEqd--HWdwRS1r7MiOYiLt0Vo9lNxdjeqORRo";
          }}
        />
      </div>
      <div className="container">
        <div className="profile-header linkedin-header">
          <div className="profile-avatar linkedin-avatar">
            <img 
              src="https://media.licdn.com/dms/image/v2/D4D35AQE9LW28jSyJ9Q/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1732052961702?e=1748538000&v=beta&t=CDIySnLw7Eba7phIkjmOJwUsf5xlnV6LaJlFakeOiTY"
              alt={profile.name} 
              className="avatar-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "https://media.licdn.com/dms/image/v2/D4D35AQE9LW28jSyJ9Q/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1732052961702?e=1748538000&v=beta&t=CDIySnLw7Eba7phIkjmOJwUsf5xlnV6LaJlFakeOiTY";
              }}
            />
          </div>
          <div className="profile-info">
            <h1>{profile.name}</h1>
            <h2>{profile.headline}</h2>
            <div className="profile-meta">
              <span className="meta-item location">
                <i className="fas fa-map-marker-alt"></i> {profile.location}
              </span>
            </div>
            <div className="linkedin-summary">
              <p>{profile.summary}</p>
            </div>
          </div>
          <div className="profile-actions">
            <a 
              href={profile.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary linkedin-btn"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>

        <div className="linkedin-grid">
          <div className="profile-section">
            <h2>Experience</h2>
            <div className="experience-list">
              {profile.experience.map((exp, index) => (
                <div className="experience-item" key={index}>
                  <div className="experience-header">
                    <h3>{exp.title}</h3>
                    <span className="date-range">
                      {formatDate(exp.from)} - {formatDate(exp.to)}
                    </span>
                  </div>
                  <div className="company-location">
                    <span className="company">{exp.company}</span>
                    <span className="location">{exp.location}</span>
                  </div>
                  <p className="description">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="profile-section">
            <h2>Skills</h2>
            <div className="skills-container">
              <div className="skills-list">
                {profile.skills.map((skill, index) => (
                  <div className="skill-tag" key={index}>{skill}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Education</h2>
            <div className="education-list">
              {profile.education.map((edu, index) => (
                <div className="education-item" key={index}>
                  <div className="education-header">
                    <h3>{edu.institution}</h3>
                    <span className="date-range">
                      {formatDate(edu.from)} - {formatDate(edu.to)}
                    </span>
                  </div>
                  <div className="degree-field">
                    <span className="degree">{edu.degree}</span>
                    <span className="field">{edu.field}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="profile-section">
            <h2>Languages</h2>
            <div className="languages-list">
              {profile.languages.map((language, index) => (
                <div className="language-item" key={index}>
                  <span className="language-name">{language.name}</span>
                  <span className="language-level">{language.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-footer">
          <div className="linkedin-cta">
            <p>Connect with me on LinkedIn for more professional updates.</p>
            <a 
              href={profile.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary linkedin-btn"
            >
              View Full Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInProfile; 