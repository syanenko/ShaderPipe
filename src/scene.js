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
    const camera   = new THREE.OrthographicCamera( 0, 1, 1, 0, 0, 1 );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(resolution.x, resolution.y);

    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    this.mount.appendChild(renderer.domElement);

    const texGeom = new THREE.PlaneBufferGeometry( 1, 1 );
    mesh = new THREE.Mesh(texGeom, materials[activeMat]);
    mesh.translateZ(-0.1);
    mesh.translateX(0.5);
    mesh.translateY(0.5);
    scene.add(mesh);

    const maskMat = new THREE.LineBasicMaterial( { color: 0x00FF00 } );
    const marksMat = new THREE.PointsMaterial( { color: 0xFF0000, size: 4.0 } );
    var maskGeom, mask, marks;

    var animate = function ()
    {
      requestAnimationFrame( animate );

      if(materials[activeMat].uniforms['u_time'])
        materials[activeMat].uniforms['u_time'].value = performance.now() / 1000;

      if(materials[activeMat].uniforms['u_face'])
      {
        // Draw mask
        // TODO: Draw selected trigles
        // maskGeom = new THREE.BufferGeometry().setFromPoints( face );
        var points = [];
        points.push(face[10], face[20], face[30], face[10]);
        points.push(face[100], face[120], face[130], face[100]);
        points.push(face[400], face[420], face[430], face[400]);
        maskGeom = new THREE.BufferGeometry().setFromPoints( points );
        mask = new THREE.Line( maskGeom, maskMat );
        scene.add(mask);

        // Draw marks
        if(materials[activeMat].debug)
        {
          marks = new THREE.Points( maskGeom, marksMat );
          scene.add(marks);
        }
      }

      renderer.render(scene, camera);

      if(materials[activeMat].uniforms['u_face'])
      {
        scene.remove(mask);
        scene.remove(marks);
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
