let gl;
let shaderProgram;

const vsSource = `
    attribute vec2 a_Position;
    attribute vec3 a_Color;
    varying vec3 v_Color;
    void main() {
        v_Color = a_Color;
        gl_Position = vec4(a_Position, 0.0, 1.0);
    }
`;

const fsSource = `
    precision mediump float;
    varying vec3 v_Color;
    void main() {
        gl_FragColor = vec4(v_Color, 1.0);
    }
`;

function start() {
  const canvas = document.getElementById("glcanvas");
  gl = initWebGL(canvas);
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
    initShaders();
    initBuffer();
  }
}

function initWebGL(canvas) {
  gl = null;
  try {
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  } catch (e) {
    if (!gl) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
    }
    gl = null;
  }
  return gl;
}

function initShaders() {
  const fragmentShader = getShader(gl, "shader-fs", fsSource);
  const vertexShader = getShader(gl, "shader-vs", vsSource);
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }
  gl.useProgram(shaderProgram);
}

function getShader(gl, id, source) {
  let shader;
  if (id === "shader-fs") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (id === "shader-vs") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    );
    return null;
  }
  return shader;
}

function initBuffer() {
  const a_Position = gl.getAttribLocation(shaderProgram, "a_Position");
  const a_Color = gl.getAttribLocation(shaderProgram, "a_Color");
  gl.enableVertexAttribArray(a_Position);
  gl.enableVertexAttribArray(a_Color);
  const triangle_vertex = [
    -0.8, -0.5, 1.0, 0.0, 0.0, 0.0, 0.8, 0.0, 1.0, 0.0, 0.8, -0.5, 0.0, 0.0,
    1.0,
  ];
  const TRIANGLE_VERTEX = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, TRIANGLE_VERTEX);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(triangle_vertex),
    gl.STATIC_DRAW
  );
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 5 * 4, 0);
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 5 * 4, 2 * 4);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}
