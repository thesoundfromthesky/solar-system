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
export class VenusEntity {
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
      mass: '4.867 x 10^24 kg',
      gravity: '8.87 m/s²',
      radius: '6,051.8 km',
      lengthOfYear: '225 days',
      lengthOfDay: '243d 0h 0m',
      diameter: 12_104,
      distance: 108_200_000,
      scaledDiameter: 0.9,
      scaledDistance: 0.72,
      rotation: 5_832,
      revolution: 225,
    });
  }

  private createRotationComponent() {
    const { rotation } = solarSystem.venus;
    const venusRotation = (rotation / rotationScale) * Math.PI;

    return new RotationComponent(venusRotation);
  }

  private createRevolutionComponent() {
    const { revolution } = solarSystem.venus;
    const venusRevolution = getRevolution(revolution);

    return new RevolutionComponent(venusRevolution);
  }

  private createMeshComponent() {
    const { planetMesh } = createPlanet(
      this.sceneService.scene,
      'venus',
      '2k_venus_surface.jpg'
    );

    planetMesh.position.z += 100;

    return new MeshComponent(planetMesh);
  }

  private createPickableComponent() {
    return new PickableComponent(true);
  }
}
