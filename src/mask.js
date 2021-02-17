import * as THREE from 'three';

const DEFULT_MASK = 2;

const MAX_POINTS = 18;
const NUM_TRIANGLES = 6;
const NUM_UVS = NUM_TRIANGLES * 3 * 2;
const positions = new Float32Array( MAX_POINTS * 3 );
var normals     = new Float32Array( NUM_TRIANGLES * 3 * 3 );
var colors      = new Float32Array( NUM_TRIANGLES * 3 * 3 );
var uvs         = new Float32Array( NUM_UVS );

for(let t=0; t < NUM_UVS;)
{
  uvs[t++] = 0;
  uvs[t++] = 0;

  uvs[t++] = 0;
  uvs[t++] = 1;

  uvs[t++] = 1;
  uvs[t++] = 1;

  uvs[t++] = 0;
  uvs[t++] = 0;

  uvs[t++] = 1;
  uvs[t++] = 0;

  uvs[t++] = 1;
  uvs[t++] = 1;
}

var maskGeometry = new THREE.BufferGeometry();
maskGeometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
maskGeometry.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
maskGeometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
maskGeometry.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

const textureLoader = new THREE.TextureLoader();
var maskTextures = 
{
  Grid:  textureLoader.load( 'textures/uv_grid_opengl.png' ),
  Beard: textureLoader.load( 'textures/beard.png' )
}

var maskMaterials =
{
  Grid:  new THREE.MeshBasicMaterial( { vertexColors: true, side: THREE.DoubleSide, transparent: true, blending: THREE.NormalBlending, map: maskTextures.Grid  } ),
  Beard: new THREE.MeshBasicMaterial( { vertexColors: true, side: THREE.DoubleSide, transparent: true, blending: THREE.NormalBlending, map: maskTextures.Beard } ),
  Flat:  new THREE.MeshBasicMaterial( { vertexColors: true, side: THREE.DoubleSide, transparent: true, blending: THREE.MultiplyBlending} )
};

const masksData = [
/*
// 0 - Beard and mustache
  {
    points: [152, 313,  83,
            164,  37, 267],
    range: 7,
    colors: [ { r:0.0,   g:0.0,    b:1.0   },
              { r:0.110, g:0.6824, b:0.925 },
              { r:0.110, g:0.6824, b:0.925 }],
    geometry: maskMaterials[mat.flat],
    material: matGeomMask
 },
*/ 
// 0 - Beard
  {
    points: [148, 83,  313,
             148, 377, 313 ],
    range: 7,
    colors: [ { r:0.0,   g:0.0,    b:1.0   },
              { r:0.110, g:0.6824, b:0.925 },
              { r:0.110, g:0.6824, b:0.925 }],
    geometry: maskGeometry,
    material: maskMaterials.Beard
  },

 // 1 - Eyes
 {
  points: [101, 110,  23,
              330, 339, 253,
              333, 444, 443,
              104, 224, 223],
    range: 13,
    colors: [ { r:1.0, g:0.192, b:0.204   },
              { r:0.933, g:0.404, b:0.843 },
              { r:0.933, g:0.404, b:0.843 }],
    geometry: maskGeometry,
    material: maskMaterials.Flat
 },
 // 2 - Daemon
 {
    points: [101, 110,  23,
            330,  339, 253,
            333,  444, 443,
            104,  224, 223,
            152,  313,  83,
            164,   37, 267],
    range: 19,

    /* Black/Yellow/Green
    colors: [ { r:0.0, g:0.0, b:0.0 },
              { r:0.196, g:0.894, b:0.113 },
              { r:0.713, g:0.819, b:0.250 }],
    */

    colors: [ { r:0.0, g:1.0, b:0.0 },
              { r:1.0, g:1.0, b:1.0 },
              { r:1.0, g:1.0, b:1.0 }],
    geometry: maskGeometry,
    material: maskMaterials.Flat
 }
];

var mask = new THREE.Mesh( masksData[DEFULT_MASK].geometry,
                           masksData[DEFULT_MASK].material );
mask.position.z = -1;

const marksMat = new THREE.PointsMaterial( { color: 0x00FF00, size: 4.0 } );
var marks = new THREE.Points( masksData[DEFULT_MASK].maskGeometry, marksMat );

export {mask, marks, masksData, maskMaterials};
