'use strict';

/**
 * order-service router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::order-service.order-service');
