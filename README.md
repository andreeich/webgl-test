# WebGL Mini-Wiki

This document serves as a quick reference guide for common WebGL concepts, functions, and variables. It's designed to help developers understand the fundamental building blocks of WebGL applications.

## Core Concepts

### WebGL Context

The WebGL context is the core object that provides access to WebGL functionality. It's typically obtained from a canvas element.

**Key Function:**

- `canvas.getContext('webgl')` or `canvas.getContext('experimental-webgl')`: Returns a WebGL rendering context.

### Shaders

Shaders are programs written in GLSL (OpenGL Shading Language) that run on the GPU. There are two types of shaders in WebGL:

1. **Vertex Shader**: Processes vertex data (position, color, etc.).
2. **Fragment Shader**: Determines the color of each pixel.

**Key Functions:**

- `gl.createShader(type)`: Creates a shader (vertex or fragment).
- `gl.shaderSource(shader, source)`: Specifies the source code for a shader.
- `gl.compileShader(shader)`: Compiles a shader.

### Shader Program

A shader program links together a vertex shader and a fragment shader.

**Key Functions:**

- `gl.createProgram()`: Creates a program.
- `gl.attachShader(program, shader)`: Attaches a shader to a program.
- `gl.linkProgram(program)`: Links a program.
- `gl.useProgram(program)`: Sets the specified program as part of the current rendering state.

### Buffers

Buffers store vertex data on the GPU.

**Key Functions:**

- `gl.createBuffer()`: Creates a buffer.
- `gl.bindBuffer(target, buffer)`: Binds a buffer to a target.
- `gl.bufferData(target, data, usage)`: Initializes and creates the buffer's data store.

### Attributes and Uniforms

Attributes and uniforms are variables used to pass data from JavaScript to shaders.

- **Attributes**: Per-vertex data (e.g., position, color).
- **Uniforms**: Global variables (e.g., transformation matrices).

**Key Functions:**

- `gl.getAttribLocation(program, name)`: Returns the location of an attribute variable.
- `gl.getUniformLocation(program, name)`: Returns the location of a uniform variable.
- `gl.vertexAttribPointer(index, size, type, normalized, stride, offset)`: Specifies the layout of vertex attribute data.
- `gl.enableVertexAttribArray(index)`: Enables a vertex attribute array.

### Drawing

Drawing commands tell WebGL to render primitives (points, lines, triangles) using the current shader program and buffer data.

**Key Functions:**

- `gl.drawArrays(mode, first, count)`: Renders primitives from array data.
- `gl.drawElements(mode, count, type, offset)`: Renders primitives from element array data.

## Common Variables

- `gl`: The WebGL rendering context.
- `canvas`: The HTML canvas element.
- `program`: The linked shader program.
- `buffer`: A WebGL buffer object.
- `attribute`: A shader attribute variable.
- `uniform`: A shader uniform variable.
- `vertexShader`: A vertex shader.
- `fragmentShader`: A fragment shader.

## WebGL State Management

WebGL is a state machine. Many functions set or modify the current state.

**Key Functions:**

- `gl.enable(cap)` / `gl.disable(cap)`: Enables/disables server-side GL capabilities.
- `gl.blendFunc(sfactor, dfactor)`: Specifies pixel arithmetic for blending.
- `gl.depthFunc(func)`: Specifies the depth comparison function.
- `gl.cullFace(mode)`: Specifies which polygon faces to cull.

## Viewport and Clearing

**Key Functions:**

- `gl.viewport(x, y, width, height)`: Sets the viewport.
- `gl.clear(mask)`: Clears buffers to preset values.
- `gl.clearColor(red, green, blue, alpha)`: Specifies clear values for the color buffer.

## Error Handling

**Key Function:**

- `gl.getError()`: Returns error information.

This mini-wiki provides a high-level overview of key WebGL concepts, functions, and variables. For more detailed information, refer to the [WebGL specification](https://www.khronos.org/registry/webgl/specs/latest/1.0/) and [MDN WebGL API](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) documentation.
