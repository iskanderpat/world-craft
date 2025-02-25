// Token storage
export const getToken = () => {
    return localStorage.getItem('world_craft_token');
  };
  
  export const setToken = (token) => {
    localStorage.setItem('world_craft_token', token);
  };
  
  export const removeToken = () => {
    localStorage.removeItem('world_craft_token');
  };