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
import { NameplateEntity } from './ui/nameplate.entity';
import { Injector } from '../injector/injector';

@injectable()
export class NeptuneEntity {
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
      mass: '1.024 x 10^26 kg',
      gravity: '11.15 m/s²',
      radius: '24,622 km',
      lengthOfYear: '165 years',
      lengthOfDay: '0d 16h 6m',
      diameter: 49_528,
      distance: 4_495_100_000,
      scaledDiameter: 3.9,
      scaledDistance: 30.06,
      rotation: 16,
      revolution: 60_190,
    });
  }

  private createRotationComponent() {
    const { rotation } = solarSystem.neptune;
    const neptuneRotation = (rotation / rotationScale) * Math.PI;

    return new RotationComponent(neptuneRotation);
  }

  private createRevolutionComponent() {
    const { revolution } = solarSystem.neptune;
    const neptuneRevolution = getRevolution(revolution);

    return new RevolutionComponent(neptuneRevolution);
  }

  private createMeshComponent() {
    const { planetMesh } = createPlanet(
      this.sceneService.scene,
      'neptune',
      '2k_neptune.jpg'
    );

    planetMesh.position.z -= 5500;

    return new MeshComponent(planetMesh);
  }

  private createPickableComponent() {
    return new PickableComponent(true);
  }
}
