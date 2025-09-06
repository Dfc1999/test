import { registerUser, getUserById } from '../services/userService.js';

export const authRegister = async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body; 

  try {
    const result = await registerUser({ username, email, password, firstName, lastName }); 
    if (result === 201) {
      return res.status(201).json({ message: 'User created successfully' });
    } else {
      return res.status(500).json({ message: 'Unexpected status from Keycloak' });
    }
  } catch (error) {
    console.error('Register error:', error?.response?.data || error.message);
    return res.status(400).json({
      message: 'Registration failed',
      details: error?.response?.data || error.message,
    });
  }
};

export const getMyUserInfoController = async (req, res) => {
  try {
    const userId = req.tokenInfo?.sub;
    if (!userId) {
      return res.status(400).json({ message: 'User ID missing from token' });
    }

    const user = await getUserById(userId);

    res.status(200).json({
      message: 'Authenticated user retrieved successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving user',
      error: error.message,
    });
  }
};
