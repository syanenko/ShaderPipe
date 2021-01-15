import React from 'react';
import * as THREE from 'three';
import { resolution, materials } from './materials';
import { activeMat } from './App';

//
// Scene
//
var mesh;
var renderer;
  
class Scene extends React.Component
{
  componentDidMount()
  {
    const scene    = new THREE.Scene();
    const camera   = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(resolution.x, resolution.y);

    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    this.mount.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneBufferGeometry( 2, 2 );
    mesh = new THREE.Mesh(geometry, materials[activeMat]);
    scene.add(mesh);

    var animate = function ()
    {
      requestAnimationFrame( animate );

      if(materials[activeMat].uniforms['u_time'])
        materials[activeMat].uniforms['u_time'].value = performance.now() / 1000;

      renderer.render(scene, camera);
    };

    animate();
  }

  render()
  {
    // renderer.setSize(resolution.x, resolution.y);
    return ( <div ref={ref =>	(this.mount = ref)} />)
  }
}

export {Scene, mesh, renderer};
