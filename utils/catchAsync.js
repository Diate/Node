// module.exports = (fn) => {
//   return async (req, res, next) => {
//     try {
//       await fn(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   };
// };'

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
