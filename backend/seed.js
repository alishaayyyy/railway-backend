// seed.js
import HijabStyle from "./Models/HijabStyle.js";
import User from "./Models/user.js";
import bcrypt from "bcrypt";

const seedData = async () => {
  try {
    const count = await HijabStyle.countDocuments();
    if (count === 0) {
      await HijabStyle.create([
        {
          name: "Elegant Black Hijab",
          description: "Classic black hijab style for formal and everyday wear.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwtb7Nok02eGIVbt-Nl6gbe3PKG-toVdPuAA&s"
        },
        {
          name: "Floral Printed Hijab",
          description: "Bright floral prints perfect for casual outings.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJF_Zrc8MlKzxr4rcrAuyuwSj58pV-xBk6Kg&s"
        }
      ]);
      console.log("Seeded HijabStyle data");
    }

    // create an admin user for testing (change password after deploy)
    const adminEmail =  "admin@demo.test";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashed = await bcrypt.hash("Admin123!", 10);
      await User.create({ name: "Admin", email: adminEmail, password: hashed, role: "admin" });
      console.log(`Seeded admin user (${adminEmail})`);
    }
  } catch (err) {
    console.error("Seeding error:", err);
  }
};

export default seedData;
