import * as THREE from 'three';

import { Camera    } from '@mediapipe/camera_utils/camera_utils';
import { Hands     } from '@mediapipe/hands/hands';
import { FaceMesh  } from '@mediapipe/face_mesh/face_mesh';
import { activeMat } from './App';

//
// Hands
//
const handsProc = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
}});

handsProc.setOptions({
  maxNumHands: 2,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

const MAX_HAND_POINT = 21;
var fingers = [ new Array(MAX_HAND_POINT), new Array(MAX_HAND_POINT)];
for(let i=0; i<MAX_HAND_POINT; i++)
{
  fingers[0][i] = new THREE.Vector2();
  fingers[1][i] = new THREE.Vector2();
}

var hands = [ new THREE.Vector2(), new THREE.Vector2()];

// Hands results
function onHandsResults(results)
{
  for (let f = 0; f < fingers[0].length; f++)
    fingers[0][f].x = fingers[0][f].y = 
    fingers[1][f].x = fingers[1][f].y = 0;
    
  hands[0].x = hands[0].y = hands[1].x = hands[1].y = 0;
  
  try
  {
    if (results.multiHandLandmarks && results.multiHandedness)
    {
      for (let h = 0; h < results.multiHandLandmarks.length; h++)
      {
          if( !results.multiHandLandmarks[h] )
            continue;
          for (let f = 0; f < results.multiHandLandmarks[h].length; f++)
          {
            if(!results.multiHandLandmarks[h][f])
              continue;
            
            fingers[h][f].x = results.multiHandLandmarks[h][f].x;
            fingers[h][f].y = 1 - results.multiHandLandmarks[h][f].y;

            hands[h].x += fingers[h][f].x;
            hands[h].y += fingers[h][f].y;
          }
      }

      hands[0].x /= MAX_HAND_POINT;
      hands[0].y /= MAX_HAND_POINT;
      hands[1].x /= MAX_HAND_POINT;
      hands[1].y /= MAX_HAND_POINT;
    }
  
  } catch(e)
  {
      console.error(e); 
  }
}

handsProc.onResults(onHandsResults);

//
// Face
//
const faceMesh = new FaceMesh({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
}});

faceMesh.setOptions({
  maxNumFaces: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

const MAX_FACE_POINT = 468;
var face = [];
for(let i=0; i<MAX_FACE_POINT; i++)
{
  face[i] = new THREE.Vector2();
}

// Face results
function onFaceMeshResults(results)
{
  if (results.multiFaceLandmarks)
  {
    for (const landmarks of results.multiFaceLandmarks)
    {
      for (let i=0; i<MAX_FACE_POINT; i++ )
      {
          face[i].x = landmarks[i].x;
          face[i].y = 1 - landmarks[i].y;
      }
    }
  }
}

faceMesh.onResults(onFaceMeshResults);

//
// Globals
//
const videoElement = document.getElementsByClassName('input_video')[0];
var texture = new THREE.VideoTexture( videoElement );
var resolution = new THREE.Vector2(0, 0);
//
// Materials
//
var materials =
[
  // Fireball
  new THREE.ShaderMaterial(
  {
    uniforms: { u_time:          { value: 1.0 },
                u_texture:       { value: texture    },
                u_resolution:    { value: resolution },
                u_fingers_right: { value: fingers[0] },
                u_fingers_left:  { value: fingers[1] },
                u_hands:         { value: hands      },
                u_size:          { value: 1.7,  control: "SizeSlider"    },
                u_darkness:      { value: 10.0, control: "DarknesSlider" },
                u_debug:         { value: 0,    control: "ToggleMarks"   },
                info:            {value: "Hands: Fireball"}},

    vertexShader: document.getElementById( 'vertexDefault' ).textContent,
    fragmentShader: document.getElementById( 'fragmentFireball' ).textContent
  } ),

  // Whirlpool
  new THREE.ShaderMaterial(
  {
    uniforms: { u_time:          { value: 1.0        },
                u_texture:       { value: texture    },
                u_resolution:    { value: resolution }},

    vertexShader: document.getElementById( 'vertexDefault' ).textContent,
    fragmentShader: document.getElementById( 'fragmentWhirlpool' ).textContent
  } ),
  
  // Toon
  new THREE.ShaderMaterial(
  {
    uniforms: { u_texture:    { value: texture },
                u_hue_levels: { value: [0.0, 34.0, 69.0, 206.0, 284.0, 360.0] },
                u_sat_levels: { value: [0.0, 0.3, 0.6, 1.0] },
                u_val_levels: { value: [0.0, 0.3, 0.6, 1.0] }},
    vertexShader:   document.getElementById( 'vertexDefault' ).textContent,
    fragmentShader: document.getElementById( 'fragmentToon'  ).textContent
  } ),

  // Posterize
  new THREE.ShaderMaterial(
  {
    uniforms: { u_texture:    { value: texture },
                u_gamma:      { value: 6.0     },
                u_num_colors: { value: 2.0    }},
    
    vertexShader:   document.getElementById( 'vertexDefault'     ).textContent,
    fragmentShader: document.getElementById( 'fragmentPosterize' ).textContent
  } ),
  
    // Crosshatch
  new THREE.ShaderMaterial(
  {
    uniforms: { u_texture: { value: texture }},
    vertexShader:   document.getElementById( 'vertexDefault'      ).textContent,
    fragmentShader: document.getElementById( 'fragmentCrosshatch' ).textContent
  } ),
  
  // Gobelin
  new THREE.ShaderMaterial(
  {
    uniforms: { u_texture: { value: texture },
                u_size:    { value: 6.0     },
                u_invert:  { value: 0       },
                u_dim:     { value: 600.0   }},
    vertexShader:   document.getElementById( 'vertexDefault'   ).textContent,
    fragmentShader: document.getElementById( 'fragmentGobelin' ).textContent
  } ),

  // Pixelization
  new THREE.ShaderMaterial(
  {
    uniforms: { u_texture: { value: texture },
                u_size_x:  { value: 400.0   },
                u_size_y:  { value: 200.0   }},
    vertexShader:   document.getElementById( 'vertexDefault' ).textContent,
    fragmentShader: document.getElementById( 'fragmentPix'   ).textContent
  } ),
  
  // Honeycombs
  new THREE.ShaderMaterial(
  {
    uniforms: { u_texture: { value: texture },
                u_size:    { value: 0.01    }},
    vertexShader:   document.getElementById( 'vertexDefault'     ).textContent,
    fragmentShader: document.getElementById( 'fragmentHoneycombs' ).textContent
  } ),
  
  // Line
  new THREE.ShaderMaterial(
  {
    uniforms: { u_texture: { value: texture },
                u_limit:   { value: 0.5     }},
    vertexShader:   document.getElementById( 'vertexDefault' ).textContent,
    fragmentShader: document.getElementById( 'fragmentLine'  ).textContent
  } ),

  // Sobel
  new THREE.ShaderMaterial(
  {
    uniforms: { u_texture: { value: texture },
                u_dX:      { value: 0.002   },
                u_dY:      { value: 0.002   }},
    vertexShader:   document.getElementById( 'vertexDefault' ).textContent,
    fragmentShader: document.getElementById( 'fragmentSobel' ).textContent
  } ),
  
  // Mask
  new THREE.ShaderMaterial(
  {
    uniforms: { u_time:          { value: 1.0 },
                u_texture:       { value: texture    },
                u_resolution:    { value: resolution },
                u_face:          { value: face       },
                u_debug:         { value: 1          }},

    vertexShader: document.getElementById( 'vertexDefault' ).textContent,
    fragmentShader: document.getElementById( 'fragmentMask' ).textContent
  } ),
];

// Camera
const camera = new Camera(videoElement, {
    onFrame: async () => {

      if(materials[activeMat].uniforms['u_fingers_right'])
        await handsProc.send({image: videoElement});

      if(materials[activeMat].uniforms['u_face'])
        await faceMesh.send({image: videoElement});
    }
  });
camera.start();

resolution = new THREE.Vector2(camera.b.width, camera.b.height);

export { resolution, materials, fingers };
