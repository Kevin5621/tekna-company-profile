import { extend } from '@react-three/fiber';
import * as THREE from 'three';

// Extend the react-three-fiber catalog with three.js objects
extend({
  AmbientLight: THREE.AmbientLight,
  DirectionalLight: THREE.DirectionalLight,
  PointLight: THREE.PointLight,
});

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: ReactThreeFiber.Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
      directionalLight: ReactThreeFiber.Object3DNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
      pointLight: ReactThreeFiber.Object3DNode<THREE.PointLight, typeof THREE.PointLight>;
      primitive: ReactThreeFiber.Object3DNode<THREE.Object3D, typeof THREE.Object3D> & {
        object: THREE.Object3D;
      };
    }
  }
}

export {};
