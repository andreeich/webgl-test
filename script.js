class WebGLApp {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.gl = this.initWebGL(this.canvas);
    this.shaderProgram = null;
    this.buffers = {};
    this.attributes = {};
  }

  initWebGL(canvas) {
    let gl = null;
    try {
      gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) {
      console.error(
        "Unable to initialize WebGL. Your browser may not support it."
      );
    }
    return gl;
  }

  init() {
    if (this.gl) {
      this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.depthFunc(this.gl.LEQUAL);
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

      this.initShaders();
      this.initBuffers();
    }
  }

  initShaders() {
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

    const vertexShader = this.compileShader(vsSource, this.gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(
      fsSource,
      this.gl.FRAGMENT_SHADER
    );

    this.shaderProgram = this.gl.createProgram();
    this.gl.attachShader(this.shaderProgram, vertexShader);
    this.gl.attachShader(this.shaderProgram, fragmentShader);
    this.gl.linkProgram(this.shaderProgram);

    if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
      console.error("Unable to initialize the shader program.");
      return;
    }

    this.gl.useProgram(this.shaderProgram);

    this.attributes.position = this.gl.getAttribLocation(
      this.shaderProgram,
      "a_Position"
    );
    this.attributes.color = this.gl.getAttribLocation(
      this.shaderProgram,
      "a_Color"
    );
  }

  compileShader(source, type) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(
        `An error occurred compiling the shaders: ${this.gl.getShaderInfoLog(
          shader
        )}`
      );
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  initBuffers() {
    const triangleVertices = [
      -0.8, -0.5, 1.0, 0.0, 0.0, 0.0, 0.8, 0.0, 1.0, 0.0, 0.8, -0.5, 0.0, 0.0,
      1.0,
    ];

    this.buffers.triangle = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.triangle);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(triangleVertices),
      this.gl.STATIC_DRAW
    );
  }

  draw() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.triangle);

    this.gl.vertexAttribPointer(
      this.attributes.position,
      2,
      this.gl.FLOAT,
      false,
      5 * 4,
      0
    );
    this.gl.vertexAttribPointer(
      this.attributes.color,
      3,
      this.gl.FLOAT,
      false,
      5 * 4,
      2 * 4
    );

    this.gl.enableVertexAttribArray(this.attributes.position);
    this.gl.enableVertexAttribArray(this.attributes.color);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }
}

// Usage
function start() {
  const app = new WebGLApp("glcanvas");
  app.init();
  app.draw();
}
