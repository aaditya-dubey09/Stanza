export interface IMockEndpoint {
  endpointId: string;
  userId: string;
  endpointUrl: string;
  schemaBlueprint: Record<string, unknown>;
  dataPayload: Array<unknown>;
  latencyMs: number;
  statusCode: number;
  createdAt: Date;
  expiresAt: Date;
}

export interface GenerateApiRequestPayload {
  prompt: string;
  lifespanHours: number;
}

export interface GenerateApiResponse {
  success: boolean;
  endpointId: string;
  url: string;
  expiresAt: string;
  error?: string;
}