import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  sender: string; // ✅ userId as string
  text?: string;
  image?: {
    url: string;
    public_id: string;
  };
  messageType: "text" | "image";
  seen: boolean;
  seenAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema<IMessage>(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: { type: String, required: true },
    text: { type: String },
    image: {
      url: { type: String },
      public_id: { type: String },
    },
    messageType: { type: String, enum: ["text", "image"], required: true },
    seen: { type: Boolean, default: false },
    seenAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },

  { timestamps: true },
);

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
