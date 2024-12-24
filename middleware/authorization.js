export const authorizeAdmin = (reqiredRole) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (role != reqiredRole) {
      res.status(403).json({
        status: "unsuccessfull",
        message: `Forbideen. You need ${admin} or ${producer} previledges`,
      });
    }
    next();
  };
};

export const authorizeProducer = (reqiredRole) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (role != reqiredRole) {
      res.status(403).json({
        status: "unsuccessfull",
        message: `Forbideen. You need ${role}  previledges`,
      });
    }
    next();
  };
};
