import React from 'react';
import * as THREE from 'three';
import { resolution, materials } from './materials';
import { face, MAX_FACE_POINT, needsDraw } from './mediapipe';
import { activeMat, activeMask, fontSize, threshold, drawMarks, matTransparency } from './App';
import { mask, masksData, marks } from './mask';

//
// Scene
//
var renderer;
var videoMesh;
var fontSizeCurrent = fontSize;

class Scene extends React.Component
{
  componentDidMount()
  {
    const scene    = new THREE.Scene();
    const camera   = new THREE.OrthographicCamera( 0, 1, 1, 0, 10, 0 );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(resolution.x, resolution.y);

    this.mount.appendChild(renderer.domElement);

    // Video
    const videoGeom = new THREE.PlaneBufferGeometry( 1, 1 );
    videoMesh = new THREE.Mesh(videoGeom, materials[activeMat]);
    videoMesh.position.z = 0.0;
    videoMesh.position.x = 0.5;
    videoMesh.position.y = 0.5;
    scene.add(videoMesh);

    // Mask
    scene.add(mask);
    scene.add(marks);

    // Light
    const light = new THREE.PointLight( 0xffffff, 1, 100 );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    // Landmarks
    var font, landmarks = [MAX_FACE_POINT];

    function loadLandmarks ()
    {
      const matText = new THREE.LineBasicMaterial( { color: 0xFF0000 } );
    
      for( let c=0; c < MAX_FACE_POINT; c++ )
      {
        scene.remove( landmarks[c] );
    
        if(landmarks[c])
          if(landmarks[c].geometry)
            landmarks[c].geometry.dispose();
    
        const shapes = font.generateShapes( c.toString(), fontSize );
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

    // Init mask colors
    for(let c=0; c<mask.geometry.attributes.color.array.length;)
    {
      mask.geometry.attributes.color.array[c++] = masksData[activeMask].colors[0].r;
      mask.geometry.attributes.color.array[c++] = masksData[activeMask].colors[0].g;
      mask.geometry.attributes.color.array[c++] = masksData[activeMask].colors[0].b;

      mask.geometry.attributes.color.array[c++] = masksData[activeMask].colors[1].r;
      mask.geometry.attributes.color.array[c++] = masksData[activeMask].colors[1].g;
      mask.geometry.attributes.color.array[c++] = masksData[activeMask].colors[1].b;

      mask.geometry.attributes.color.array[c++] = masksData[activeMask].colors[2].r;
      mask.geometry.attributes.color.array[c++] = masksData[activeMask].colors[2].g;
      mask.geometry.attributes.color.array[c++] = masksData[activeMask].colors[2].b;
    }

    // Animate
    var animate = function ()
    {
      requestAnimationFrame( animate );

      if(materials[activeMat].uniforms['u_time'])
         materials[activeMat].uniforms['u_time'].value = performance.now() / 1000;
 
      if(materials[activeMat].uniforms['u_face'] && needsDraw)
      {
        // Update flags
        mask.geometry.attributes.position.needsUpdate = true;
        mask.geometry.attributes.color.needsUpdate = true;        
        
        let positions = mask.geometry.attributes.position.array;
        let p = 0;
        let moveAverage = 0;
        masksData[activeMask].points.forEach(function(i) {
          moveAverage += Math.abs(positions[p++] - face[i].x)
          moveAverage += Math.abs(positions[p++] - face[i].y);
          p++;
        });
        moveAverage /= (masksData[activeMask].points.length * 2);
        
        if(moveAverage > threshold)
        {
          p = 0;
          masksData[activeMask].points.forEach(function(i){
                positions[p++] = face[i].x;
                positions[p++] = face[i].y;
                positions[p++] = 0;
            });
        }

        mask.geometry.computeVertexNormals();
        mask.visible = true;

        if(drawMarks)
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
                if( Math.abs(landmarks[p].position.x - face[p].x) > threshold)
                  landmarks[p].position.x = face[p].x;

                if( Math.abs(landmarks[p].position.y - face[p].y) > threshold)
                  landmarks[p].position.y = face[p].y;
              }
              
            if(fontSize !== fontSizeCurrent)
            {
              loadLandmarks();
              fontSizeCurrent = fontSize;
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
