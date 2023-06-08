'use strict';

/**
 * laundry-service service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::laundry-service.laundry-service');
