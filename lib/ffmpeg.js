import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import * as FileSystem from 'expo-file-system';

function outputPath(name) {
  return `${FileSystem.cacheDirectory}${name}_${Date.now()}.mp4`;
}

async function run(command) {
  const session = await FFmpegKit.execute(command);
  const returnCode = await session.getReturnCode();
  if (ReturnCode.isSuccess(returnCode)) {
    return true;
  }
  const logs = await session.getAllLogsAsString();
  throw new Error(`FFmpeg thất bại: ${logs}`);
}

export async function trimVideo(inputUri, startSeconds, endSeconds) {
  const output = outputPath('trim');
  const duration = endSeconds - startSeconds;
  const command = `-y -i "${inputUri}" -ss ${startSeconds} -t ${duration} -c copy "${output}"`;
  await run(command);
  return output;
}

export async function addWatermark(inputUri, logoUri, subtitleText) {
  const output = outputPath('watermark');
  const safeText = (subtitleText || '').replace(/'/g, "\\'");
  const drawText = safeText
    ? `,drawtext=text='-${safeText}-':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=h-90`
    : '';
  const command =
    `-y -i "${inputUri}" -i "${logoUri}" -filter_complex ` +
    `"[1:v]scale=90:90[logo];[0:v][logo]overlay=(W-w)/2:H-160${drawText}" ` +
    `-c:a copy "${output}"`;
  await run(command);
  return output;
}

export async function exportVideo(inputUri, resolution, ratio) {
  const output = outputPath('export');
  const sizes = {
    '720p_9:16': '720:1280',
    '720p_16:9': '1280:720',
    '1080p_9:16': '1080:1920',
    '1080p_16:9': '1920:1080',
  };
  const size = sizes[`${resolution}_${ratio}`] || sizes['1080p_9:16'];
  const command =
    `-y -i "${inputUri}" -vf "scale=${size}:force_original_aspect_ratio=decrease,` +
    `pad=${size}:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -crf 23 -preset fast -c:a aac "${output}"`;
  await run(command);
  return output;
}

export async function addOverlay(inputUri, overlayUri, position = 'top-right') {
  const output = outputPath('overlay');
  const positions = {
    'top-left': '20:20',
    'top-right': 'W-w-20:20',
    'bottom-left': '20:H-h-20',
    'bottom-right': 'W-w-20:H-h-20',
    center: '(W-w)/2:(H-h)/2',
  };
  const xy = positions[position] || positions['top-right'];
  const command =
    `-y -i "${inputUri}" -i "${overlayUri}" -filter_complex ` +
    `"[1:v]scale=iw*0.4:ih*0.4[ov];[0:v][ov]overlay=${xy}" ` +
    `-c:a copy "${output}"`;
  await run(command);
  return output;
}

export async function removeGreenScreen(inputUri, backgroundUri = null) {
  const output = outputPath('chromakey');
  const chroma =
    'chromakey=0x00FF00:0.15:0.06,despill=type=green';
  const command = backgroundUri
    ? `-y -i "${inputUri}" -i "${backgroundUri}" -filter_complex ` +
      `"[0:v]${chroma}[fg];[1:v][fg]overlay=shortest=1" -c:a copy "${output}"`
    : `-y -i "${inputUri}" -vf "${chroma},format=yuva420p" -c:a copy "${output}"`;
  await run(command);
  return output;
}
