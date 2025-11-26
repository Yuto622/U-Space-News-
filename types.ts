export enum NewsCategory {
  GENERAL = 'General',
  ROCKETS = 'Rockets',
  ASTRONOMY = 'Astronomy',
  ISS = 'ISS',
  MARS = 'Mars'
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface NewsResponse {
  content: string;
  sources: GroundingSource[];
  isLoading: boolean;
  error?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: GroundingSource[];
}
