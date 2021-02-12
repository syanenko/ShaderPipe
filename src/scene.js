import React from 'react';
import * as THREE from 'three';
import { resolution, materials } from './materials';
import { face }      from './mediapipe';
import { activeMat } from './App';

const MAX_FACE_POINT = 468;

//
// Scene
//
var renderer;
var videoMesh;
class Scene extends React.Component
{
  componentDidMount()
  {
    const scene    = new THREE.Scene();
    const camera   = new THREE.OrthographicCamera( 0, 1, 1, 0, 10, 0 );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(resolution.x, resolution.y);

    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    this.mount.appendChild(renderer.domElement);

    // Video
    const videoGeom = new THREE.PlaneBufferGeometry( 1, 1 );
    videoMesh = new THREE.Mesh(videoGeom, materials[activeMat]);
    videoMesh.position.z = 0.0;
    videoMesh.position.x = 0.5;
    videoMesh.position.y = 0.5;
    scene.add(videoMesh);

    // Mask and marks materials
    const maskMat = new THREE.MeshPhongMaterial( {
      vertexColors: true
    } );
    
    const marksMat = new THREE.PointsMaterial( { color: 0x00FF00, size: 4.0 } );
    
    // Mask prepare
    var maskGeom = new THREE.BufferGeometry();
    const MAX_POINTS = 10;
    const NUM_TRIANGLES = 1;
    const positions = new Float32Array( MAX_POINTS * 3 );
    var normals     = new Float32Array( NUM_TRIANGLES * 3 * 3 );
    var colors      = new Float32Array( NUM_TRIANGLES * 3 * 3 );
    // var uvs         = new Float32Array( NUM_TRIANGLES * 3 * 2 );

    // colors
    var color = new THREE.Color();
    color.setRGB( 1, 0, 0 );
    colors[0] = color.b;
    colors[1] = color.g;
    colors[2] = color.r;

    color.setRGB( 0, 1, 0 );
    colors[3] = color.b;
    colors[4] = color.g;
    colors[5] = color.r;

    color.setRGB( 0, 0, 1 );
    colors[6] = color.b;
    colors[7] = color.g;
    colors[8] = color.r;

    // uvs
    /*
    uvs[0] = 0;
    uvs[1] = 1;
    uvs[2] = 0;
    uvs[3] = 1;
    uvs[4] = 0;
    uvs[5] = 1;
    */

    maskGeom.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    maskGeom.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
    maskGeom.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    // maskGeom.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
    maskGeom.setDrawRange( 0, 3);
    var mask = new THREE.Mesh(maskGeom, maskMat);
    mask.position.z = -1;
    scene.add(mask);

    const light = new THREE.PointLight( 0xffffff, 1, 100 );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    var marks = new THREE.Points( maskGeom, marksMat );
    scene.add(marks);

    // Text
    var text = [MAX_FACE_POINT];
    const loader = new THREE.FontLoader();
    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font )
    {
      const matText = new THREE.LineBasicMaterial( {
        color: 0xFF0000
      } );

      for(let c=0; c < MAX_FACE_POINT; c++ )
      {
        const shapes = font.generateShapes( c.toString(), 0.005 );
        const geometry = new THREE.ShapeBufferGeometry( shapes );
        text[c] = new THREE.Mesh( geometry, matText );
        text[c].position.z = -2;
        scene.add( text[c] );
      }
    });

    var animate = function ()
    {
      requestAnimationFrame( animate );

      if(materials[activeMat].uniforms['u_time'])
        materials[activeMat].uniforms['u_time'].value = performance.now() / 1000;

      if(materials[activeMat].uniforms['u_face'])
      {
        maskGeom.attributes.position.needsUpdate = true;
        let positions = maskGeom.attributes.position.array;
        positions[0] = face[230].x;
        positions[1] = face[230].y;
        positions[2] = 0;

        positions[3] = face[20].x;
        positions[4] = face[20].y;
        positions[5] = 0;

        positions[6] = face[10].x;
        positions[7] = face[10].y;
        positions[8] = 0;

        maskGeom.computeVertexNormals();
        mask.visible = true; // TODO: temporary
      } else
      {
        mask.visible = false; // TODO: temporary
      }

      if(materials[activeMat].uniforms['u_debug'])
        if(materials[activeMat].uniforms['u_debug'].value)
        {
          if(!marks.visible)
          {
            for(let c=0; c < MAX_FACE_POINT; c++ )
              scene.add(text[c]);
            scene.add(marks);
            marks.visible = true;
          }

          for(let p=0; p < MAX_FACE_POINT; p++)
          if(text[p])  
            if(text[p].position)
            {
              text[p].position.x = face[p].x;
              text[p].position.y = face[p].y;
              text[p].visible = true;
            }
        }
        else
        {
          if(marks.visible)
          {
            for(let c=0; c < MAX_FACE_POINT; c++ )
              scene.remove(text[c]);
            scene.remove(marks);
            marks.visible = false;
          }
       }

      renderer.render(scene, camera);
    };

    animate();
  }

  render()
  {
    return ( <div ref={ref =>	(this.mount = ref)} />)
  }
}

export {Scene, videoMesh, renderer};
