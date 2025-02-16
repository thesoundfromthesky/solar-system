import { injectable } from 'inversify';
import { SceneService } from '../../core/scene.service';
import { WorldService } from '../../core/world.service';
import { ArcRotateCameraComponent } from '../../components/arc-rotate-camera.component';
import { ArcRotateCamera, Vector3 } from '@babylonjs/core';
import { injectService } from '../../injector/inject-service.function';

@injectable()
export class FollowCameraEntity {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);

  public constructor() {
    this.initialize();
  }

  private initialize() {
    const { arcRotateCamera } = this.createArcRotateCameraComponent();

    this.worldService
      .getWorld<ArcRotateCameraComponent>()
      .add({ arcRotateCamera });
  }

  private createArcRotateCameraComponent() {
    const followCamera = new ArcRotateCamera(
      'follow_camera',
      0,
      Math.PI / 2,
      0,
      new Vector3(9999, 0, 0),
      this.sceneService.scene
    );

    followCamera.maxZ = 9999999;
    //   followCamera.mode = FramingBehavior.FitFrustumSidesMode;

    return new ArcRotateCameraComponent(followCamera);
  }
}
