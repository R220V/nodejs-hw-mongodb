export const notFoundHandler = (req, res, next)=> {
  res.status(404).json({status:"Error 404",message: "Route not found"});
};