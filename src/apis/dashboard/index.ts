import request from '@/utils/http';
import type { ConsoleData, AnalysisData } from './types';

/** GET /dashboard/console */
export function fetchConsoleData() {
  return request.get<ConsoleData>({ url: '/dashboard/console' });
}

/** GET /dashboard/analysis */
export function fetchAnalysisData() {
  return request.get<AnalysisData>({ url: '/dashboard/analysis' });
}
