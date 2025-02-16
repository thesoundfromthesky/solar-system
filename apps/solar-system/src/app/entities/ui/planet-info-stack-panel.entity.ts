import { Control, StackPanel, TextBlock } from '@babylonjs/gui';
import { injectable } from 'inversify';
import { injectService } from '../../injector/inject-service.function';
import { AdvancedDynamicTextureService } from '../../core/advanced-dynamic-texture.service';
import { CameraService } from '../../utils/camera.service';
import { PlanetService } from '../../utils/planet.service';
import { solarSystem } from '../../solar-system';

@injectable()
export class PlanetInfoStackPanelEntity {
  private readonly advancedDynamicTextureService = injectService(
    AdvancedDynamicTextureService
  );
  private readonly cameraService = injectService(CameraService);
  private readonly planetService = injectService(PlanetService);

  public constructor() {
    this.initialize();
  }

  private initialize() {
    this.createStackPanel();
  }

  private createStackPanel() {
    const stackPanel = new StackPanel('planet_info');
    this.advancedDynamicTextureService.advancedDynamicTexture.addControl(
      stackPanel
    );
    stackPanel.isVisible = false;
    stackPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    stackPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    stackPanel.background = '#0000009c';
    stackPanel.adaptWidthToChildren = true;

    const distanceTextBlock = this.createTextBlock('distance');
    stackPanel.addControl(distanceTextBlock);

    const massTextBlock = this.createTextBlock('mass');
    stackPanel.addControl(massTextBlock);

    const gravityTextBlock = this.createTextBlock('gravity');
    stackPanel.addControl(gravityTextBlock);

    const radiusTextBlock = this.createTextBlock('radius');
    stackPanel.addControl(radiusTextBlock);

    const lengthOfYearTextBlock = this.createTextBlock('lengthOfYear');
    stackPanel.addControl(lengthOfYearTextBlock);

    const lengthOfDayTextBlock = this.createTextBlock('lengthOfDay');
    stackPanel.addControl(lengthOfDayTextBlock);

    type UpdatePlanetInfo = Parameters<
      PlanetService['onClickPlanetObserver$']['add']
    >[0];

    const updatePlanetInfo: UpdatePlanetInfo = ({ name }) => {
      const isPlanetName = (name: string): name is keyof typeof solarSystem => {
        return name in solarSystem;
      };
      if (isPlanetName(name)) {
        const { distance, mass, gravity, radius, lengthOfYear, lengthOfDay } =
          solarSystem[name];

        distanceTextBlock.text = `Distance: ${distance}`;
        massTextBlock.text = `Mass: ${mass}`;
        gravityTextBlock.text = `Gravity: ${gravity}`;
        radiusTextBlock.text = `Radius: ${radius}`;
        lengthOfYearTextBlock.text = `Length of Year: ${lengthOfYear}`;
        lengthOfDayTextBlock.text = `Length of Day: ${lengthOfDay}`;
      }
    };

    this.planetService.onClickPlanetObserver$.add(updatePlanetInfo);

    const showPlanetInfoStackPanel = () => {
      stackPanel.isVisible = this.cameraService.isCloseView();
    };
    
    this.cameraService.activeCameraObserver$.add(() => {
      showPlanetInfoStackPanel();
      if (this.cameraService.isCloseView()) {
        updatePlanetInfo(this.cameraService.currentTarget, undefined as never);
      }
    });
  }

  private createTextBlock(name: string) {
    const textBlock = new TextBlock(name);
    textBlock.text = name;
    textBlock.color = 'white';
    textBlock.resizeToFit = true;
    textBlock.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

    return textBlock;
  }
}
