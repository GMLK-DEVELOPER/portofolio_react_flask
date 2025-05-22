import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NotFound from './components/NotFound';
import Header from './components/Header';
import Footer from './components/Footer';
import Portfolio from './components/Portfolio';
import AdminPanel from './components/AdminPanel';
import GitHubProfile from './components/GitHubProfile';
import LinkedInProfile from './components/LinkedInProfile';
import TwitterProfile from './components/TwitterProfile';

function PortfolioLayout() {
  return (
    <>
      <Header />
      <Portfolio />
      <Footer />
    </>
  );
}

function AdminLayout() {
  return (
    <>
      <Header />
      <AdminPanel />
      <Footer />
    </>
  );
}

function GitHubLayout() {
  return (
    <>
      <Header />
      <GitHubProfile />
      <Footer />
    </>
  );
}

function LinkedInLayout() {
  return (
    <>
      <Header />
      <LinkedInProfile />
      <Footer />
    </>
  );
}

function TwitterLayout() {
  return (
    <>
      <Header />
      <TwitterProfile />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioLayout />} />
        <Route path="/admin" element={<AdminLayout />} />
        <Route path="/github" element={<GitHubLayout />} />
        <Route path="/linkedin" element={<LinkedInLayout />} />
        <Route path="/twitter" element={<TwitterLayout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
