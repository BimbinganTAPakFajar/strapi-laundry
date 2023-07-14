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
      let multiplier;
      if (idLayanan.laundry_service.id === 1 && idLayanan.totalPrice === 0) {
        multiplier = 10000;
      } else if (
        idLayanan.laundry_service.id === 2 &&
        idLayanan.totalPrice === 0
      ) {
        multiplier = 12000;
      } else if (
        idLayanan.laundry_service.id === 3 &&
        idLayanan.totalPrice === 0
      ) {
        multiplier = 15000;
      } else if (
        idLayanan.laundry_service.id === 4 &&
        idLayanan.totalPrice === 0
      ) {
        multiplier = 7000;
      }
      total = idLayanan.weight * multiplier;
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

      // send email to customer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "mylaundry321@gmail.com",
          pass: "nxwpjmpfwkcdvzow",
        },
      });

      // setTimeout(transporter, 2000);

      const mailerOptions = {
        from: "mylaundry321@gmail.com",
        to: idLayanan.email,
        subject: "Konfirmasi Pemesanan",
        html: `
        <h1 style="text-align: center;">Konfirmasi Pembayaran</h1>
        <table style="width: 100%; border-collapse: collapse;">
        <tr>
        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Nama Pemesan</th>
        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Servis</th>
        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Berat Laundry</th>
        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Tanggal Pengambilan</th>
        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Total Harga</th>
        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Id Pembayaran</th>
        </tr>
        <tr>
        <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${idLayanan.name}</td>
        <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${idLayanan.laundry_service.nameService}</td>
        <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${idLayanan.weight}</td>
        <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${idLayanan.pickupDate}</td>
        <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${idLayanan.totalPrice}</td>
        <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${idLayanan.UUID}</td>
        </tr>
        </table>
        <a style="padding-top: 8px; font-weight:bold" href="http://laundry-app-ta.my.id/order/${idLayanan.UUID}" target="_blank">Click link to pay</a>`,
      };
      transporter.sendMail(mailerOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(info.response, "Email Terkirim");
        }
      });
    }
    // const laundry = event;
  },
};
