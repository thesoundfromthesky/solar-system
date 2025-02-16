import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { WorldService } from '../core/world.service';
import { SceneService } from '../core/scene.service';
import { PlanetDataComponent } from '../components/planet-data.component';
import { rotationScale, solarSystem } from '../solar-system';
import { RotationComponent } from '../components/rotation.component';
import { RevolutionComponent } from '../components/revolution.component';
import { getRevolution } from '../utils/get-revolution.function';
import { createPlanet } from '../utils/create-planet.function';
import { MeshComponent } from '../components/mesh.component';
import type { AbstractMesh } from '@babylonjs/core';
import { PickableComponent } from '../components/pickable.component';
import { Injector } from '../injector/injector';
import { NameplateEntity } from './ui/nameplate.entity';

export type MoonEntityType = MeshComponent &
  PlanetDataComponent &
  RotationComponent &
  RevolutionComponent &
  PickableComponent;

@injectable()
export class MoonEntity {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);
  private readonly injector = injectService(Injector);

  public moonEntity!: MoonEntityType;
  public constructor() {
    this.initialize();
  }

  public setParent(mesh: AbstractMesh) {
    const { scaledDistance } = solarSystem.moon;

    this.moonEntity.mesh.setParent(mesh);
    const distance = scaledDistance + 75;
    this.moonEntity.mesh.position.z = -distance;
  }

  private initialize() {
    const { planetData } = this.createPlanetDataComponent();
    const { rotation } = this.createRotationComponent();
    const { revolution } = this.createRevolutionComponent();
    const { mesh } = this.createMeshComponent();
    const { pickable } = this.createPickableComponent();

    this.moonEntity = this.worldService
      .getWorld<MoonEntityType>()
      .add({ planetData, rotation, mesh, revolution, pickable });

    const namePlateEntity = this.injector.createInstance(NameplateEntity);
    namePlateEntity.initialize(mesh);
  }

  private createPlanetDataComponent() {
    return new PlanetDataComponent({
      mass: '7.34767309 × 1022 kg',
      gravity: '1.62 m/s²',
      radius: '1,740 km',
      lengthOfYear: '27 days',
      lengthOfDay: '29.53 days',
      diameter: 3_474,
      distance: 384_400,
      scaledDiameter: 0.235429656,
      scaledDistance: 0.002569519,
      rotation: 655.2,
      revolution: 27,
    });
  }

  private createRotationComponent() {
    const { rotation } = solarSystem.moon;

    const moonRotation = (rotation / rotationScale) * Math.PI;

    return new RotationComponent(moonRotation);
  }

  private createRevolutionComponent() {
    const { revolution } = solarSystem.moon;
    const moonRevolution = getRevolution(revolution);

    return new RevolutionComponent(moonRevolution);
  }

  private createMeshComponent() {
    const { planetMesh } = createPlanet(
      this.sceneService.scene,
      'moon',
      '2k_moon.jpg'
    );

    return new MeshComponent(planetMesh);
  }

  private createPickableComponent() {
    return new PickableComponent(true);
  }
}
