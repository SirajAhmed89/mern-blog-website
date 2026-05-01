import { AppError } from '../utils/AppError.js';

/**
 * Middleware to check if user owns the resource
 * @param {Model} Model - Mongoose model to check
 * @param {string} resourceName - Name of resource for error message
 */
export const checkOwnership = (Model, resourceName = 'resource') => {
  return async (req, res, next) => {
    try {
      const resource = await Model.findById(req.params.id);

      if (!resource) {
        throw new AppError(`${resourceName} not found`, 404);
      }

      // Check if user is the owner
      if (resource.author.toString() !== req.user.id) {
        throw new AppError(`Not authorized to modify this ${resourceName}`, 403);
      }

      // Attach resource to request for use in controller
      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};
