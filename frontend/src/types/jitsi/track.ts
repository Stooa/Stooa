export type MediaType = 'audio' | 'video' | 'presenter' | 'screenshare';

export interface Track {
  isReceivingData: boolean;
  jitsiTrack: any;
  lastMediaEvent?: string;
  local: boolean;
  mediaType: MediaType;
  mirror: boolean;
  muted: boolean;
  noDataFromSourceNotificationInfo?: {
    timeout?: number;
    uid?: string;
  };
  participantId: string;
  streamingStatus?: string;
  videoStarted: boolean;
  videoType?: string | null;
}
