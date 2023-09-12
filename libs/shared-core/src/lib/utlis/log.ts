/* eslint-disable @typescript-eslint/no-explicit-any */
const ALLOW_CONSOLE_LOGS = /*process.env.NODE_ENV ===*/ 'development';

export function localLog(SEVERITY = 'log', ...params: any) {
  if (ALLOW_CONSOLE_LOGS) {
    switch (SEVERITY) {
      case 'error':
        console.error(...params);
        break;
      case 'warn':
        console.warn(...params);
        break;
      case 'info':
        console.info(...params);
        break;
      default:
        break;
    }
  }
}

const log = {
  info: (...params: any[]) => localLog('info', ...params),
  log: (...params: any[]) => localLog('log', ...params),
  error: (...params: any[]) => localLog('error', ...params),
  warn: (...params: any[]) => localLog('warn', ...params),
};
export default log;
