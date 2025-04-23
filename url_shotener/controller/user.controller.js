
import User from '../model/user.model.js';
// import ErrorResponse from '../utils/errorResponse.js';

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password
    });

    sendTokenResponse(user, 200, res);
    // return res.json({
    //     user,
    //     statusCode:200,
    //     message:"user registered successfully!"
    // })
  } catch (err) {
    // next(err);
    return res.json({error:err});
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  try {
    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
    //   return next(new ErrorResponse('Invalid credentials', 401));
    return res.json({
        user,
        statusCode:400,
        message:"invalid credentials!"
    })
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
    //   return next(new ErrorResponse('Invalid credentials', 401));
    return res.json({
        user,
        statusCode:401,
        message:"invalid password!"
    })
}

    sendTokenResponse(user, 200, res);
    // return res.json({
    //     user,
    //     statusCode:200,
    //     message:"user registered successfully!"
    // })
  } catch (err) {
    // next(err);
    return res.json({error:err});
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  return res.status(200).json({
    success: true,
    data: user
  });
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  return res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};