'use strict';

/**
 * order-service service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::order-service.order-service');
