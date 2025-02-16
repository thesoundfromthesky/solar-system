import { injectable } from 'inversify';
import { ArcRotateCameraComponent } from '../components/arc-rotate-camera.component';
import { injectService } from '../injector/inject-service.function';
import { WorldService } from '../core/world.service';
import { SceneService } from '../core/scene.service';
import { type AbstractMesh, Observable, type Camera } from '@babylonjs/core';

@injectable()
export class CameraService {
  public currentTarget!: AbstractMesh;
  public readonly activeCameraObserver$ = new Observable<Camera>();

  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);
  private readonly followCameraQuery = this.worldService
    .getWorld<ArcRotateCameraComponent>()
    .with('arcRotateCamera');

  public switchActiveCamera(camera: Camera): void {
    this.sceneService.scene.switchActiveCamera(camera);
    this.activeCameraObserver$.notifyObservers(camera);
  }

  public isMainView() {
    return this.getFollowCamera() !== this.sceneService.scene.activeCamera;
  }

  public isCloseView() {
    return this.getFollowCamera() === this.sceneService.scene.activeCamera;
  }

  public isDifferentTarget(mesh: AbstractMesh) {
    return this.currentTarget !== mesh;
  }

  public getFollowCamera() {
    const followCamera = this.followCameraQuery.first;
    if (followCamera) {
      const { arcRotateCamera } = followCamera;
      return arcRotateCamera;
    }

    throw Error('followCamera is not found');
  }
}
