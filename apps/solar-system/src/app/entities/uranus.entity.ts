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
export class UranusEntity {
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
      mass: '8.681 x 10^25 kg',
      gravity: '8.87 m/s²',
      radius: '25,559 km',
      lengthOfYear: '84 years',
      lengthOfDay: '0d 17h 14m',
      diameter: 51_118,
      distance: 2_872_500_000,
      scaledDiameter: 4,
      scaledDistance: 19.2,
      rotation: 17,
      revolution: 30_687,
    });
  }

  private createRotationComponent() {
    const { rotation } = solarSystem.uranus;
    const uranusRotation = (rotation / rotationScale) * Math.PI;

    return new RotationComponent(uranusRotation);
  }

  private createRevolutionComponent() {
    const { revolution } = solarSystem.uranus;
    const uranusRevolution = getRevolution(revolution);

    return new RevolutionComponent(uranusRevolution);
  }

  private createMeshComponent() {
    const { planetMesh } = createPlanet(
      this.sceneService.scene,
      'uranus',
      '2k_uranus.jpg'
    );

    planetMesh.position.z -= 3500;

    return new MeshComponent(planetMesh);
  }

  private createPickableComponent() {
    return new PickableComponent(true);
  }
}
