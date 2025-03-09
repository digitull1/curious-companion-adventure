
declare global {
  interface Window {
    _isBlockProcessing?: boolean;
    _blockProcessingStartTime?: number;
    _lastProcessedBlock?: string;
    _blockOperationCounter?: number;
  }
}

export {};
