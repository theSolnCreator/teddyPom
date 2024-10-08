const API_BASE_URL = 'http://localhost:3010/api'; // Adjust this to your actual API URL

export const fetchSettings = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/settings/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }
  return response.json();
};

export const saveSettings = async (userId, settings) => {
  try {
    console.log('Saving settings in api.js:', settings);
    const response = await fetch(`${API_BASE_URL}/settings/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to save settings: ${errorData.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in saveSettings:', error);
    throw error;
  }
};
