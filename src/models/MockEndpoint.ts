import mongoose, { Schema, Document, Model } from 'mongoose';
import type { IMockEndpoint } from '../types';

export interface IMockEndpointModel extends IMockEndpoint, Document {};

const MockEndpointSchema = new Schema<IMockEndpointModel>(
  {
    endpointId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, default: 'default_dev' },
    endpointUrl: { type: String, required: true },
    schemaBlueprint: { type: Object, required: true },
    dataPayload: { type: Array, required: true },
    latencyMs: { type: Number, default: 0 },
    statusCode: { type: Number, default: 200 },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL Index
  },
  { timestamps: true }
);

const MockEndpoint: Model<IMockEndpointModel> =
  mongoose.models.MockEndpoint || mongoose.model<IMockEndpointModel>('MockEndpoint', MockEndpointSchema);

export default MockEndpoint;