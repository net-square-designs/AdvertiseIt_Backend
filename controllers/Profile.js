/* eslint-disable no-unused-expressions */
import dotenv from 'dotenv';
import jwtDecode from 'jwt-decode';
import model from '../models';
import { StatusResponse } from '../helpers';

dotenv.config();
const { profiles, users } = model;

/**
 * @description - This class is all about users profile
 * @param {object} req
 * @param {object} res
 * @returns {class} Users
 */
class Profile {
  /**
   * @description - This method takes care of a user viewing his or other people's profile
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} users profile
   */
  static async viewProfile(req, res) {
    try {
      const usersProfile = await profiles.findAndCountAll({
        where: {
          userId: req.returnedUser.rows[0].id
        },
        include: [
          {
            model: users,
            as: 'user',
            attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt'] }
          }
        ]
      });
      if (usersProfile.count > 0) {
        const newUsersObj = {};
        const user = Object.assign(newUsersObj, {
          id: usersProfile.rows[0].id,
          firstName: usersProfile.rows[0].firstName,
          lastName: usersProfile.rows[0].lastName,
          phone: usersProfile.rows[0].phone,
          image: usersProfile.rows[0].image,
          bio: usersProfile.rows[0].bio,
          location: usersProfile.rows[0].location,
          storeName: usersProfile.rows[0].storeName,
          bank: JSON.parse(usersProfile.rows[0].bank),
          website: usersProfile.rows[0].website,
          createdAt: usersProfile.rows[0].createdAt,
          updatedAt: usersProfile.rows[0].updatedAt,
          role: usersProfile.rows[0].user.role,
          email: usersProfile.rows[0].user.email,
          username: usersProfile.rows[0].user.username,
          productsofinterest: usersProfile.rows[0].user.productsofinterest
        });

        StatusResponse.success(res, {
          status: 200,
          data: {
            message: "User's profile returned succesfully",
            user
          }
        });
      } else {
        StatusResponse.partial(res, {
          status: 206,
          data: {
            message: "User's profile returned successfully partially",
            user: Object.assign(req.returnedUser.rows[0], {
              password: ''
            }),
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
   * @description - This method takes care of creating or updating a user's profile
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} users profile
   */
  static async createOrUpdateProfile(req, res) {
    const token = req.headers.authorization;
    const {
      firstName, lastName, bio, phone, image, location, storeName, bank, website
    } = req.body;

    const { username } = req.params;

    if (username !== jwtDecode(token).username) {
      StatusResponse.unauthorized(res, {
        status: 401,
        data: {
          error: "Unauthorized, you cannot edit another person's profile"
        }
      });
    } else if (typeof (bank) !== 'object') {
      StatusResponse.badRequest(res, {
        status: 400,
        data: {
          message: 'Bank details must be an object'
        }
      });
    } else {
      const returnedProfile = await profiles.findOne({
        where: {
          userId: jwtDecode(token).userId
        }
      });

      try {
        if (returnedProfile) {
          const updatedUsersProfile = await returnedProfile.update({
            firstName: firstName || returnedProfile.dataValues.firstName,
            lastName: lastName || returnedProfile.dataValues.lastName,
            bio: bio || returnedProfile.dataValues.bio,
            phone: phone || returnedProfile.dataValues.phone,
            image: image || returnedProfile.dataValues.image,
            location: location || returnedProfile.dataValues.location,
            storeName: storeName || returnedProfile.dataValues.storeName,
            bank: JSON.stringify(bank) || returnedProfile.dataValues.bank,
            website: website || returnedProfile.dataValues.website
          });
          StatusResponse.success(res, {
            status: 200,
            data: {
              message: "User's profile updated successfully",
              profile: Object.assign(updatedUsersProfile, {
                bank: JSON.parse(updatedUsersProfile.bank)
              })
            }
          });
        } else {
          const createdUsersProfile = await profiles.create({
            firstName,
            lastName,
            bio,
            image,
            location,
            phone,
            storeName,
            bank: JSON.stringify(bank),
            website,
            userId: req.decoded.userId,
          });
          createdUsersProfile && StatusResponse.created(res, {
            status: 201,
            data: {
              message: "User's profile created successfully",
              profile: Object.assign(createdUsersProfile, {
                bank: JSON.parse(createdUsersProfile.bank)
              })
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
}

export default Profile;
