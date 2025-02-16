import { injectable } from 'inversify';
import { WorldService } from '../core/world.service';
import { injectService } from '../injector/inject-service.function';
import { SceneService } from '../core/scene.service';
import { NameplateComponent } from '../components/nameplate.component';
import { NameplateLineComponent } from '../components/nameplate-line.component';
import { CreateLines, type LinesMesh, AbstractMesh } from '@babylonjs/core';

@injectable()
export class NameplateLineSystem {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);

  private readonly nameplateEntityQuery = this.worldService
    .getWorld<NameplateComponent & NameplateLineComponent>()
    .with('nameplate', 'nameplateLine');

  public constructor() {
    this.initialize();
  }

  private initialize() {
    this.sceneService.scene.onBeforeRenderObservable.add(() => {
      for (const nameplateEntity of this.nameplateEntityQuery) {
        const { nameplateLine, nameplate } = nameplateEntity;
        function isMesh(value: unknown): value is AbstractMesh {
          return value instanceof AbstractMesh;
        }

        const { parent } = nameplate;

        if (!isMesh(parent)) {
          throw Error(`parent mesh is ${parent}`);
        }

        if (nameplateLine) {
          nameplateEntity.nameplateLine = this.updateLines(
            nameplateLine,
            parent,
            nameplate
          );
        } else {
          nameplateEntity.nameplateLine = this.createLines(parent, nameplate);
        }
      }
    });
  }

  private getLinePoints(planetMesh: AbstractMesh, nameplateMesh: AbstractMesh) {
    return [
      planetMesh.getAbsolutePosition(),
      nameplateMesh.getAbsolutePosition(),
    ];
  }

  private createLines(planetMesh: AbstractMesh, nameplateMesh: AbstractMesh) {
    const { name } = planetMesh;
    const { scene } = this.sceneService;

    const lines = CreateLines(
      `${name}_line`,
      {
        points: this.getLinePoints(planetMesh, nameplateMesh),
        updatable: true,
      },
      scene
    );
    lines.renderingGroupId = 1;

    return lines;
  }

  private updateLines(
    linesInstance: LinesMesh,
    planetMesh: AbstractMesh,
    nameplateMesh: AbstractMesh
  ) {
    const { name } = planetMesh;

    return CreateLines(`${name}_line`, {
      points: this.getLinePoints(planetMesh, nameplateMesh),
      instance: linesInstance,
    });
  }
}
