// src/utils/wav-encoder.js

/**
 * Mã hóa một AudioBuffer thành một Blob định dạng WAV.
 * @param {AudioBuffer} audioBuffer - Dữ liệu audio cần mã hóa.
 * @returns {Blob} - Một Blob chứa dữ liệu file WAV.
 */
export function encodeWav(audioBuffer) {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // 1 = PCM (uncompressed)
  const bitDepth = 16; // 16-bit
  const byteRate = sampleRate * numberOfChannels * (bitDepth / 8);
  const blockAlign = numberOfChannels * (bitDepth / 8);

  // Lấy dữ liệu PCM từ kênh đầu tiên
  const pcmData = audioBuffer.getChannelData(0); 
  const dataSize = pcmData.length * (bitDepth / 8);

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // --- WAV Header ---
  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true); // chunkSize
  writeString(view, 8, 'WAVE');
  
  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // subchunk1Size (16 for PCM)
  view.setUint16(20, format, true); // audioFormat
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  
  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // --- Dữ liệu PCM ---
  floatTo16BitPCM(view, 44, pcmData);

  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function floatTo16BitPCM(output, offset, input) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}