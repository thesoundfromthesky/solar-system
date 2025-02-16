import { injectable } from 'inversify';
import { WorldService } from '../core/world.service';
import type { MeshComponent } from '../components/mesh.component';
import { SceneService } from '../core/scene.service';
import { Axis, Vector3 } from '@babylonjs/core';
import { injectService } from '../injector/inject-service.function';
import type { RevolutionComponent } from '../components/revolution.component';

@injectable()
export class RevolutionSystem {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);
  private readonly revolutionQuery = this.worldService
    .getWorld<MeshComponent & RevolutionComponent>()
    .with('mesh', 'revolution');

  public constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.sceneService.scene.onBeforeRenderObservable.add(() => {
      for (const { mesh, revolution } of this.revolutionQuery) {
        mesh.rotateAround(Vector3.Zero(), Axis.Y, revolution);
      }
    });
  }
}
