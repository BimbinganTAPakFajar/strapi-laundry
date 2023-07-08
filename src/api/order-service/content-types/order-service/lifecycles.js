const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

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
      // send email to customer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ezie2001@gmail.com",
          pass: "cqhkapusilgelnke",
        },
      });
      const mailerOptions = {
        from: "ezie2001@gmail.com",
        to: "ajirindra1987@gmail.com", // INI PERLU DIGANTI KE EMAIL DB USER NANTI
        subject: "Order Confirmation",
        html: `<a href="http://laundry-app-ta.my.id/order/${idLayanan.UUID}" target="_blank">Click link to pay</a>`,
      };
      transporter.sendMail(mailerOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(info.response);
        }
      });
    }
    // const laundry = event;
  },
};
