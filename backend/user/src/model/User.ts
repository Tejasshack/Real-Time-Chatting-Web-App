import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: String;
  email: String;
}

const schema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);


export const User = mongoose.model<IUser>("User", schema);
