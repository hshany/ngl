/**
 * @file Vector Utils
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */


import { EPS } from "./math-constants.js";


/**
 * Converted to JavaScript from
 * {@link http://paulbourke.net/geometry/pointlineplane/lineline.c}
 *
 * @param  {THREE.Vector3} p1
 * @param  {THREE.Vector3} p2
 * @param  {THREE.Vector3} p3
 * @param  {THREE.Vector3} p4
 * @return {Array.<THREE.Vector3, THREE.Vector3>}
 */
function lineLineIntersect( p1, p2, p3, p4 ){

    var p13 = new THREE.Vector3(),
        p43 = new THREE.Vector3(),
        p21 = new THREE.Vector3();
    var d1343, d4321, d1321, d4343, d2121;
    var denom, numer;

    p13.x = p1.x - p3.x;
    p13.y = p1.y - p3.y;
    p13.z = p1.z - p3.z;
    p43.x = p4.x - p3.x;
    p43.y = p4.y - p3.y;
    p43.z = p4.z - p3.z;
    if( Math.abs(p43.x) < EPS && Math.abs(p43.y) < EPS && Math.abs(p43.z) < EPS )
        return null;

    p21.x = p2.x - p1.x;
    p21.y = p2.y - p1.y;
    p21.z = p2.z - p1.z;
    if( Math.abs(p21.x) < EPS && Math.abs(p21.y) < EPS && Math.abs(p21.z) < EPS )
        return null;

    d1343 = p13.x * p43.x + p13.y * p43.y + p13.z * p43.z;
    d4321 = p43.x * p21.x + p43.y * p21.y + p43.z * p21.z;
    d1321 = p13.x * p21.x + p13.y * p21.y + p13.z * p21.z;
    d4343 = p43.x * p43.x + p43.y * p43.y + p43.z * p43.z;
    d2121 = p21.x * p21.x + p21.y * p21.y + p21.z * p21.z;

    denom = d2121 * d4343 - d4321 * d4321;
    if( Math.abs(denom) < EPS )
        return null;
    numer = d1343 * d4321 - d1321 * d4343;

    var mua = numer / denom;
    var mub = ( d1343 + d4321 * mua ) / d4343;

    var pa = new THREE.Vector3(
        p1.x + mua * p21.x,
        p1.y + mua * p21.y,
        p1.z + mua * p21.z
    );
    var pb = new THREE.Vector3(
        p3.x + mub * p43.x,
        p3.y + mub * p43.y,
        p3.z + mub * p43.z
    );

    return [ pa, pb ];

}


function calculateMeanVector3( array ){

    var n = array.length;
    var m = array.length / 3;

    var x = 0;
    var y = 0;
    var z = 0;

    var i;

    for( i = 0; i < n; i += 3 ){

        x += array[ i + 0 ];
        y += array[ i + 1 ];
        z += array[ i + 2 ];

    }

    return new THREE.Vector3( x / m, y / m, z / m );

}


function isPointOnSegment( p, l1, l2 ){

    var len = l1.distanceTo( l2 );

    return p.distanceTo( l1 ) <= len && p.distanceTo( l2 ) <= len;

}


var pointVectorIntersection = function(){

    var v = new THREE.Vector3();
    var v1 = new THREE.Vector3();

    return function( point, origin, vector ){

        v.copy( vector );
        v1.subVectors( point, origin );
        var distOriginI = Math.cos( v.angleTo( v1 ) ) * v1.length();
        var vectorI = v.normalize().multiplyScalar( distOriginI );
        var pointI = new THREE.Vector3().addVectors( vectorI, origin );

        return pointI;

    };

}();


function v3cross( out, a, b ){
    var ax = a[0], ay = a[1], az = a[2];
    var bx = b[0], by = b[1], bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
}

function v3sub( out, a, b ){
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
}

function v3add( out, a, b ){
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
}

function v3fromArray( out, array, offset ){
    out[0] = array[offset];
    out[1] = array[offset+1];
    out[2] = array[offset+2];
}

function v3toArray( input, array, offset ){
    array[offset] = input[0];
    array[offset+1] = input[1];
    array[offset+2] = input[2];
}

function v3forEach( array, fn, b ){
    var a = new Float32Array( 3 );
    for( var i=0, n=array.length; i<n; i+=3 ){
        v3fromArray( a, array, i );
        fn( a, a, b );
        v3toArray( a, array, i );
    }
}
v3forEach.__deps = [ v3fromArray, v3toArray ];

function v3length( a ){
    return Math.sqrt( a[0]*a[0] + a[1]*a[1] + a[2]*a[2] );
}

function v3divide( out, a, b ){
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
}

function v3multiply( out, a, b ){
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
}

function v3divideScalar( out, a, s ){
    v3multiplyScalar( out, a, 1 / s );
}
v3divideScalar.__deps = [ v3multiplyScalar ];

function v3multiplyScalar( out, a, s ){
    out[0] = a[0] * s;
    out[1] = a[1] * s;
    out[2] = a[2] * s;
}

function v3normalize( out, a ){
    v3multiplyScalar( out, a, 1 / v3length( a ) );
}
v3normalize.__deps = [ v3multiplyScalar, v3length ];

function v3subScalar( out, a, s ){
    out[0] = a[0] - s;
    out[1] = a[1] - s;
    out[2] = a[2] - s;
}

function v3addScalar( out, a, s ){
    out[0] = a[0] + s;
    out[1] = a[1] + s;
    out[2] = a[2] + s;
}

function v3floor( out, a ){
    out[0] = Math.floor( a[0] );
    out[1] = Math.floor( a[1] );
    out[2] = Math.floor( a[2] );
}

function v3ceil( out, a ){
    out[0] = Math.ceil( a[0] );
    out[1] = Math.ceil( a[1] );
    out[2] = Math.ceil( a[2] );
}

function v3round( out, a ){
    out[0] = Math.round( a[0] );
    out[1] = Math.round( a[1] );
    out[2] = Math.round( a[2] );
}

function v3negate( out, a ){
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
}


export {
    lineLineIntersect,
    calculateMeanVector3,
    isPointOnSegment,
    pointVectorIntersection,

    v3cross,
    v3sub,
    v3add,
    v3fromArray,
    v3toArray,
    v3forEach,
    v3length,
    v3divide,
    v3multiply,
    v3divideScalar,
    v3multiplyScalar,
    v3normalize,
    v3subScalar,
    v3addScalar,
    v3floor,
    v3ceil,
    v3round,
    v3negate
};
