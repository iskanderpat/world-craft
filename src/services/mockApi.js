// src/services/mockApi.js - COMPLETE FILE
// Mock data for testing
const baseElements = [
    { _id: '1', name: 'Water', description: 'A clear, essential liquid', icon: 'water.png', baseElement: true },
    { _id: '2', name: 'Earth', description: 'Solid ground', icon: 'earth.png', baseElement: true },
    { _id: '3', name: 'Fire', description: 'Hot, burning element', icon: 'fire.png', baseElement: true },
    { _id: '4', name: 'Air', description: 'Invisible, gaseous element', icon: 'air.png', baseElement: true }
  ];
  
  const userElements = [
    ...baseElements,
    { _id: '5', name: 'Steam', description: 'Water vapor created by heat', icon: 'steam.png' },
    { _id: '6', name: 'Mud', description: 'A mixture of earth and water', icon: 'mud.png' }
  ];
  
  // Mock API methods
  const mockApi = {
    setAuthToken: () => {},
    removeAuthToken: () => {},
    
    // Auth endpoints
    register: (userData) => {
      return Promise.resolve({
        data: {
          token: 'mock-token',
          user: {
            id: '123',
            username: userData.username,
            email: userData.email,
            gems: 100
          }
        }
      });
    },
    
    login: (credentials) => {
      if (!credentials.email.includes('@')) {
        return Promise.reject({
          response: {
            data: {
              error: {
                message: 'Invalid email format'
              }
            }
          }
        });
      }
      
      return Promise.resolve({
        data: {
          token: 'mock-token',
          user: {
            id: '123',
            username: 'User',
            email: credentials.email,
            gems: 100
          }
        }
      });
    },
    
    getUserProfile: () => {
      return Promise.resolve({
        data: {
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          gems: 100,
          discoveredElements: userElements
        }
      });
    },
    
    // Game endpoints
    getBaseElements: () => {
      return Promise.resolve({
        data: baseElements
      });
    },
    
    getUserElements: () => {
      return Promise.resolve({
        data: userElements
      });
    },
    
    createSession: () => {
      return Promise.resolve({
        data: {
          _id: 'session-123',
          startTime: new Date(),
          endTime: new Date(Date.now() + 30 * 60 * 1000),
          active: true
        }
      });
    },
    
    combineElements: (elementIds) => {
      // Extended mock combinations
      const combinations = {
        // Base combinations
        "1,3": { _id: '7', name: 'Steam', description: 'Water vapor created by heat', icon: '♨️' },
        "3,1": { _id: '7', name: 'Steam', description: 'Water vapor created by heat', icon: '♨️' },
        "1,2": { _id: '8', name: 'Mud', description: 'A mixture of earth and water', icon: '🟤' },
        "2,1": { _id: '8', name: 'Mud', description: 'A mixture of earth and water', icon: '🟤' },
        "3,2": { _id: '9', name: 'Lava', description: 'Molten rock from the Earth', icon: '🌋' },
        "2,3": { _id: '9', name: 'Lava', description: 'Molten rock from the Earth', icon: '🌋' },
        "4,2": { _id: '10', name: 'Dust', description: 'Tiny particles of earth in the air', icon: '💨' },
        "2,4": { _id: '10', name: 'Dust', description: 'Tiny particles of earth in the air', icon: '💨' },
        "4,3": { _id: '11', name: 'Energy', description: 'Pure power created from heat and motion', icon: '⚡' },
        "3,4": { _id: '11', name: 'Energy', description: 'Pure power created from heat and motion', icon: '⚡' },
        
        // Second level combinations
        "2,8": { _id: '12', name: 'Clay', description: 'Moldable earth', icon: '🏺' },
        "8,2": { _id: '12', name: 'Clay', description: 'Moldable earth', icon: '🏺' },
        "3,7": { _id: '13', name: 'Cloud', description: 'Steam in the sky', icon: '☁️' },
        "7,3": { _id: '13', name: 'Cloud', description: 'Steam in the sky', icon: '☁️' },
        "4,13": { _id: '14', name: 'Wind', description: 'Moving air', icon: '🌬️' },
        "13,4": { _id: '14', name: 'Wind', description: 'Moving air', icon: '🌬️' },
        "9,1": { _id: '15', name: 'Stone', description: 'Cooled lava', icon: '🪨' },
        "1,9": { _id: '15', name: 'Stone', description: 'Cooled lava', icon: '🪨' },
        "2,10": { _id: '16', name: 'Sand', description: 'Tiny particles of earth', icon: '🏜️' },
        "10,2": { _id: '16', name: 'Sand', description: 'Tiny particles of earth', icon: '🏜️' },
        
        // More interesting combinations
        "3,16": { _id: '17', name: 'Glass', description: 'Melted sand', icon: '🥃' },
        "16,3": { _id: '17', name: 'Glass', description: 'Melted sand', icon: '🥃' },
        "1,16": { _id: '18', name: 'Beach', description: 'Sand by the water', icon: '🏖️' },
        "16,1": { _id: '18', name: 'Beach', description: 'Sand by the water', icon: '🏖️' },
        "14,16": { _id: '19', name: 'Sandstorm', description: 'Sand carried by wind', icon: '🌪️' },
        "16,14": { _id: '19', name: 'Sandstorm', description: 'Sand carried by wind', icon: '🌪️' },
        "9,4": { _id: '20', name: 'Smoke', description: 'Hot air and particles', icon: '🌫️' },
        "4,9": { _id: '20', name: 'Smoke', description: 'Hot air and particles', icon: '🌫️' },
        "9,10": { _id: '21', name: 'Ash', description: 'Remains after burning', icon: '🌋' },
        "10,9": { _id: '21', name: 'Ash', description: 'Remains after burning', icon: '🌋' },
        "3,15": { _id: '22', name: 'Metal', description: 'Refined from stone and heat', icon: '⚙️' },
        "15,3": { _id: '22', name: 'Metal', description: 'Refined from stone and heat', icon: '⚙️' },
        "11,22": { _id: '23', name: 'Electricity', description: 'Flowing energy through metal', icon: '⚡' },
        "22,11": { _id: '23', name: 'Electricity', description: 'Flowing energy through metal', icon: '⚡' },
        "22,14": { _id: '24', name: 'Windmill', description: 'Using wind to generate power', icon: '🌬️' },
        "14,22": { _id: '24', name: 'Windmill', description: 'Using wind to generate power', icon: '🌬️' },
        "11,15": { _id: '25', name: 'Engine', description: 'Converts energy to motion', icon: '🔧' },
        "15,11": { _id: '25', name: 'Engine', description: 'Converts energy to motion', icon: '🔧' },
        "25,22": { _id: '26', name: 'Train', description: 'Engine on tracks', icon: '🚂' },
        "22,25": { _id: '26', name: 'Train', description: 'Engine on tracks', icon: '🚂' },
        "25,1": { _id: '27', name: 'Submarine', description: 'Engine that goes underwater', icon: '🚢' },
        "1,25": { _id: '27', name: 'Submarine', description: 'Engine that goes underwater', icon: '🚢' },
        
        // Additional combinations with target words
        "11,24": { _id: '28', name: 'Electricity', description: 'Power generated from the windmill', icon: '⚡' },
        "24,11": { _id: '28', name: 'Electricity', description: 'Power generated from the windmill', icon: '⚡' },
        "14,13": { _id: '29', name: 'Storm', description: 'Strong winds and clouds', icon: '🌩️' },
        "13,14": { _id: '29', name: 'Storm', description: 'Strong winds and clouds', icon: '🌩️' },
        "29,2": { _id: '30', name: 'Earthquake', description: 'Shaking of the earth', icon: '🌋' },
        "2,29": { _id: '30', name: 'Earthquake', description: 'Shaking of the earth', icon: '🌋' },
        "1,4": { _id: '31', name: 'Rain', description: 'Water falling from the sky', icon: '🌧️' },
        "4,1": { _id: '31', name: 'Rain', description: 'Water falling from the sky', icon: '🌧️' },
        "31,2": { _id: '32', name: 'Plant', description: 'Living organism that grows in soil', icon: '🌱' },
        "2,31": { _id: '32', name: 'Plant', description: 'Living organism that grows in soil', icon: '🌱' },
        "32,3": { _id: '33', name: 'Life', description: 'The condition that distinguishes animals and plants', icon: '🧬' },
        "3,32": { _id: '33', name: 'Life', description: 'The condition that distinguishes animals and plants', icon: '🧬' },
        "33,22": { _id: '34', name: 'Robot', description: 'A machine resembling a human being', icon: '🤖' },
        "22,33": { _id: '34', name: 'Robot', description: 'A machine resembling a human being', icon: '🤖' },
        "23,34": { _id: '35', name: 'Computer', description: 'Electronic device for storing and processing data', icon: '💻' },
        "34,23": { _id: '35', name: 'Computer', description: 'Electronic device for storing and processing data', icon: '💻' },
        "35,11": { _id: '36', name: 'AI', description: 'Artificial intelligence', icon: '🧠' },
        "11,35": { _id: '36', name: 'AI', description: 'Artificial intelligence', icon: '🧠' },
        "36,33": { _id: '37', name: 'James Bond', description: 'Secret agent 007', icon: '🕴️' },
        "33,36": { _id: '37', name: 'James Bond', description: 'Secret agent 007', icon: '🕴️' },
        
        // Default for unknown combinations
        "default": { 
          _id: Math.random().toString(), 
          name: 'Mystery Element', 
          description: 'An unexpected discovery!', 
          icon: '❓' 
        }
      };
      
      // Sort IDs to ensure consistent lookup
      const key = elementIds.sort().join(',');
      
      // Get the result or default
      const result = combinations[key] || combinations["default"];
      
      // Return immediately - NO DELAY
      return Promise.resolve({ data: result });
    }
  };
  
  export default mockApi;