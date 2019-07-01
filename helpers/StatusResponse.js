/**
 * @description - This class takes care of returning all server response and their statuses
 * @returns {class}
 */
class StatusResponse {
  /**
   * @description - success response
   * @param {object} res - response object
   * @param {object} data - returned data
   * @returns {JSON}
   */
  static success(res, data) {
    return res.status(200).json(data);
  }

  /**
   * @description - Not found response
   * @param {object} res - response object
   * @param {object} data - returned data
   * @returns {JSON}
   */
  static notfound(res, data) {
    return res.status(404).json(data);
  }

  /**
   * @description - Internal server error response
   * @param {object} res - response object
   * @param {object} data - returned data
   * @returns {JSON}
   */
  static internalServerError(res, data) {
    return res.status(500).json(data);
  }

  /**
   * @description - bad request
   * @param {object} res - response object
   * @param {object} data - returned data
   * @returns {JSON}
   */
  static badRequest(res, data) {
    return res.status(400).json(data);
  }

  /**
   * @description - created response
   * @param {object} res - response object
   * @param {object} data  - returned data
   * @returns {JSON}
   */
  static created(res, data) {
    return res.status(201).json(data);
  }

  /**
   * @description - unauthorized credentials
   * @param {object} res - response object
   * @param {object} data - returned data
   * @returns {JSON}
   */
  static unauthorized(res, data) {
    return res.status(401).json(data);
  }

  /**
   * @param {object} res - response object
   * @param {object} data  - returned data
   * @returns {JSON}
   */
  static conflict(res, data) {
    return res.status(409).json(data);
  }

  /**
   * @description - forbidden credentials
   * @param {object} res - response object
   * @param {object} data - returned data
   * @returns {JSON}
   */
  static forbidden(res, data) {
    return res.status(403).json(data);
  }
}

export default StatusResponse;
