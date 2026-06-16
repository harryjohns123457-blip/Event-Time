const supabase = require('../config/supabase');
const bcrypt = require('bcrypt');

// Register a new user
const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone_number } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        message: 'Registration failed',
        error: authError.message
      });
    }

    // Insert user profile data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email,
        first_name,
        last_name,
        phone_number
      }]);

    if (userError) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create user profile',
        error: userError.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification.',
      user: {
        id: authData.user.id,
        email: authData.user.email
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Registration error',
      error: err.message
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        error: error.message
      });
    }

    // Fetch user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch user profile',
        error: profileError.message
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      token: data.session.access_token,
      user: userProfile
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Login error',
      error: err.message
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const { data: userProfile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch user',
        error: error.message
      });
    }

    res.json({
      success: true,
      user: userProfile
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: err.message
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    await supabase.auth.signOut();

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Logout error',
      error: err.message
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  logout
};
