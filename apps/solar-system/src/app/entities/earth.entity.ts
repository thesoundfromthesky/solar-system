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
import { MoonEntity } from './moon.entity';
import { PickableComponent } from '../components/pickable.component';
import { NameplateEntity } from './ui/nameplate.entity';

@injectable()
export class EarthEntity {
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

    const moonEntity = this.injector.createInstance(MoonEntity);
    moonEntity.setParent(mesh);

    const namePlateEntity = this.injector.createInstance(NameplateEntity);
    namePlateEntity.initialize(mesh);
  }

  private createPlanetDataComponent() {
    return new PlanetDataComponent({
      mass: '5.972 x 10^24 kg',
      gravity: '9.807 m/s²',
      radius: '6,356 km',
      lengthOfYear: '365 days',
      lengthOfDay: '24 hours',
      diameter: 12_756,
      distance: 149_600_000,
      scaledDiameter: 1,
      scaledDistance: 1,
      rotation: 24,
      revolution: 365,
    });
  }

  private createRotationComponent() {
    const { rotation } = solarSystem.earth;

    const earthRotation = (rotation / rotationScale) * Math.PI;

    return new RotationComponent(earthRotation);
  }

  private createRevolutionComponent() {
    const { revolution } = solarSystem.earth;
    const earthRevolution = getRevolution(revolution);

    return new RevolutionComponent(earthRevolution);
  }

  private createMeshComponent() {
    const { planetMesh } = createPlanet(
      this.sceneService.scene,
      'earth',
      '2k_earth_daymap.jpg'
    );

    planetMesh.position.z += 200;

    return new MeshComponent(planetMesh);
  }

  private createPickableComponent() {
    return new PickableComponent(true);
  }
}
