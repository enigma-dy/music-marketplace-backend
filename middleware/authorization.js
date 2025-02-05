export const authorizeAdmin = (reqiredRole) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (role != reqiredRole) {
      res.status(403).json({
        status: "unsuccessfull",
        message: `Forbideen. You need Admin or Producer previledges`,
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
