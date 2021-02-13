import React from 'react';
import * as THREE from 'three';
import { resolution, materials } from './materials';
import { face, needsDraw } from './mediapipe';
import { activeMat, fontScale } from './App';

const MAX_FACE_POINT = 468;

//
// Scene
//
var renderer;
var videoMesh;
var fontScaleCache = fontScale;

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
    const NUM_TRIANGLES = 2;
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

    color.setRGB( 1, 0, 0 );
    colors[9] = color.b;
    colors[10] = color.g;
    colors[11] = color.r;

    color.setRGB( 0, 1, 0 );
    colors[12] = color.b;
    colors[13] = color.g;
    colors[14] = color.r;

    color.setRGB( 0, 0, 1 );
    colors[15] = color.b;
    colors[16] = color.g;
    colors[17] = color.r;

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
    maskGeom.setDrawRange( 0, 6);
    var mask = new THREE.Mesh(maskGeom, maskMat);
    mask.position.z = -1;
    scene.add(mask);

    const light = new THREE.PointLight( 0xffffff, 1, 100 );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    // Mask marks
    var marks = new THREE.Points( maskGeom, marksMat );
    scene.add(marks);

    // Text landmarks
    var font;
    var landmarks = [MAX_FACE_POINT];
    
    function loadLandmarks ()
    {
      const matText = new THREE.LineBasicMaterial( { color: 0xFF0000 } );

      for( let c=0; c < MAX_FACE_POINT; c++ )
      {
        scene.remove( landmarks[c] );

        if(landmarks[c])
          if(landmarks[c].geometry)
            landmarks[c].geometry.dispose();

        const shapes = font.generateShapes( c.toString(), fontScale );
        const geometry = new THREE.ShapeBufferGeometry( shapes );
        landmarks[c] = new THREE.Mesh( geometry, matText );
        geometry.computeBoundingBox();
        const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );
        landmarks[c].position.z = -2;

        scene.add( landmarks[c] );
      }
    }
    
    const loader = new THREE.FontLoader();
    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( _font ){
       font = _font;
       loadLandmarks();
      });
    
    // Animation
      var animate = function ()
    {
      requestAnimationFrame( animate );

      if(materials[activeMat].uniforms['u_time'])
        materials[activeMat].uniforms['u_time'].value = performance.now() / 1000;

      if(materials[activeMat].uniforms['u_face'] && needsDraw)
      {
        maskGeom.attributes.position.needsUpdate = true;
        let positions = maskGeom.attributes.position.array;
        positions[0] = face[152].x;
        positions[1] = face[152].y;
        positions[2] = 0;

        positions[3] = face[313].x;
        positions[4] = face[313].y;
        positions[5] = 0;

        positions[6] = face[83].x;
        positions[7] = face[83].y;
        positions[8] = 0;

        positions[9] = face[164].x;
        positions[10] = face[164].y;
        positions[11] = 0;

        positions[12] = face[37].x;
        positions[13] = face[37].y;
        positions[14] = 0;

        positions[15] = face[267].x;
        positions[16] = face[267].y;
        positions[17] = 0;

        maskGeom.computeVertexNormals();
        mask.visible = true;

        if(materials[activeMat].uniforms['u_debug'])
          if(materials[activeMat].uniforms['u_debug'].value)
          {
            if(!marks.visible)
            {
              for(let c=0; c < MAX_FACE_POINT; c++)
                scene.add(landmarks[c]);
              scene.add(marks);
              marks.visible = true;
            }

            for(let p=0; p < MAX_FACE_POINT; p++)
              if(landmarks[p])
                if(landmarks[p].position)
                {
                      landmarks[p].position.x = face[p].x;
                      landmarks[p].position.y = face[p].y;
                }
                
                console.log("QQ: " + fontScale);
                console.log("QQC: " + fontScaleCache);
                if(fontScale != fontScaleCache)
                {
                  loadLandmarks();
                  fontScaleCache = fontScale;
                }
          } else
          {
            if(marks.visible)
            {
              for(let p=0; p < MAX_FACE_POINT; p++)
                scene.remove(landmarks[p]);
              scene.remove(marks);
              marks.visible = false;
            }
          }
      } else
      {
        mask.visible = false;
        if(marks.visible)
        {
          for(let p=0; p < MAX_FACE_POINT; p++)
            scene.remove(landmarks[p]);
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
