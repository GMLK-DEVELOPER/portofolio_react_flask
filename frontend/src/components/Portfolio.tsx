import React, { useState, useEffect, useRef } from 'react';
import './Portfolio.css';
import catImage from '../assets/cat.png';
import { useLocation } from 'react-router-dom';

// Custom hook for section title typing effect
const useTypingEffect = (fullText: string, startDelay = 0) => {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setHasStarted(true);
      setIsTyping(true);
    }, startDelay);
    
    return () => clearTimeout(timeout);
  }, [startDelay]);
  
  useEffect(() => {
    if (!hasStarted) return;
    
    if (isTyping && text.length < fullText.length) {
      const timeout = setTimeout(() => {
        setText(fullText.slice(0, text.length + 1));
      }, 100);
      
      return () => clearTimeout(timeout);
    } else if (text === fullText) {
      setIsTyping(false);
    }
  }, [text, isTyping, fullText, hasStarted]);
  
  return { text, isTyping };
};

// Project type definition
interface Project {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string | null;
  language: string | null;
  created_at: string;
  updated_at: string;
  stargazers_count: number;
  fork: boolean;
  topics: string[];
  owner: string;
}

const Portfolio = () => {
  const location = useLocation();
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = "I create beautiful web applications with modern technologies.";
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Contact form states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  
  const projectsRef = useRef(null);
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);
  
  const projectsTitle = useTypingEffect("My Projects", 1000);
  const aboutTitle = useTypingEffect("About Me", 2000);
  const skillsTitle = useTypingEffect("My Skills", 3000);
  const contactTitle = useTypingEffect("Contact Me", 4000);
  
  useEffect(() => {
    if (isTyping) {
      if (displayText.length < fullText.length) {
        const timeout = setTimeout(() => {
          setDisplayText(fullText.slice(0, displayText.length + 1));
        }, 100);
        
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 1000);
        
        return () => clearTimeout(timeout);
      }
    } else {
      const timeout = setTimeout(() => {
        setDisplayText('');
        setIsTyping(true);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [displayText, isTyping]);
  
  useEffect(() => {
    // Handle hash in URL for scrolling to sections
    if (location.hash) {
      const id = location.hash.substring(1); // Remove the # character
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);
  
  // Fetch GitHub repositories
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/github/repos');
        
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        
        const data = await response.json();
        setProjects(data);
        setError(null);
      } catch (err) {
        setError('Error fetching GitHub projects. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Helper function to get tag components based on language
  const getLanguageTags = (project: Project) => {
    const tags = [];
    
    if (project.language) {
      tags.push(<span key={`${project.id}-${project.language}`}>{project.language}</span>);
    }
    
    // Add up to 2 topics if available
    if (project.topics && project.topics.length > 0) {
      project.topics.slice(0, 2).forEach((topic, index) => {
        tags.push(<span key={`${project.id}-topic-${index}`}>{topic}</span>);
      });
    }
    
    // If we don't have at least 3 tags, add some defaults based on common development tools
    if (tags.length < 3) {
      if (!tags.some(tag => tag.key?.toString().includes('React')) && 
          !tags.some(tag => tag.props.children === 'React')) {
        tags.push(<span key={`${project.id}-react`}>React</span>);
      }
      
      if (tags.length < 3 && 
          !tags.some(tag => tag.key?.toString().includes('TypeScript')) && 
          !tags.some(tag => tag.props.children === 'TypeScript')) {
        tags.push(<span key={`${project.id}-typescript`}>TypeScript</span>);
      }
    }
    
    return tags.slice(0, 3); // Limit to 3 tags
  };
  
  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setContactSubmitting(true);
    setContactSuccess(null);
    setContactError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject,
          message: contactMessage
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setContactSuccess('Message sent successfully! I will get back to you soon.');
        // Reset form
        setContactName('');
        setContactEmail('');
        setContactSubject('');
        setContactMessage('');
      } else {
        setContactError(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setContactError('An error occurred. Please try again later.');
      console.error(err);
    } finally {
      setContactSubmitting(false);
    }
  };
  
  return (
    <div className="portfolio">
      {/* Hero Section */}
      <section 
        className="hero" 
        id="home" 
        style={{ 
          backgroundImage: `url(${catImage})`,
        }}
      >
        <div className="container">
          <div className="hero-content">
            <h1>Hi, I'm <span className="highlight">ОКАК</span></h1>
            <h2>Full Stack Developer</h2>
            <p className="typewriter">
              <span className="typed-text">{displayText}</span>
              <span className={`cursor ${!isTyping && displayText.length === fullText.length ? 'blink' : ''}`}></span>
            </p>
            <div className="hero-buttons">
              <a href="#projects" className="btn btn-primary">View My Work</a>
              <a href="#contact" className="btn btn-secondary">Contact Me</a>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects" id="projects" ref={projectsRef}>
        <div className="container">
          <div className="section-header">
            <h2 className="typing-title">
              <span className="typed-text">{projectsTitle.text}</span>
              <span className={`section-cursor ${!projectsTitle.isTyping && projectsTitle.text.length > 0 ? 'hidden' : ''}`}></span>
            </h2>
            <p>Check out some of my recent work</p>
          </div>
          
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading projects from GitHub...</p>
            </div>
          )}
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
          
          <div className="project-grid">
            {!loading && projects.length > 0 && projects.map((project) => (
              <div className="project-card" key={project.id}>
                <div className="project-image">
                  <img 
                    src={`https://raw.githubusercontent.com/${project.owner}/${project.name}/main/preview.png`} 
                    alt={project.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = `https://opengraph.githubassets.com/1/${project.html_url.replace('https://github.com/', '')}`;
                    }}
                  />
                </div>
                <div className="project-info">
                  <h3>{project.name.replace(/-/g, ' ').replace(/_/g, ' ')}</h3>
                  <p>{project.description}</p>
                  <div className="project-tags">
                    {getLanguageTags(project)}
                  </div>
                  <div className="project-links">
                    <a href={project.html_url} target="_blank" rel="noopener noreferrer">View Code</a>
                    {project.homepage && (
                      <a href={project.homepage} target="_blank" rel="noopener noreferrer">Live Demo</a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {!loading && projects.length === 0 && !error && (
              <div className="no-projects">
                <p>No projects found. Please check back later.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about" ref={aboutRef}>
        <div className="container">
          <div className="section-header">
            <h2 className="typing-title">
              <span className="typed-text">{aboutTitle.text}</span>
              <span className={`section-cursor ${!aboutTitle.isTyping && aboutTitle.text.length > 0 ? 'hidden' : ''}`}></span>
            </h2>
            <p>Get to know me better</p>
          </div>
          <div className="about-content">
            <div className="about-image-container">
              <div className="about-image-title">ОКАК CAT</div>
              <div className="cat-card-container">
                <div className="cat-card-bg"></div>
                <div className="cat-card-main">
                  <img src={catImage} alt="OKAK Cat" title="ОКАК Cat" />
                </div>
              </div>
            </div>
            <div className="about-text">
              <h3>Who am I?</h3>
              <p>I'm a passionate Full Stack Developer with a love for creating elegant, efficient, and user-friendly web applications. With expertise in both frontend and backend technologies, I enjoy bringing ideas to life.</p>
              
              <h3>My Journey</h3>
              <p>I started my journey in web development 5 years ago and have since worked on various projects ranging from small business websites to complex web applications. Each project has taught me valuable lessons and helped me grow as a developer.</p>
              
              <h3>My Approach</h3>
              <p>I believe in writing clean, maintainable code and following best practices. I'm constantly learning and adapting to new technologies to stay at the forefront of web development.</p>
              
              <a href="#contact" className="btn btn-primary">Let's Work Together</a>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills" id="skills" ref={skillsRef}>
        <div className="container">
          <div className="section-header">
            <h2 className="typing-title">
              <span className="typed-text">{skillsTitle.text}</span>
              <span className={`section-cursor ${!skillsTitle.isTyping && skillsTitle.text.length > 0 ? 'hidden' : ''}`}></span>
            </h2>
            <p>Technologies I work with</p>
          </div>
          <div className="skills-content">
            <div className="skill-category">
              <h3>Frontend</h3>
              <div className="skill-list">
                <div className="skill-item">React</div>
                <div className="skill-item">TypeScript</div>
                <div className="skill-item">HTML5</div>
                <div className="skill-item">CSS3/SASS</div>
                <div className="skill-item">JavaScript</div>
              </div>
            </div>
            
            <div className="skill-category">
              <h3>Backend</h3>
              <div className="skill-list">
                <div className="skill-item">Python</div>
                <div className="skill-item">Flask</div>
                <div className="skill-item">Node.js</div>
                <div className="skill-item">Express</div>
                <div className="skill-item">RESTful APIs</div>
              </div>
            </div>
            
            <div className="skill-category">
              <h3>Other</h3>
              <div className="skill-list">
                <div className="skill-item">Git</div>
                <div className="skill-item">Responsive Design</div>
                <div className="skill-item">MongoDB</div>
                <div className="skill-item">PostgreSQL</div>
                <div className="skill-item">Docker</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact" ref={contactRef}>
        <div className="container">
          <div className="section-header">
            <h2 className="typing-title">
              <span className="typed-text">{contactTitle.text}</span>
              <span className={`section-cursor ${!contactTitle.isTyping && contactTitle.text.length > 0 ? 'hidden' : ''}`}></span>
            </h2>
            <p>Let's get in touch</p>
          </div>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <h3>Email</h3>
                <p>hello@okak.dev</p>
              </div>
              <div className="contact-item">
                <h3>Location</h3>
                <p>Moldova</p>
              </div>
              <div className="contact-item">
                <h3>Social</h3>
                <div className="social-links">
                  <a href="https://github.com/yuliitezarygml" target="_blank" rel="noopener noreferrer">GitHub</a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <form onSubmit={handleContactSubmit}>
                {contactSuccess && (
                  <div className="form-success">
                    <p>{contactSuccess}</p>
                  </div>
                )}
                {contactError && (
                  <div className="form-error">
                    <p>{contactError}</p>
                  </div>
                )}
                <div className="form-group">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    required 
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    required 
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="text" 
                    placeholder="Subject" 
                    required 
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <textarea 
                    placeholder="Your Message" 
                    rows={5} 
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={contactSubmitting}
                >
                  {contactSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio; 