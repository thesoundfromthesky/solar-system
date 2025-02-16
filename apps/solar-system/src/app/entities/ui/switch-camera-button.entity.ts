import { injectable } from 'inversify';
import { injectService } from '../../injector/inject-service.function';
import { WorldService } from '../../core/world.service';
import { SceneService } from '../../core/scene.service';
import { AdvancedDynamicTextureService } from '../../core/advanced-dynamic-texture.service';
import { ButtonComponent } from '../../components/button.component';
import { Button, Control } from '@babylonjs/gui';
import type { UniversalCameraComponent } from '../../components/universal-camera.component';
import type { ArcRotateCameraComponent } from '../../components/arc-rotate-camera.component';
import { CameraService } from '../../utils/camera.service';

type SwitchButtonEntityType = ButtonComponent;

@injectable()
export class SwitchButtonEntity {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);
  private readonly cameraService = injectService(CameraService);
  private readonly advancedDynamicTextureService = injectService(
    AdvancedDynamicTextureService
  );

  public constructor() {
    this.initialize();
  }

  private initialize() {
    const { button } = this.createButtonComponent();

    this.worldService.getWorld<SwitchButtonEntityType>().add({ button });
  }

  private createButtonComponent() {
    const switchCameraButton = Button.CreateSimpleButton(
      'switch_camera',
      'Switch View'
    );
    this.advancedDynamicTextureService.advancedDynamicTexture.addControl(
      switchCameraButton
    );
    switchCameraButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    switchCameraButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    switchCameraButton.color = 'white';
    switchCameraButton.background = 'green';
    switchCameraButton.width = '80px';
    switchCameraButton.height = '20px';

    const topViewCameraQuery = this.worldService
      .getWorld<UniversalCameraComponent>()
      .with('universalCamera');
    const followCameraQuery = this.worldService
      .getWorld<ArcRotateCameraComponent>()
      .with('arcRotateCamera');

    const { scene } = this.sceneService;

    const switchCamera = () => {
      const topViewCamera = topViewCameraQuery.first;
      const followCamera = followCameraQuery.first;

      if (topViewCamera && followCamera) {
        const { universalCamera } = topViewCamera;
        const { arcRotateCamera } = followCamera;

        switch (scene.activeCamera) {
          case universalCamera:
            this.cameraService.switchActiveCamera(arcRotateCamera);
            break;
          case arcRotateCamera:
            this.cameraService.switchActiveCamera(universalCamera);
            break;
        }
      }
    };

    switchCameraButton.onPointerClickObservable.add(switchCamera);

    return new ButtonComponent(switchCameraButton);
  }
}
