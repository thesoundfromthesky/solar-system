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
import { PickableComponent } from '../components/pickable.component';
import { Injector } from '../injector/injector';
import { NameplateEntity } from './ui/nameplate.entity';

@injectable()
export class MarsEntity {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);
  private readonly injector = injectService(Injector);

  public constructor() {
    this.initialize();
  }

  private initialize() {
    const { planetData } = this.createPlanetDataComponent();
    const { rotation } = this.createRotationComponent();
    const { revolution } = this.createRevolutionComponent();
    const { mesh } = this.createMeshComponent();
    const { pickable } = this.createPickableComponent();

    this.worldService
      .getWorld<
        MeshComponent &
          PlanetDataComponent &
          RotationComponent &
          RevolutionComponent &
          PickableComponent
      >()
      .add({ planetData, rotation, mesh, revolution, pickable });

      const namePlateEntity = this.injector.createInstance(NameplateEntity);
      namePlateEntity.initialize(mesh);
  }

  private createPlanetDataComponent() {
    return new PlanetDataComponent({
      mass: '6.39 x 10^23 kg',
      gravity: '3.73 m/s²',
      radius: '3,390 km',
      lengthOfYear: '687 days',
      lengthOfDay: '1d 0h 37m',
      diameter: 6_792,
      distance: 227_900_000,
      scaledDiameter: 0.5,
      scaledDistance: 1.52,
      rotation: 25,
      revolution: 687,
    });
  }

  private createRotationComponent() {
    const { rotation } = solarSystem.mars;

    const marsRotation = (rotation / rotationScale) * Math.PI;

    return new RotationComponent(marsRotation);
  }

  private createRevolutionComponent() {
    const { revolution } = solarSystem.mars;
    const marsRevolution = getRevolution(revolution);

    return new RevolutionComponent(marsRevolution);
  }

  private createMeshComponent() {
    const { planetMesh } = createPlanet(
      this.sceneService.scene,
      'mars',
      '2k_mars.jpg'
    );

    planetMesh.position.z += 200;

    return new MeshComponent(planetMesh);
  }

  private createPickableComponent() {
    return new PickableComponent(true);
  }
}
