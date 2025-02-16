export function getRevolution(revolution: number) {
  return Math.log(revolution) / (24 * 60 * Math.PI);
}
