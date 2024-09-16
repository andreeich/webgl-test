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
      // Set clear color to black, fully opaque
      this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
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
          attribute vec2 a_Position;
          attribute vec3 a_Color;
          varying vec3 v_Color;
          void main() {
              v_Color = a_Color;
              gl_Position = vec4(a_Position, 0.0, 1.0);
          }
      `;

    // Fragment shader source code
    const fsSource = `
          precision mediump float;
          varying vec3 v_Color;
          void main() {
              gl_FragColor = vec4(v_Color, 1.0);
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
      "a_Position"
    );
    this.attributes.color = this.gl.getAttribLocation(
      this.shaderProgram,
      "a_Color"
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
   * Initialize buffers for the triangle
   */
  initBuffers() {
    // Define vertices for the triangle
    // Format: x, y, r, g, b (position and color for each vertex)
    const triangleVertices = [
      -0.8,
      -0.5,
      1.0,
      0.0,
      0.0, // Left vertex (red)
      0.0,
      0.8,
      0.0,
      1.0,
      0.0, // Top vertex (green)
      0.8,
      -0.5,
      0.0,
      0.0,
      1.0, // Right vertex (blue)
    ];

    // Create a buffer for the triangle's vertices
    this.buffers.triangle = this.gl.createBuffer();

    // Bind the buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.triangle);

    // Pass the vertices data to the buffer
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(triangleVertices),
      this.gl.STATIC_DRAW
    );
  }

  /**
   * Draw the scene
   */
  draw() {
    // Clear the canvas
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Bind the vertex buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.triangle);

    // Set up the position attribute
    this.gl.vertexAttribPointer(
      this.attributes.position,
      2, // 2 components per vertex (x, y)
      this.gl.FLOAT, // Data type
      false, // Don't normalize
      5 * 4, // Stride (5 floats per vertex, 4 bytes each)
      0 // Offset
    );

    // Set up the color attribute
    this.gl.vertexAttribPointer(
      this.attributes.color,
      3, // 3 components per color (r, g, b)
      this.gl.FLOAT, // Data type
      false, // Don't normalize
      5 * 4, // Stride (5 floats per vertex, 4 bytes each)
      2 * 4 // Offset (2 floats for position, 4 bytes each)
    );

    // Enable the attributes
    this.gl.enableVertexAttribArray(this.attributes.position);
    this.gl.enableVertexAttribArray(this.attributes.color);

    // Draw the triangle
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }
}

// Usage
function start() {
  // Create a new WebGLApp instance
  const app = new WebGLApp("glcanvas");
  // Initialize the WebGL environment
  app.init();
  // Draw the scene
  app.draw();
}
