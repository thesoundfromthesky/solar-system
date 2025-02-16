import { injectable } from 'inversify';
import { WorldService } from '../core/world.service';
import type { MeshComponent } from '../components/mesh.component';
import type { AbstractMesh } from '@babylonjs/core';
import { injectService } from '../injector/inject-service.function';
import type { PlanetDataComponent } from '../components/planet-data.component';
import { solarSystem } from '../solar-system';
import { CameraService } from '../utils/camera.service';
import { PlanetService } from '../utils/planet.service';

@injectable()
export class ZoomToPlanetSystem {
  private readonly worldService = injectService(WorldService);
  private readonly cameraService = injectService(CameraService);
  private readonly planetService = injectService(PlanetService);
  private readonly planetQuery = this.worldService
    .getWorld<MeshComponent & PlanetDataComponent>()
    .with('mesh', 'planetData');

  public constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.subscribeZoomOnPlanet(); // must be at the first
    this.zoomOnPlanetByName('sun');
  }

  private findPlanet(name: keyof typeof solarSystem) {
    for (const { mesh } of this.planetQuery) {
      if (mesh.name === name) {
        return mesh;
      }
    }

    throw Error(`${name} is not found.`);
  }

  private zoomOnPlanetByName(name: keyof typeof solarSystem) {
    const planetMesh = this.findPlanet(name);
    this.zoomOnPlanetByMesh(planetMesh);
  }

  private zoomOnPlanetByMesh(mesh: AbstractMesh) {
    this.cameraService.currentTarget = mesh;

    const arcRotateCamera = this.cameraService.getFollowCamera();
    arcRotateCamera.setTarget(mesh);
    arcRotateCamera.zoomOn([mesh], true);
  }

  private subscribeZoomOnPlanet() {
    type OnClickPlanet = Parameters<
      PlanetService['onClickPlanetObserver$']['add']
    >[0];

    const zoomOnPlanet: OnClickPlanet = (mesh) => {
      this.zoomOnPlanetByMesh(mesh);
      const arcRotateCamera = this.cameraService.getFollowCamera();
      this.cameraService.switchActiveCamera(arcRotateCamera);
    };

    this.planetService.onClickPlanetObserver$.add(zoomOnPlanet);
  }
}
