import {
  ActionManager,
  ExecuteCodeAction,
  Observable,
  type AbstractMesh,
  PredicateCondition,
} from '@babylonjs/core';
import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { WorldService } from '../core/world.service';
import { SceneService } from '../core/scene.service';
import { CameraService } from './camera.service';
import type { MeshComponent } from '../components/mesh.component';
import type { PlanetDataComponent } from '../components/planet-data.component';

@injectable()
export class PlanetService {
  public readonly onClickPlanetObserver$ = new Observable<AbstractMesh>();

  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);
  private readonly cameraService = injectService(CameraService);
  private readonly planetQuery = this.worldService
    .getWorld<MeshComponent & PlanetDataComponent>()
    .with('mesh', 'planetData');

  public constructor() {
    this.initialize();
  }

  private initialize() {
    this.subscribeOnClickToPlanet();
  }

  private subscribeOnClickToPlanet() {
    type OnClickToPlanet = Parameters<
      PlanetService['planetQuery']['onEntityAdded']['subscribe']
    >[0];
    const registerOnClickToPlanet: OnClickToPlanet = ({ mesh }) => {
      if (mesh.actionManager) {
        return;
      }

      const actionManager = new ActionManager(this.sceneService.scene);
      mesh.actionManager = actionManager;

      const notifyPlanet: ExecuteCodeAction['func'] = () => {
        this.onClickPlanetObserver$.notifyObservers(mesh);
      };

      const isMainViewOrDifferentTarget = () => {
        const isMainView = this.cameraService.isMainView();
        const isDifferentTarget = this.cameraService.isDifferentTarget(mesh);

        return isMainView || isDifferentTarget;
      };

      const ifMainViewOrDifferentTarget = new PredicateCondition(
        actionManager,
        isMainViewOrDifferentTarget
      );

      const executeZoomToPlanet = new ExecuteCodeAction(
        ActionManager.OnPickTrigger,
        notifyPlanet,
        ifMainViewOrDifferentTarget
      );

      actionManager.registerAction(executeZoomToPlanet);
    };

    this.planetQuery.onEntityAdded.subscribe(registerOnClickToPlanet);
  }
}
