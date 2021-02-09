import React from 'react';
import * as THREE from 'three';
import { resolution, materials } from './materials';
import { face }      from './mediapipe';
import { activeMat } from './App';

//
// Scene
//
var mesh;
var renderer;
var mask;
  
class Scene extends React.Component
{
  componentDidMount()
  {
    const scene    = new THREE.Scene();
    const camera   = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(resolution.x, resolution.y);

    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    this.mount.appendChild(renderer.domElement);

    // TODO: Apply scale / transfer
    const geometry = new THREE.PlaneBufferGeometry( 2, 2 );
    mesh = new THREE.Mesh(geometry, materials[activeMat]);
    mesh.translateZ(-0.1); 
    scene.add(mesh);

    var maskMat = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
    var maskGeom, mask;

    var animate = function ()
    {
      requestAnimationFrame( animate );

      if(materials[activeMat].uniforms['u_time'])
        materials[activeMat].uniforms['u_time'].value = performance.now() / 1000;

      if(materials[activeMat].uniforms['u_face'])
      {
        maskGeom = new THREE.BufferGeometry().setFromPoints( face );
        mask = new THREE.Line( maskGeom, maskMat );
        scene.add(mask);
      }
    
      renderer.render(scene, camera);

      if(materials[activeMat].uniforms['u_face'])
      {
        scene.remove(mask);        
        maskGeom.dispose();
      }
    };

    animate();
  }

  render()
  {
    return ( <div ref={ref =>	(this.mount = ref)} />)
  }
}

export {Scene, mesh, renderer};
