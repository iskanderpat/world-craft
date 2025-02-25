// src/services/mockApi.js
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
      // Mock combinations
      const combinations = {
        // Water + Fire
        "1,3": { _id: '7', name: 'Steam', description: 'Water vapor created by heat', icon: '♨️' },
        "3,1": { _id: '7', name: 'Steam', description: 'Water vapor created by heat', icon: '♨️' },
        
        // Water + Earth
        "1,2": { _id: '8', name: 'Mud', description: 'A mixture of earth and water', icon: '🟤' },
        "2,1": { _id: '8', name: 'Mud', description: 'A mixture of earth and water', icon: '🟤' },
        
        // Fire + Earth
        "3,2": { _id: '9', name: 'Lava', description: 'Molten rock from the Earth', icon: '🌋' },
        "2,3": { _id: '9', name: 'Lava', description: 'Molten rock from the Earth', icon: '🌋' },
        
        // Air + Earth
        "4,2": { _id: '10', name: 'Dust', description: 'Tiny particles of earth in the air', icon: '💨' },
        "2,4": { _id: '10', name: 'Dust', description: 'Tiny particles of earth in the air', icon: '💨' },
        
        // Air + Fire
        "4,3": { _id: '11', name: 'Energy', description: 'Pure power created from heat and motion', icon: '⚡' },
        "3,4": { _id: '11', name: 'Energy', description: 'Pure power created from heat and motion', icon: '⚡' },
        
        // Default for unknown combinations
        "default": { _id: Math.random().toString(), name: 'Mystery Element', description: 'An unexpected discovery!', icon: '❓' }
      };
      
      // Sort IDs to ensure consistent lookup
      const key = elementIds.sort().join(',');
      
      // Get the result or default
      const result = combinations[key] || combinations["default"];
      
      // Add some delay to simulate API call
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: result
          });
        }, 1500);
      });
    }
  };
  
  export default mockApi;