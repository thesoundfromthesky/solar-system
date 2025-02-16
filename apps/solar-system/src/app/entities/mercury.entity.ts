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
export class MercuryEntity {
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
      mass: '3.285 x 10^23 kg',
      gravity: '3.7 m/s²',
      radius: '2,439.7 km',
      lengthOfYear: '88 days',
      lengthOfDay: '59d 0h 0m',
      diameter: 4_879,
      distance: 57_900_000,
      scaledDiameter: 0.4,
      scaledDistance: 0.39,
      rotation: 1_408,
      revolution: 88,
    });
  }

  private createRotationComponent() {
    const { rotation } = solarSystem.mercury;

    const mercuryRotation = (rotation / rotationScale) * Math.PI;

    return new RotationComponent(mercuryRotation);
  }

  private createRevolutionComponent() {
    const { revolution } = solarSystem.mercury;
    const mercuryRevolution = getRevolution(revolution);

    return new RevolutionComponent(mercuryRevolution);
  }

  private createMeshComponent() {
    const { planetMesh } = createPlanet(
      this.sceneService.scene,
      'mercury',
      '2k_mercury.jpg'
    );

    planetMesh.position.z += 100;

    return new MeshComponent(planetMesh);
  }

  private createPickableComponent() {
    return new PickableComponent(true);
  }
}
