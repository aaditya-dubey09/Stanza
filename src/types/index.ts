export interface IMockEndpoint {
  endpointId: string;
  name: string;
  schemaData: Record<string, unknown> | Array<unknown>;
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