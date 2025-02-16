import { injectable } from 'inversify';
import { MeshComponent } from '../components/mesh.component';
import { PlanetDataComponent } from '../components/planet-data.component';
import { SceneService } from '../core/scene.service';
import { WorldService } from '../core/world.service';
import { RotationComponent } from '../components/rotation.component';
import { rotationScale, solarSystem } from '../solar-system';
import { createPlanet } from '../utils/create-planet.function';
import { Color3 } from '@babylonjs/core';
import { injectService } from '../injector/inject-service.function';
import { PickableComponent } from '../components/pickable.component';
import { Injector } from '../injector/injector';
import { NameplateEntity } from './ui/nameplate.entity';

@injectable()
export class SunEntity {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);
  private readonly injector = injectService(Injector);

  public constructor() {
    this.initialize();
  }

  private initialize() {
    const { planetData } = this.createPlanetDataComponent();
    const { rotation } = this.createRotationComponent();
    const { mesh } = this.createMeshComponent();
    const { pickable } = this.createPickableComponent();

    this.worldService
      .getWorld<
        MeshComponent &
          PlanetDataComponent &
          RotationComponent &
          PickableComponent
      >()
      .add({ planetData, rotation, mesh, pickable });

    const namePlateEntity = this.injector.createInstance(NameplateEntity);
    namePlateEntity.initialize(mesh);
  }

  private createPlanetDataComponent() {
    return new PlanetDataComponent({
      mass: '1.989 x 10^30 kg',
      gravity: '274 m/s²',
      radius: '695,700 km',
      lengthOfYear: '25 days',
      lengthOfDay: '23 million years',
      diameter: 1_391_400,
      distance: 0,
      scaledDiameter: 109,
      scaledDistance: 0,
      rotation: 648,
      revolution: 83_950_000_000,
    });
  }

  private createRotationComponent() {
    const { rotation } = solarSystem.sun;
    const sunRotation = (rotation / rotationScale) * Math.PI;

    return new RotationComponent(sunRotation);
  }

  private createMeshComponent() {
    const { planetMesh, planetMat } = createPlanet(
      this.sceneService.scene,
      'sun',
      '2k_sun.jpg'
    );

    planetMat.emissiveColor = Color3.White();

    return new MeshComponent(planetMesh);
  }

  private createPickableComponent() {
    return new PickableComponent(true);
  }
}
