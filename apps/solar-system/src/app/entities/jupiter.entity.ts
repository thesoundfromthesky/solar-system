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
export class JupiterEntity {
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
      mass: '1.898 × 10^27 kg',
      gravity: '24.79 m/s²',
      radius: '69,911 km',
      lengthOfYear: '4,333 days',
      lengthOfDay: '0d 9h 56m',
      diameter: 142_984,
      distance: 778_600_000,
      scaledDiameter: 11.2,
      scaledDistance: 5.2,
      rotation: 10,
      revolution: 4_333,
    });
  }

  private createRotationComponent() {
    const { rotation } = solarSystem.jupiter;

    const jupiterRotation = (rotation / rotationScale) * Math.PI;

    return new RotationComponent(jupiterRotation);
  }

  private createRevolutionComponent() {
    const { revolution } = solarSystem.jupiter;
    const jupiterRevolution = getRevolution(revolution);

    return new RevolutionComponent(jupiterRevolution);
  }

  private createMeshComponent() {
    const { planetMesh } = createPlanet(
      this.sceneService.scene,
      'jupiter',
      '2k_jupiter.jpg'
    );

    planetMesh.position.z -= 700;

    return new MeshComponent(planetMesh);
  }

  private createPickableComponent() {
    return new PickableComponent(true);
  }
}
