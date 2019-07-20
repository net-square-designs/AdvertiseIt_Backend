/* eslint-disable no-nested-ternary */
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import model from '../models';
import { StatusResponse, findUser } from '../helpers';

dotenv.config();
const { products, users } = model;

/**
 * @description - This class is all about users products
 * @param {object} req
 * @param {object} res
 * @returns {class} Products
 */
class Products {
  /**
   * @description - This method takes care of creating a user's product
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} users created product
   */
  static async create(req, res) {
    const {
      tags, title, description, price, media, category, subCategory
    } = req.body;

    const { username } = req.params;

    if (username !== req.decoded.username) {
      StatusResponse.unauthorized(res, {
        status: 401,
        data: {
          error: 'Unauthorized, you cannot create a product on behalf of another user'
        }
      });
    } else {
      try {
        const product = await products.create({
          category,
          subCategory,
          title,
          description,
          price,
          tags,
          media,
          userId: req.decoded.userId
        });

        StatusResponse.created(res, {
          status: 201,
          data: {
            message: 'Product created successfully',
            product
          }
        });
      } catch (error) {
        StatusResponse.internalServerError(res, {
          status: 500,
          data: {
            error: 'Internal server error'
          }
        });
      }
    }
  }

  /**
   * @description - This method takes care of updating a user's product
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} users updated product
   */
  static async update(req, res) {
    const {
      tags, title, description, price, media, category, subCategory
    } = req.body;

    const { username, productId } = req.params;

    if (username !== req.decoded.username) {
      StatusResponse.unauthorized(res, {
        status: 401,
        data: {
          error: 'Unauthorized, you cannot update a product on behalf of another user'
        }
      });
    } else {
      const returnedProduct = await products.findOne({
        where: {
          id: productId,
          userId: req.decoded.userId
        }
      });

      try {
        if (returnedProduct) {
          const updatedProduct = await returnedProduct.update({
            category: category || returnedProduct.dataValues.category,
            subCategory: subCategory || returnedProduct.dataValues.subCategory,
            title: title || returnedProduct.dataValues.title,
            description: description || returnedProduct.dataValues.description,
            price: price || returnedProduct.dataValues.price,
            tags: tags || returnedProduct.dataValues.tags,
            media: media || returnedProduct.dataValues.media
          });

          StatusResponse.success(res, {
            status: 200,
            data: {
              message: 'Product updated successfully',
              product: updatedProduct
            }
          });
        } else {
          StatusResponse.notfound(res, {
            status: 404,
            data: {
              message: 'Product not found'
            }
          });
        }
      } catch (error) {
        StatusResponse.internalServerError(res, {
          status: 500,
          data: {
            error: 'Internal server error'
          }
        });
      }
    }
  }

  /**
   * @description - This method takes care of searching for products based on some parameters
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} Products matching some parameters
   */
  static async search(req, res) {
    const { query } = req.query;
    const returnedProducts = await products.findAndCountAll({
      where: {
        [Op.or]: {
          category: { [Op.iLike]: `%${query}%` },
          subCategory: { [Op.iLike]: `%${query}%` },
          media: { [Op.iLike]: `%${query}%` },
          title: { [Op.iLike]: `%${query}%` },
          description: { [Op.iLike]: `%${query}%` },
          price: Number(query) ? query : null,
        }
      },
      include: [
        {
          model: users,
          as: 'user',
          attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt', 'role'] }
        }
      ],
      attributes: { exclude: ['userId'] },
      order: [['id', 'DESC']]
    });

    if (returnedProducts.count > 0) {
      StatusResponse.success(res, {
        status: 200,
        data: {
          message: 'Searched products returned successfully',
          products: returnedProducts
        }
      });
    } else {
      StatusResponse.notfound(res, {
        status: 404,
        data: {
          message: 'No products found matching the searched parameter',
          products: {}
        }
      });
    }
  }

  /**
   * @description - This method takes care of getting all user's products
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} User's products
   */
  static async getAllUsersProducts(req, res) {
    const { username } = req.params;

    const foundUser = await findUser('username', username);
    if (!foundUser) {
      StatusResponse.notfound(res, {
        status: 404,
        data: {
          message: 'User not found'
        }
      });
    } else {
      const returnedProducts = await products.findAndCountAll({
        where: {
          userId: foundUser.id
        },
        include: [
          {
            model: users,
            as: 'user',
            attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt', 'role'] }
          }
        ],
        attributes: { exclude: ['userId'] },
        order: [['id', 'DESC']]
      });

      StatusResponse.success(res, {
        status: 200,
        data: {
          message: "All user's products returned successfully",
          products: returnedProducts
        }
      });
    }
  }

