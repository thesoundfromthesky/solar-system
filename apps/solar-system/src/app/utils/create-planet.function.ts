import {
  CreateSphere,
  StandardMaterial,
  type Scene,
  Texture,
} from '@babylonjs/core';
import { diameterScale, distanceScale, solarSystem } from '../solar-system';

export function createPlanet(
  scene: Scene,
  name: keyof typeof solarSystem,
  texture: string
) {
  const planet = solarSystem[name];
  const { scaledDiameter, scaledDistance } = planet;

  const diameter = (Math.log(scaledDiameter) + 2) * diameterScale;

  const planetMesh = CreateSphere(
    name,
    {
      diameter,
    },
    scene
  );

  const distance = scaledDistance * distanceScale;
  planetMesh.position.z = distance;
  planetMesh.renderingGroupId = 2;
  const planetMat = new StandardMaterial(name);

  const planetTexture = new Texture(`textures/${name}/${texture}`);
  planetTexture.uScale = -1;
  planetTexture.vScale = -1;

  planetMat.diffuseTexture = planetTexture;
  planetMesh.material = planetMat;

  return { planetMesh, planetMat };
}
