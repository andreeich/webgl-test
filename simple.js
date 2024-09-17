// import "./gl-matrix-min.js";
// const { mat2, mat2d, mat4, mat3, quat, quat2, vec2, vec3, vec4 } = glMatrix;

const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  throw new Error("WebGL is not supported");
}

const vertexData = [
  // Front face
  1, 1, 1, 1, -1, 1, -1, 1, 1, -1, 1, 1, 1, -1, 1, -1, -1, 1,
  // Back face
  1, 1, -1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, -1, -1, -1,
  // Top face
  1, 1, 1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, -1, 1, -1,
  // Bottom face
  1, -1, 1, 1, -1, -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, -1,
  // Right face
  1, 1, 1, 1, 1, -1, 1, -1, 1, 1, -1, 1, 1, 1, -1, 1, -1, -1,
  // Left face
  -1, 1, 1, -1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, -1, -1,
];

const colorData = [
  [1.0, 0.0, 0.0], // Front face (red)
  [0.0, 1.0, 0.0], // Back face (green)
  [0.0, 0.0, 1.0], // Top face (blue)
  [1.0, 1.0, 0.0], // Bottom face (yellow)
  [1.0, 0.0, 1.0], // Right face (magenta)
  [0.0, 1.0, 1.0], // Left face (cyan)
];

let colors = [];

for (let i = 0; i < 6; i++) {
  const c = colorData[i];
  // Each face consists of 2 triangles, and each triangle has 3 vertices
  colors = colors.concat(c, c, c, c, c, c);
}

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors.flat()), gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(
  vertexShader,
  `
  attribute vec3 position;
  attribute vec3 color;
  varying vec3 vColor;
  uniform mat4 matrix;

  void main() {
    vColor = color;
    gl_Position = matrix * vec4(position, 1);
  }
  `
);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(
  fragmentShader,
  `
  precision mediump float;
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor,1);
  }
  `
);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, "color");
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const uniformLocations = {
  matrix: gl.getUniformLocation(program, "matrix"),
};

const matrix = mat4.create();
mat4.scale(matrix, matrix, [0.5, 0.5, 0.5]);

function animate() {
  requestAnimationFrame(animate);
  mat4.rotateZ(matrix, matrix, Math.PI / 100);
  mat4.rotateX(matrix, matrix, Math.PI / 100);
  mat4.rotateY(matrix, matrix, Math.PI / 100);
  gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
  gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
}

gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);

gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);

animate();
