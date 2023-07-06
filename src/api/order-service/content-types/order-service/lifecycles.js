const { v4: uuidv4 } = require("uuid");

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;
    data.UUID = uuidv4();
  },

  async afterUpdate(event) {
    const {
      where: { id },
      data,
    } = event.params;
    console.log(data, "DATA");
    if (data.weight && !data.totalPrice) {
      const idLayanan = await strapi.entityService.findOne(
        "api::order-service.order-service",
        id,
        { populate: "*" }
      );

      // console.log(idLayanan);
      let total = 0;
      if (idLayanan.laundry_service.id === 4 && idLayanan.totalPrice === 0) {
        total = idLayanan.weight * 2000;
        console.log("YES");
        const newOrder = await strapi.entityService.update(
          "api::order-service.order-service",
          id,
          {
            data: {
              totalPrice: total,
            },
          }
        );
      }
    }
    // const laundry = event;
  },
};
