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
import { Injector } from '../injector/injector';
import { SaturnRingEntity } from './saturn-ring.entity';
import { PickableComponent } from '../components/pickable.component';
import { NameplateEntity } from './ui/nameplate.entity';

@injectable()
export class SaturnEntity {
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

    const saturnRingEntity = this.injector.createInstance(SaturnRingEntity);
    saturnRingEntity.setParent(mesh);

    const namePlateEntity = this.injector.createInstance(NameplateEntity);
    namePlateEntity.initialize(mesh);
  }

  private createPlanetDataComponent() {
    return new PlanetDataComponent({
      mass: '5.683 × 10^26 kg',
      gravity: '10.44 m/s²',
      radius: '58,232 km',
      lengthOfYear: '29.5 years',
      lengthOfDay: '0d 10h 34m',
      diameter: 120_536,
      distance: 1_433_500_000,
      scaledDiameter: 9.5,
      scaledDistance: 9.54,
      rotation: 11,
      revolution: 10_759,
    });
  }

  private createRotationComponent() {
    const { rotation } = solarSystem.saturn;
    const saturnRotation = (rotation / rotationScale) * Math.PI;

    return new RotationComponent(saturnRotation);
  }

  private createRevolutionComponent() {
    const { revolution } = solarSystem.saturn;
    const saturnRevolution = getRevolution(revolution);

    return new RevolutionComponent(saturnRevolution);
  }

  private createMeshComponent() {
    const { planetMesh } = createPlanet(
      this.sceneService.scene,
      'saturn',
      '2k_saturn.jpg'
    );

    planetMesh.position.z -= 1400;

    return new MeshComponent(planetMesh);
  }

  private createPickableComponent() {
    return new PickableComponent(true);
  }
}
