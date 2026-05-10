// Master Prompts API Types

export interface MasterPromptResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    key: string;
    content: string;
    updatedAt: string;
  };
}

export interface UpdateMasterPromptRequest {
  promptText: string;
}

export interface MasterPromptData {
  title: string;
  lastUpdated: string;
  content: string;
}
