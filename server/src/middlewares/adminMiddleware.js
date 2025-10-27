export const isAdmin = async (req, res, next) => {
  if (!req.user?.is_admin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};