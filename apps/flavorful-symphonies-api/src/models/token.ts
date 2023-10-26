import mongoose, { Document, InferSchemaType } from 'mongoose';
import { registerEnumType } from 'type-graphql';

export enum TOKEN_TYPE {
  REFRESH = 'REFRESH',
  INITIALIZE = 'INITIALIZE',
  FORGET = 'FORGET',
  CONFIRM = 'CONFIRM',
}
registerEnumType(TOKEN_TYPE, {
  name: 'TokenType',
});

const TokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: { type: String, enum: Object.values(TOKEN_TYPE), required: true },
  expires: { type: Date },
});

const Token = mongoose.model('Token', TokenSchema);

export type TokenDocument = InferSchemaType<typeof TokenSchema> & Document;

export default Token;
