/**
 * WebGLApp class
 * This class encapsulates the WebGL application, handling initialization,
 * shader compilation, buffer creation, and rendering.
 */
class WebGLApp {
  /**
   * Constructor for WebGLApp
   * @param {string} canvasId - The ID of the canvas element to use
   */
  constructor(canvasId) {
    // Get the canvas element
    this.canvas = document.getElementById(canvasId);
    // Initialize WebGL context
    this.gl = this.initWebGL(this.canvas);
    // Will hold the compiled and linked shader program
    this.shaderProgram = null;
    // Object to store WebGL buffers
    this.buffers = {};
    // Object to store attribute locations
    this.attributes = {};
    // Object matrix for transformations
    this.matrix = mat4.create();
  }

  /**
   * Initialize WebGL context
   * @param {HTMLCanvasElement} canvas - The canvas element
   * @returns {WebGLRenderingContext|null} The WebGL context or null if initialization fails
   */
  initWebGL(canvas) {
    let gl = null;
    try {
      // Try to get the WebGL context
      gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) {
      console.error(
        "Unable to initialize WebGL. Your browser may not support it."
      );
    }
    return gl;
  }

  /**
   * Initialize the WebGL environment
   */
  init() {
    if (this.gl) {
      // Set clear color to white, fully opaque
      this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
      // Enable depth testing
      this.gl.enable(this.gl.DEPTH_TEST);
      // Near things obscure far things
      this.gl.depthFunc(this.gl.LEQUAL);
      // Set the viewport to match the canvas size
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      // Initialize shaders
      this.initShaders();
      // Initialize buffers
      this.initBuffers();
    }
  }

  /**
   * Initialize and compile shaders
   */
  initShaders() {
    // Vertex shader source code
    const vsSource = `
          attribute vec3 position;
          attribute vec3 color;
          varying vec3 vColor;
          uniform mat4 matrix;

          void main() {
              vColor = color;
              gl_Position = matrix * vec4(position, 1.0);
          }
      `;

    // Fragment shader source code
    const fsSource = `
          precision mediump float;
          varying vec3 vColor;

          void main() {
              gl_FragColor = vec4(vColor, 1.0);
          }
      `;

    // Compile vertex and fragment shaders
    const vertexShader = this.compileShader(vsSource, this.gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(
      fsSource,
      this.gl.FRAGMENT_SHADER
    );

    // Create the shader program
    this.shaderProgram = this.gl.createProgram();
    // Attach the vertex shader
    this.gl.attachShader(this.shaderProgram, vertexShader);
    // Attach the fragment shader
    this.gl.attachShader(this.shaderProgram, fragmentShader);
    // Link the program
    this.gl.linkProgram(this.shaderProgram);

    // Check if linking was successful
    if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
      console.error("Unable to initialize the shader program.");
      return;
    }

    // Use the program
    this.gl.useProgram(this.shaderProgram);

    // Get attribute locations
    this.attributes.position = this.gl.getAttribLocation(
      this.shaderProgram,
      "position"
    );
    this.attributes.color = this.gl.getAttribLocation(
      this.shaderProgram,
      "color"
    );
    this.attributes.matrix = this.gl.getUniformLocation(
      this.shaderProgram,
      "matrix"
    );
  }

  /**
   * Compile a shader
   * @param {string} source - The shader source code
   * @param {number} type - The type of shader (VERTEX_SHADER or FRAGMENT_SHADER)
   * @returns {WebGLShader|null} The compiled shader or null if compilation fails
   */
  compileShader(source, type) {
    // Create a shader object
    const shader = this.gl.createShader(type);
    // Set the shader source code
    this.gl.shaderSource(shader, source);
    // Compile the shader
    this.gl.compileShader(shader);

    // Check if compilation was successful
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

  /**
   * Initialize buffers for the cube
   */
  initBuffers() {
    // Define vertices position for the cube
    // Format: x, y, z (position for each vertex)
    const vertexData = [
      // Front face
      -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
      // Back face
      -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
      // Top face
      -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
      // Bottom face
      -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
      // Right face
      1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
      // Left face
      -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ];

    // Define vertices color for the cube
    // Format: r, g, b (color for each vertex)
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
      colors = colors.concat(c, c, c, c);
    }

    // Create a buffer for the triangle's vertices position
    this.buffers.position = this.gl.createBuffer();
    this.buffers.color = this.gl.createBuffer();

    // Bind the buffer for the triangle's vertices position
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);

    // Pass the vertices data to the position buffer
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertexData),
      this.gl.STATIC_DRAW
    );

    // Bind the buffer for the triangle's vertices color
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);

    // Pass the vertices data to the color buffer
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(colors.flat()),
      this.gl.STATIC_DRAW
    );

    // Define the indices of the cube (which vertices to use for each triangle)
    const indexData = [
      // Front face
      0, 1, 2, 0, 2, 3,
      // Back face
      4, 5, 6, 4, 6, 7,
      // Top face
      8, 9, 10, 8, 10, 11,
      // Bottom face
      12, 13, 14, 12, 14, 15,
      // Right face
      16, 17, 18, 16, 18, 19,
      // Left face
      20, 21, 22, 20, 22, 23,
    ];

    this.buffers.indices = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indexData),
      this.gl.STATIC_DRAW
    );
  }

  /**
   * Draw the scene
   */
  draw() {
    // Clear the canvas
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Bind the vertex position buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);

    // Set up the position attribute
    this.gl.vertexAttribPointer(
      this.attributes.position,
      3, // 3 components per vertex (x, y, z)
      this.gl.FLOAT, // Data type
      false, // Don't normalize
      0, // Stride
      0 // Offset
    );

    // Bind the vertex color buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);

    // Set up the color attribute
    this.gl.vertexAttribPointer(
      this.attributes.color,
      3, // 3 components per color (r, g, b)
      this.gl.FLOAT, // Data type
      false, // Don't normalize
      0, // Stride
      0 // Offset
    );

    // Enable the attributes
    this.gl.enableVertexAttribArray(this.attributes.position);
    this.gl.enableVertexAttribArray(this.attributes.color);

    mat4.scale(this.matrix, this.matrix, [0.5, 0.5, 0.5]);

    this.gl.uniformMatrix4fv(this.attributes.matrix, false, this.matrix);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

    // Draw the cube using element indices
    this.gl.drawElements(this.gl.TRIANGLES, 36, this.gl.UNSIGNED_SHORT, 0);
  }

  /**
   * Animate the cube
   */
  animate = () => {
    requestAnimationFrame(this.animate);
    mat4.rotateZ(this.matrix, this.matrix, Math.PI / 100);
    mat4.rotateX(this.matrix, this.matrix, Math.PI / 100);
    mat4.rotateY(this.matrix, this.matrix, Math.PI / 100);
    this.gl.uniformMatrix4fv(this.attributes.matrix, false, this.matrix);
    this.gl.drawElements(this.gl.TRIANGLES, 36, this.gl.UNSIGNED_SHORT, 0);
  };
}

// Usage
function start() {
  // Create a new WebGLApp instance
  const app = new WebGLApp("glcanvas");
  // Initialize the WebGL environment
  app.init();
  // Draw the scene
  app.draw();
  // Animate the cube
  app.animate();
}
