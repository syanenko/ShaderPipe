import * as THREE    from 'three';
import { Camera    } from '@mediapipe/camera_utils/camera_utils';
import { handsProc } from './mediapipe';
import { faceProc }  from './mediapipe';
import { fingers }   from './mediapipe';
import { hands }     from './mediapipe';
import { face }      from './mediapipe';
import { activeMat } from './App';

//
// Camera
//
const videoElement = document.getElementsByClassName('input_video')[0];
const camera = new Camera(videoElement, {
    onFrame: async () => {

      if(materials[activeMat].uniforms['u_fingers_right'])
        await handsProc.send({image: videoElement});

      if(materials[activeMat].uniforms['u_face'])
        await faceProc.send({image: videoElement});
    }
  });
camera.start();

//
// Globals
//
var resolution = new THREE.Vector2(camera.b.width, camera.b.height);
var texture    = new THREE.VideoTexture( videoElement );

//
// Materials
//
var materials =
[
  // Fireball
  new THREE.ShaderMaterial(
  {
    uniforms: { u_time:          { value: 0.0 },
                u_texture:       { value: texture    },
                u_resolution:    { value: resolution },
                u_fingers_right: { value: fingers[0] },
                u_fingers_left:  { value: fingers[1] },
                u_hands:         { value: hands      },
                u_size:          { value: 1.7        },
                u_darkness:      { value: 10.0       },
                u_debug:         { value: 0          }},

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

export { resolution, materials };
