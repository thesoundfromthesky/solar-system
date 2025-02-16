import {  injectable } from 'inversify';
import { SceneService } from '../core/scene.service';
import { WorldService } from '../core/world.service';
import { MeshComponent } from '../components/mesh.component';
import {
  Color3,
  CreateBox,
  CubeTexture,
  StandardMaterial,
  Texture,
} from '@babylonjs/core';
import { injectService } from '../injector/inject-service.function';

@injectable()
export class SpaceEntity {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);

  public constructor() {
    this.initialize();
  }

  private initialize() {
    const { mesh } = this.createMeshComponent();
    this.worldService.getWorld<MeshComponent>().add({ mesh });
  }

  private createMeshComponent() {
    const scene = this.sceneService.scene;
    const spaceMesh = CreateBox(
      'Space',
      {
        size: 99999,
      },
      scene
    );
    spaceMesh.renderingGroupId = 0;

    const spaceMaterial = new StandardMaterial('Space', scene);
    spaceMaterial.backFaceCulling = false;
    spaceMaterial.disableLighting = true;

    const extensions = [
      '_px.png',
      '_py.png',
      '_pz.png',
      '_nx.png',
      '_ny.png',
      '_nz.png',
    ];

    spaceMaterial.reflectionTexture = new CubeTexture(
      '/textures/space/space',
      scene,
      extensions
    );
    spaceMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    spaceMaterial.diffuseColor = new Color3(0, 0, 0);
    spaceMaterial.specularColor = new Color3(0, 0, 0);
    spaceMesh.material = spaceMaterial;

    return new MeshComponent(spaceMesh);
  }
}
