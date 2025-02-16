import './app.scss';
import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';

import { registerBuiltInLoaders } from '@babylonjs/loaders/dynamic';
import { Injector } from './injector/injector';
import { CanvasService } from './core/canvas.service';
import { EngineService } from './core/engine.service';
import { SceneService } from './core/scene.service';
import { WorldService } from './core/world.service';
import { injectable } from 'inversify';
import type { Class } from 'type-fest';
import { SpaceWorld } from './worlds/space.world';
import { injectService } from './injector/inject-service.function';
import { AdvancedDynamicTextureService } from './core/advanced-dynamic-texture.service';
import { CameraService } from './utils/camera.service';
import { PlanetService } from './utils/planet.service';
import { environment } from '../environments/environment';

registerBuiltInLoaders();

const injector = new Injector();

injector.container.bind(Injector).toConstantValue(injector);
injector.container.bind(CanvasService).toSelf();
injector.container.bind(EngineService).toSelf();
injector.container.bind(SceneService).toSelf();
injector.container.bind(WorldService).toSelf();
injector.container.bind(CameraService).toSelf();
injector.container.bind(PlanetService).toSelf();
injector.container.bind(AdvancedDynamicTextureService).toSelf();

@injectable()
class App {
  private readonly injector = injectService(Injector);

  public createWorld<T extends object>(world: Class<T>) {
    this.injector.createInstance(world);
  }

  public createWorlds<T extends object>(worlds: Class<T>[]) {
    worlds.forEach((world) => {
      this.createWorld(world);
    });
  }
}

function start() {
  const app = injector.createInstance(App);
  app.createWorlds([SpaceWorld]);
  const sceneService = injector.container.get(SceneService);
  sceneService.runRenderLoop();

  if (!environment.isProduction) {
    sceneService.scene.debugLayer.show({
      embedMode: true,
    });
  }
}

start();
