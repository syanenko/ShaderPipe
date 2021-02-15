import * as THREE from 'three';

// Mask prepare
const MAX_POINTS = 18;
const NUM_TRIANGLES = 6;
const positions = new Float32Array( MAX_POINTS * 3 );
var normals     = new Float32Array( NUM_TRIANGLES * 3 * 3 );
var colors      = new Float32Array( NUM_TRIANGLES * 3 * 3 );
// var uvs      = new Float32Array( NUM_TRIANGLES * 3 * 2 );
// uvs
/*
uvs[0] = 0;
uvs[1] = 1;
*/

var maskGeom = new THREE.BufferGeometry();
maskGeom.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
maskGeom.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
maskGeom.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
// maskGeom.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

const maskMat = new THREE.MeshPhongMaterial( { vertexColors: true, side: THREE.DoubleSide } );
var mask = new THREE.Mesh(maskGeom, maskMat);
mask.position.z = -1;

// Marks
const marksMat = new THREE.PointsMaterial( { color: 0x00FF00, size: 4.0 } );
var marks = new THREE.Points( maskGeom, marksMat );

// Masks
const masksData = [
   // Beard and mustache
   {
    points: [152, 313, 83,
             164, 37, 267],
    range: 7,
    colors: [ { r:1.0, g:0.0, b:0.0 },
              { r:0.0, g:1.0, b:0.0 },
              { r:0.0, g:0.0, b:1.0 }]
  },
  // Eyes
  {
    points: [101,  23, 110,
             330, 339, 253,
             444, 333, 443,
             224, 223, 104],
    range: 13,
    colors: [ { r:1.0, g:0.0, b:0.0 },
              { r:0.0, g:1.0, b:0.0 },
              { r:0.0, g:0.0, b:1.0 }]
  },
  // Daemon
  {
    points: [101, 110, 23,
            330, 339, 253,
            333, 444, 443,
            104, 224, 223,
            152, 313,  83,
            164,  37, 267],
    range: 19,
    colors: [ { r:0.0, g:0.0, b:0.0 },
              { r:0.0, g:1.0, b:0.0 },
              { r:0.0, g:0.0, b:1.0 }]
  }

];

export {mask, marks, masksData};
