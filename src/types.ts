export type RoutePath = '/' | '/left' | '/right';

export type ReelSide = 'left' | 'right';

export interface ReelInteractionState {
  isNavigating: boolean;
  activeReel: ReelSide | null;
  rotationDegrees: {
    left: number;
    right: number;
  };
}
