import { injectable } from 'inversify';
import { WorldService } from '../core/world.service';
import type { MeshComponent } from '../components/mesh.component';
import { SceneService } from '../core/scene.service';
import type { RotationComponent } from '../components/rotation.component';
import { Axis } from '@babylonjs/core';
import { injectService } from '../injector/inject-service.function';

@injectable()
export class RotationSystem {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);
  private readonly rotationQuery = this.worldService
    .getWorld<MeshComponent & RotationComponent>()
    .with('mesh', 'rotation');
  private readonly engine = this.sceneService.scene.getEngine();

  public constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.sceneService.scene.onBeforeRenderObservable.add(() => {
      for (const { mesh, rotation } of this.rotationQuery) {
        mesh.rotate(Axis.Y, (rotation * this.engine.getDeltaTime()) / 1000);
      }
    });
  }
}
