import { Container, type interfaces } from 'inversify';
import { UpdateInjector } from './update-injector.method-decorator';

export class Injector {
  public container = new Container({ defaultScope: 'Singleton' });

  @UpdateInjector()
  public createInstance<T>(newableClasses: interfaces.Newable<T>): T {
    const instance = this.container.resolve(newableClasses);

    return instance;
  }

  public createInstances(newableClass: interfaces.Newable<object>[]): void {
    newableClass.forEach((newableClass) => {
      this.createInstance(newableClass);
    });
  }

  public getService<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T {
    return this.container.get(serviceIdentifier);
  }
}