  /**
   * @description - This method takes care of getting a specific product of a user
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} Specific product
   */
  static async getSpecificProductOfAUser(req, res) {
    const { username, productId } = req.params;

    const foundUser = await findUser('username', username);
    if (!foundUser) {
      StatusResponse.notfound(res, {
        status: 404,
        data: {
          message: 'User not found'
        }
      });
    } else {
      const returnedProduct = await products.findAndCountAll({
        where: {
          id: productId,
          userId: foundUser.id
        },
        include: [
          {
            model: users,
            as: 'user',
            attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt', 'role'] }
          }
        ],
        attributes: { exclude: ['userId'] },
      });

      StatusResponse.success(res, {
        status: 200,
        data: {
          message: 'Specific product of a user returned successfully',
          product: returnedProduct
        }
      });
    }
  }

  /**
   * @description - This method takes care of getting all products created by all users
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} all users products
   */
  static async getAllProducts(req, res) {
    try {
      const returnedProducts = await products.findAndCountAll({
        include: [
          {
            model: users,
            key: 'username',
            as: 'user',
            attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt', 'role'] }
          }
        ],
        attributes: { exclude: ['userId'] },
        order: [['id', 'DESC']]
      });

      if (returnedProducts.count > 0) {
        StatusResponse.success(res, {
          status: 200,
          data: {
            message: 'All products returned successfully',
            products: returnedProducts
          }
        });
      } else if (returnedProducts.count < 1) {
        StatusResponse.notfound(res, {
          status: 404,
          data: {
            message: 'No product found'
          }
        });
      }
    } catch (error) {
      StatusResponse.internalServerError(res, {
        status: 500,
        data: {
          error: 'Internal server error'
        }
      });
    }
  }

  /**
   * @description - This method takes care of archiving a user's
   * product maybe when it is out of stock
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {void}
   */
  static async archive(req, res) {
    const { productId } = req.params;

    try {
      const foundProduct = await products.findOne({
        where: {
          id: productId,
          userId: req.decoded.userId
        }
      });
      if (foundProduct) {
        await foundProduct.update({
          isArchived: true
        });
        StatusResponse.success(res, {
          status: 200,
          data: {
            message: 'Product archived successfully'
          }
        });
      } else {
        StatusResponse.notfound(res, {
          status: 404,
          data: {
            message: 'No product found'
          }
        });
      }
    } catch (error) {
      StatusResponse.internalServerError(res, {
        status: 500,
        data: {
          error: 'Internal server error'
        }
      });
    }
  }

  /**
   * @description - This method takes care of unarchiving a user's
   * product maybe when it is now in stock
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {void}
   */
  static async unArchive(req, res) {
    const { productId } = req.params;

    try {
      const foundProduct = await products.findOne({
        where: {
          id: productId,
          userId: req.decoded.userId
        }
      });
      if (foundProduct) {
        await foundProduct.update({
          isArchived: false
        });
        StatusResponse.success(res, {
          status: 200,
          data: {
            message: 'Product unarchived successfully'
          }
        });
      } else {
        StatusResponse.notfound(res, {
          status: 404,
          data: {
            message: 'No product found'
          }
        });
      }
    } catch (error) {
      StatusResponse.internalServerError(res, {
        status: 500,
        data: {
          error: 'Internal server error'
        }
      });
    }
  }

  /**
   * @description - This method takes care of getting all products archived by a user
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} all users archived products
   */
  static async getAUsersArchivedProducts(req, res) {
    const { username } = req.params;
    try {
      if (username !== req.decoded.username) {
        StatusResponse.unauthorized(res, {
          status: 401,
          data: {
            error: "Unauthorized, you cannot access another user's archived products"
          }
        });
      } else {
        const returnedProducts = await products.findAndCountAll({
          where: {
            isArchived: true,
            userId: req.decoded.userId
          },
          include: [
            {
              model: users,
              as: 'user',
              attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt', 'role'] }
            }
          ],
          attributes: { exclude: ['userId'] },
          order: [['id', 'DESC']]
        });

        if (returnedProducts.count > 0) {
          StatusResponse.success(res, {
            status: 200,
            data: {
              message: "All user's archived products returned successfully",
              products: returnedProducts
            }
          });
        } else if (returnedProducts.count < 1) {
          StatusResponse.notfound(res, {
            status: 404,
            data: {
              message: 'No archived product found'
            }
          });
        }
      }
    } catch (error) {
      StatusResponse.internalServerError(res, {
        status: 500,
        data: {
          error: 'Internal server error'
        }
      });
    }
  }

  /**
   * @description - This method takes care of helping a user delete his product
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {void}
   */
  static async delete(req, res) {
    const { productId } = req.params;

    try {
      const foundProduct = await products.findOne({
        where: {
          id: productId,
          userId: req.decoded.userId
        }
      });
      if (foundProduct) {
        await foundProduct.destroy({});
        StatusResponse.success(res, {
          status: 200,
          data: {
            message: 'Product deleted successfully'
          }
        });
      } else {
        StatusResponse.notfound(res, {
          status: 404,
          data: {
            message: 'No product found'
          }
        });
      }
    } catch (error) {
      StatusResponse.internalServerError(res, {
        status: 500,
        data: {
          error: 'Internal server error'
        }
      });
    }
  }
}

export default Products;
