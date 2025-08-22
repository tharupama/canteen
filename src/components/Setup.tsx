import React, { useState } from 'react';
import { seedDatabase } from '../utils/seedData';
import './Setup.css';

const Setup: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setMessage('Seeding database...');
    
    try {
      await seedDatabase(true); // seedDatabase(true); // Clears all existing items first, then adds fresh data
      setMessage('Database seeded successfully! You can now use the app.');
    } catch (error) {
      setMessage('Error seeding database. Check console for details.');
      console.error(error);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="setup-container">
      <div className="setup-card">
        <h2>Initial Setup</h2>
        <p>Click the button below to add sample food items and create a staff account.</p>
        
        <button 
          onClick={handleSeedDatabase} 
          disabled={isSeeding}
          className="seed-button"
        >
          {isSeeding ? 'Seeding...' : 'Seed Database'}
        </button>
        
        {message && <p className="message">{message}</p>}
        
        <div className="info">
          <h3>After seeding, you can:</h3>
          <ul>
            <li>Visit <strong>/user</strong> to order food</li>
            <li>Visit <strong>/staff</strong> to manage orders</li>
            <li>Staff login: staff@canteen.com / staff123</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Setup;