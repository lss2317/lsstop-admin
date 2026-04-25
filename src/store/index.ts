import type { App } from 'vue';
import { createPinia } from 'pinia';

export const store = createPinia();

/**
 * 初始化 Store
 */
export function initStore(app: App<Element>): void {
  app.use(store);
}
