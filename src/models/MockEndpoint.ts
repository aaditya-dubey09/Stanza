import mongoose, { Schema, Document, Model } from 'mongoose';
import { IMockEndpoint } from '@/src/types';

export interface IMockEndpointModel extends IMockEndpoint, Document {}

const MockEndpointSchema = new Schema<IMockEndpointModel>(
  {
    endpointId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    schemaData: { type: Schema.Types.Mixed, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // MongoDB TTL Index
  },
  {
    timestamps: true,
  }
);

const MockEndpoint: Model<IMockEndpointModel> =
  mongoose.models.MockEndpoint || mongoose.model<IMockEndpoint>('MockEndpoint', MockEndpointSchema);

export default MockEndpoint;