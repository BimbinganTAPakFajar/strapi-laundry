'use strict';

/**
 * order-service controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order-service.order-service');
