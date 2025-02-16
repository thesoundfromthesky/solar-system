import { injectable } from 'inversify';
import { Injector } from '../injector/injector';
import { SunEntity } from '../entities/sun.entity';
import { RotationSystem } from '../systems/rotation.system';
import { TopViewCameraEntity } from '../entities/cameras/top-view-camera.entity';
import { HemisphericLightEntity } from '../entities/lights/hemispheric-light.entity';
import { SpaceEntity } from '../entities/space.entity';
import { PointLightEntity } from '../entities/lights/point-light.entity';
import { injectService } from '../injector/inject-service.function';
import { MercuryEntity } from '../entities/mercury.entity';
import { RevolutionSystem } from '../systems/revolution.system';
import { VenusEntity } from '../entities/venus.entity';
import { EarthEntity } from '../entities/earth.entity';
import { MarsEntity } from '../entities/mars.entity';
import { JupiterEntity } from '../entities/jupiter.entity';
import { SaturnEntity } from '../entities/saturn.entity';
import { UranusEntity } from '../entities/uranus.entity';
import { NeptuneEntity } from '../entities/neptune.entity';
import { FollowCameraEntity } from '../entities/cameras/follow-camera.entity';
import { ZoomToPlanetSystem } from '../systems/zoom-to-planet.system';
import { PickableSystem } from '../systems/pickable.system';
import { SwitchButtonEntity } from '../entities/ui/switch-camera-button.entity';
import { PlanetInfoStackPanelEntity } from '../entities/ui/planet-info-stack-panel.entity';
import { NameplateLineSystem } from '../systems/nameplate-line.system';

@injectable()
export class SpaceWorld {
  private readonly injector = injectService(Injector);
  public constructor() {
    this.initialize();
  }

  private initialize() {
    this.injector.createInstances([
      TopViewCameraEntity,
      FollowCameraEntity,
      HemisphericLightEntity,
      PointLightEntity,
      SpaceEntity,
      SunEntity,
      MercuryEntity,
      VenusEntity,
      EarthEntity,
      MarsEntity,
      JupiterEntity,
      SaturnEntity,
      UranusEntity,
      NeptuneEntity,
      RotationSystem,
      RevolutionSystem,
      ZoomToPlanetSystem,
      PickableSystem,
      NameplateLineSystem,
      SwitchButtonEntity,
      PlanetInfoStackPanelEntity,
    ]);
  }
}
