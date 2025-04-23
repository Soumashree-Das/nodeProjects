import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';
// import ErrorResponse from '../utils/errorResponse.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    // return next(new ErrorResponse('Not authorized to access this route', 401));
    return res
            .json({
                message:"Not authorized to access this route",
                error:err
            })
            .status(401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    // return next(new ErrorResponse('Not authorized to access this route', 401));

    return res
            .json({
                message:"Not authorized to access this route",
                error:err
            })
            .status(401);
  }
};