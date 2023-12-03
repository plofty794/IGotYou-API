import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default:
        "https://uploads.turbologo.com/uploads/icon/preview_image/2880304/draw_svg20200612-15006-1ioouzj.svg.png",
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function () {
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
});

const Admin = model("Admin", adminSchema);
export default Admin;
