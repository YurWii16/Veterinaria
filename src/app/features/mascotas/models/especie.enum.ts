export enum Especie {
  CANINO = 'Canino',
  FELINO = 'Felino',
  AVE = 'Ave',
  EXOTICO = 'Exótico',
  ROEDOR = 'Roedor',
  REPTIL = 'Reptil',
}

export const EspecieLabel: Record<Especie, string> = {
  [Especie.CANINO]: '🐕 Canino',
  [Especie.FELINO]: '🐱 Felino',
  [Especie.AVE]: '🦜 Ave',
  [Especie.EXOTICO]: '🦎 Exótico',
  [Especie.ROEDOR]: '🐹 Roedor',
  [Especie.REPTIL]: '🐍 Reptil',
};
