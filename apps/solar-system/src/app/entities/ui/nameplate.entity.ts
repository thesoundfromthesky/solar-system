import { injectable } from 'inversify';
import { injectService } from '../../injector/inject-service.function';
import { WorldService } from '../../core/world.service';
import { SceneService } from '../../core/scene.service';
import { NameplateComponent } from '../../components/nameplate.component';
import { type AbstractMesh, CreatePlane, Mesh } from '@babylonjs/core';
import { AdvancedDynamicTexture, Rectangle, TextBlock } from '@babylonjs/gui';
import { NameplateLineComponent } from '../../components/nameplate-line.component';

@injectable()
export class NameplateEntity {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);

  public initialize(planetMesh: AbstractMesh) {
    const { nameplate } = this.createNameplateComponent(planetMesh);
    const { nameplateLine } = this.createNameplateLineComponent();

    this.worldService
      .getWorld<NameplateComponent & NameplateLineComponent>()
      .add({ nameplate, nameplateLine });
  }

  private createNameplateComponent(planetMesh: AbstractMesh) {
    const { name } = planetMesh;
    const nameplatePlane = CreatePlane(
      `${name}_name_plate`,
      { size: 1 },
      this.sceneService.scene
    );
    nameplatePlane.renderingGroupId = 2;
    nameplatePlane.setParent(planetMesh);
    nameplatePlane.position.z = 0;
    const { extendSize } = planetMesh.getBoundingInfo().boundingBox;

    nameplatePlane.scaling.x = 150;
    nameplatePlane.scaling.y = 150;

    const { extendSizeWorld: planeExtendSizeWorld } =
      nameplatePlane.getBoundingInfo().boundingBox;
    nameplatePlane.billboardMode = Mesh.BILLBOARDMODE_ALL;
    nameplatePlane.position.x = extendSize.x + planeExtendSizeWorld.x * 35;
    nameplatePlane.position.y = extendSize.y + planeExtendSizeWorld.y * 35;
    const advancedDynamicTextureForMesh =
      AdvancedDynamicTexture.CreateForMesh(nameplatePlane);

    const rect = new Rectangle(name);
    advancedDynamicTextureForMesh.addControl(rect);
    rect.color = 'Orange';
    rect.background = 'green';
    rect.adaptWidthToChildren = true;
    rect.adaptHeightToChildren = true;

    const uppercaseName = name[0].toUpperCase() + name.slice(1);
    const text = new TextBlock(`${name}_text`, uppercaseName);
    rect.addControl(text);
    text.fontSize = 200;
    text.resizeToFit = true;

    return new NameplateComponent(nameplatePlane);
  }

  private createNameplateLineComponent() {
    return new NameplateLineComponent(null);
  }
}
