import { injectable } from 'inversify';
import { WorldService } from '../core/world.service';
import type { MeshComponent } from '../components/mesh.component';
import { SceneService } from '../core/scene.service';
import { injectService } from '../injector/inject-service.function';
import type { PickableComponent } from '../components/pickable.component';
import type { ArcRotateCameraComponent } from '../components/arc-rotate-camera.component';
import { CameraService } from '../utils/camera.service';

@injectable()
export class PickableSystem {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);
  private readonly cameraService = injectService(CameraService);

  private readonly pickableQuery = this.worldService
    .getWorld<MeshComponent & PickableComponent>()
    .with('mesh', 'pickable');
  private readonly followCameraQuery = this.worldService
    .getWorld<ArcRotateCameraComponent>()
    .with('arcRotateCamera');

  public constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.sceneService.scene.onBeforeRenderObservable.add(() => {
      for (const { mesh, pickable } of this.pickableQuery) {
        const followCamera = this.followCameraQuery.first;
        if (followCamera && pickable) {
          const { arcRotateCamera } = followCamera;

          const isIntersectingCamera = mesh.intersectsPoint(
            arcRotateCamera.position
          );
          const isMainView = this.cameraService.isMainView();

          mesh.isPickable = isMainView || !isIntersectingCamera;
        }
      }
    });
  }
}
