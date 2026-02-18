import './App.css';
import React from 'react';
// Import every component from your list
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AnnouncementTicker from './components/AnnouncementTicker';
import StatsCounter from './components/StatsCounter';
import PlacementProcess from './components/PlacementProcess';
import RecruiterLogos from './components/RecruiterLogos';
import Testimonials from './components/Testimonials';
import TPOMessage from './components/TPOMessage';
import FacultyTeam from './components/FacultyTeam';
import StudentTeam from './components/StudentTeam';
import ContactCTA from './components/ContactCTA';
import Footer from './components/Footer';

function App() {
    return (
        <div className="App">
            <AnnouncementTicker />
            <Navbar />
            <Hero />
            <div style={{ padding: '20px' }}>
                <StatsCounter />
                <TPOMessage />
                <PlacementProcess />
                <RecruiterLogos />
                <FacultyTeam />
                <StudentTeam />
                <Testimonials />
                <ContactCTA />
            </div>
            <Footer />
        </div>
    );
}

export default App;