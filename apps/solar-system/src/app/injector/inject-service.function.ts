import type { Injector } from './injector';
import type { interfaces } from 'inversify';

let currentInjector: Injector | undefined;

/**
 * https://github.com/angular/angular/blob/main/packages/core/src/di/injector_compatibility.ts
 */
export function getInjector(): Injector {
  if (currentInjector) {
    return currentInjector;
  }

  throw Error('injector() must be called in constructor or field initializer');
}

export function setInjector(injector: Injector | undefined): void {
  currentInjector = injector;
}

export function injectService<T>(
  serviceIdentifier: interfaces.ServiceIdentifier<T>
): T {
  return getInjector().getService(serviceIdentifier);
}
