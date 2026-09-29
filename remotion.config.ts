// Settings for `npm run studio` and the Remotion CLI. scripts/render.mjs sets
// the same options for the batch render.
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
// Social uploads sometimes reject video-only files, so always write an audio track.
Config.setEnforceAudioTrack(true);
// Use an already-installed Chromium instead of Remotion's download (e.g. in sandboxes).
if (process.env.CHROME_PATH) Config.setBrowserExecutable(process.env.CHROME_PATH);
