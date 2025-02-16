export interface PlanetData {
  mass: string;
  gravity: string;
  radius: string;
  lengthOfYear: string;
  lengthOfDay: string;
  diameter: number;
  distance: number;
  scaledDiameter: number;
  scaledDistance: number;
  rotation: number;
  revolution: number;
}

export class PlanetDataComponent {
  public constructor(public readonly planetData: PlanetData) {}
}
