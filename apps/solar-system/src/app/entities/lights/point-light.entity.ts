import { injectable } from 'inversify';
import { SceneService } from '../../core/scene.service';
import { WorldService } from '../../core/world.service';
import { Color3, PointLight, Vector3 } from '@babylonjs/core';
import { PointLightComponent } from '../../components/point-light.component';
import { injectService } from '../../injector/inject-service.function';

@injectable()
export class PointLightEntity {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);

  public constructor() {
    this.initialize();
  }

  private initialize() {
    const { pointLight } = this.createHemisphericLightComponent();

    this.worldService.getWorld<PointLightComponent>().add({ pointLight });
  }

  private createHemisphericLightComponent() {
    const pointLight = new PointLight(
      'point_light',
      new Vector3(0, 0, 0),
      this.sceneService.scene
    );
    pointLight.diffuse = Color3.White();
    pointLight.specular = Color3.Black();
    return new PointLightComponent(pointLight);
  }
}
