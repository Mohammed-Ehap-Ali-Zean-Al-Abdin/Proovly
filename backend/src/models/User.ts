import mongoose, { Schema, InferSchemaType } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['donor', 'ngo', 'admin'], default: 'donor' }
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);


