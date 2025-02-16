import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { WorldService } from '../core/world.service';
import { SceneService } from '../core/scene.service';
import { RotationComponent } from '../components/rotation.component';
import { MeshComponent } from '../components/mesh.component';
import {
  type AbstractMesh,
  CreateTorus,
  StandardMaterial,
  Texture,
  Tools,
} from '@babylonjs/core';
import { solarSystem } from '../solar-system';

export type SaturnRingEntityType = MeshComponent & RotationComponent;

@injectable()
export class SaturnRingEntity {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);

  public saturnRingEntity!: SaturnRingEntityType;

  public constructor() {
    this.initialize();
  }

  public setParent(mesh: AbstractMesh) {
    this.saturnRingEntity.mesh.setParent(mesh);
    this.saturnRingEntity.mesh.position.z = 0;
    this.saturnRingEntity.mesh.scaling.y = 0.001;
    this.saturnRingEntity.mesh.rotation.x = Tools.ToRadians(325.5);
  }

  private initialize() {
    const { rotation } = this.createRotationComponent();
    const { mesh } = this.createMeshComponent();

    this.saturnRingEntity = this.worldService
      .getWorld<SaturnRingEntityType>()
      .add({ rotation, mesh });
  }

  private createRotationComponent() {
    const saturnRotation = 0.001;

    return new RotationComponent(saturnRotation);
  }

  private createMeshComponent() {
    const { scaledDiameter } = solarSystem.saturn;

    const saturnRing = CreateTorus(
      'saturn_ring',
      {
        diameter: scaledDiameter * 30,
        thickness: scaledDiameter * 4,
        tessellation: 128,
      },
      this.sceneService.scene
    );

    const saturnRingMat = new StandardMaterial('saturn_ring');
    const saturnRingTexture = new Texture(
      'textures/saturn/2k_saturn_ring_alpha.png'
    );
    saturnRingTexture.hasAlpha = true;
    saturnRingTexture.uScale = -1;
    saturnRingTexture.vScale = -1;
    saturnRingMat.diffuseTexture = saturnRingTexture;

    saturnRingMat.backFaceCulling = false;
    saturnRingMat.useAlphaFromDiffuseTexture = true;
    saturnRing.material = saturnRingMat;

    return new MeshComponent(saturnRing);
  }
}
