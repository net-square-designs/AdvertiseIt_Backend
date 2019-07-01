import jwt from 'jsonwebtoken';
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
          createdAt: usersProfile.rows[0].createdAt,
          updatedAt: usersProfile.rows[0].updatedAt,
          role: usersProfile.rows[0].user.role,
          email: usersProfile.rows[0].user.email,
          username: usersProfile.rows[0].user.username,
        });

        StatusResponse.success(res, {
          status: 200,
          data: {
            message: 'Users profile returned succesfully',
            user
          }
        });
      } else {
        StatusResponse.success(res, {
          status: 206,
          data: {
            message: 'Users profile returned successfully partially',
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
          error: `Internal server error => ${error}`
        }
      });
    }
  }

  /**
   * @description - This method takes care of creating a user's profile
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} users profile
   */
  static async createProfile(req, res) {
    const token = req.headers.authorization;
    const {
      firstName, lastName, bio, phone, image, location
    } = req.body;

    const { username } = req.params;

    if (username !== jwtDecode(token).username) {
      StatusResponse.unauthorized(res, {
        status: 401,
        data: {
          error: "Unauthorized, you cannot edit another person's profile"
        }
      });
    } else {
      const returnedProfile = await profiles.findOne({
        where: {
          userId: jwtDecode(token).userId
        }
      });

      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (returnedProfile) {
          const createdUsersProfile = await returnedProfile.update({
            firstName: firstName || returnedProfile.dataValues.firstName,
            lastName: lastName || returnedProfile.dataValues.lastName,
            bio: bio || returnedProfile.dataValues.bio,
            image: image || returnedProfile.dataValues.image,
            location: location || returnedProfile.dataValues.location,
            phone: phone || returnedProfile.dataValues.phone
          });
          StatusResponse.success(res, {
            status: 200,
            data: {
              message: 'Users profile created successfully',
              profile: createdUsersProfile
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
            userId: decoded.userId
          });
          StatusResponse.success(res, {
            status: 200,
            data: {
              message: 'Users profile created successfully',
              profile: createdUsersProfile
            }
          });
        }
      } catch (error) {
        StatusResponse.unauthorized(res, {
          status: 401,
          data: {
            error: 'Unauthorized, user not authenticated'
          }
        });
      }
    }
  }
}

export default Profile;
