import { Engine } from "@babylonjs/core/Engines/engine";
import { WebGPUEngine } from "@babylonjs/core/Engines/webgpuEngine";
import type { AbstractEngine } from "@babylonjs/core/Engines/abstractEngine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Quaternion, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { VertexData } from "@babylonjs/core/Meshes/mesh.vertexData";
import { ShaderMaterial } from "@babylonjs/core/Materials/shaderMaterial";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Material } from "@babylonjs/core/Materials/material";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import {
  hologramVertex,
  hologramFragment,
  particlesVertex,
  particlesFragment,
} from "./shaders";
import type { HologramController, HologramQuality } from "./schema";

export type HologramOptions = {
  signal: AbortSignal;
  motion: boolean;
  quality: HologramQuality;
  onReady: () => void;
  onFailure: () => void;
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

/** Owns the complete GPU lifecycle. The host only supplies a container and controls. */
export async function createHologram(
  host: HTMLElement,
  options: HologramOptions,
): Promise<HologramController> {
  let canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "width:100%;height:100%;display:block;outline:none;touch-action:pan-y";
  host.append(canvas);
  let engine: AbstractEngine | undefined;
  let scene: Scene | undefined;
  let disposed = false;
  let motion = options.motion;
  let quality = options.quality;
  let elapsed = 0;
  let time = 0;
  let pointerX = 0;
  let pointerY = 0;
  let slowFrames = 0;
  let autoScale = 1;
  let resizeObserver: ResizeObserver | undefined;
  let ready = false;
  let renderFrame: () => void = () => {};

  function dispose() {
    if (disposed) return;
    disposed = true;
    resizeObserver?.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    host.removeEventListener("pointermove", onPointer);
    host.removeEventListener("pointerleave", onPointerLeave);
    options.signal.removeEventListener("abort", dispose);
    engine?.stopRenderLoop();
    scene?.dispose();
    engine?.dispose();
    canvas.remove();
  }

  function onVisibility() {
    if (document.hidden) engine?.stopRenderLoop();
    else engine?.runRenderLoop(render);
  }
  function onPointer(event: PointerEvent) {
    if (!motion || event.pointerType === "touch") return;
    const bounds = host.getBoundingClientRect();
    pointerX =
      clamp((event.clientX - bounds.left) / bounds.width, 0, 1) * 2 - 1;
    pointerY =
      clamp((event.clientY - bounds.top) / bounds.height, 0, 1) * 2 - 1;
  }
  function onPointerLeave() {
    pointerX = 0;
    pointerY = 0;
  }

  try {
    if (options.signal.aborted)
      throw new DOMException("Cancelled", "AbortError");
    if (await WebGPUEngine.IsSupportedAsync) {
      const candidate = new WebGPUEngine(canvas, {
        antialias: true,
        adaptToDeviceRatio: false,
      });
      try {
        await candidate.initAsync(
          {
            jsPath: "/character-stats/vendor/glslang/glslang.js",
            wasmPath: "/character-stats/vendor/glslang/glslang.wasm",
          },
          {
            jsPath: "/character-stats/vendor/twgsl/twgsl.js",
            wasmPath: "/character-stats/vendor/twgsl/twgsl.wasm",
          },
        );
        engine = candidate;
      } catch {
        candidate.dispose();
        // A canvas cannot switch context types after WebGPU acquired it.
        const replacement = canvas.cloneNode() as HTMLCanvasElement;
        canvas.replaceWith(replacement);
        canvas = replacement;
      }
    }
    if (!engine)
      engine = new Engine(
        canvas,
        true,
        { alpha: true, stencil: true, preserveDrawingBuffer: false },
        false,
      );
    if (options.signal.aborted)
      throw new DOMException("Cancelled", "AbortError");
    options.signal.addEventListener("abort", dispose, { once: true });
    scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 0);
    scene.autoClear = true;
    scene.skipPointerMovePicking = true;
    const camera = new ArcRotateCamera(
      "projection-camera",
      -Math.PI / 2,
      1.3,
      7.7,
      new Vector3(0, -0.05, 0),
      scene,
    );
    camera.minZ = 0.1;
    camera.fov = 0.7;
    camera.inputs.clear();
    scene.activeCamera = camera;
    const root = new TransformNode("character-rig", scene);
    const cyan = new Color3(0.32, 1, 0.81);
    const lime = new Color3(0.76, 0.98, 0.47);

    const material = new ShaderMaterial(
      "hologram-surface",
      scene,
      { vertexSource: hologramVertex, fragmentSource: hologramFragment },
      {
        attributes: ["position", "normal"],
        uniforms: [
          "world",
          "worldViewProjection",
          "time",
          "reveal",
          "intensity",
          "tint",
          "cameraPosition",
        ],
        needAlphaBlending: true,
      },
    );
    material.setColor3("tint", cyan);
    material
      .setFloat("time", 0)
      .setFloat("reveal", 0)
      .setFloat("intensity", 0.76);
    material.setVector3("cameraPosition", camera.position);
    material.backFaceCulling = false;
    material.disableDepthWrite = true;
    material.alphaMode = Engine.ALPHA_COMBINE;
    material.transparencyMode = Material.MATERIAL_ALPHABLEND;
    const wireMaterial = material.clone("hologram-wireframe")!;
    wireMaterial.wireframe = true;
    wireMaterial.setFloat("intensity", 0.55);
    wireMaterial.setColor3("tint", new Color3(0.55, 1, 0.88));

    const bodyParts: Mesh[] = [];
    const head = MeshBuilder.CreateSphere(
      "head",
      { diameter: 0.49, segments: 12 },
      scene,
    );
    head.position.y = 1.04;
    head.scaling.y = 1.2;
    bodyParts.push(head);
    const neck = MeshBuilder.CreateCylinder(
      "neck",
      { height: 0.21, diameter: 0.2, tessellation: 8 },
      scene,
    );
    neck.position.y = 0.69;
    bodyParts.push(neck);
    const torso = MeshBuilder.CreateCylinder(
      "torso",
      {
        height: 0.86,
        diameterTop: 0.85,
        diameterBottom: 0.45,
        tessellation: 8,
        subdivisions: 5,
      },
      scene,
    );
    torso.position.y = 0.17;
    torso.scaling.z = 0.5;
    bodyParts.push(torso);
    const pelvis = MeshBuilder.CreateSphere(
      "pelvis",
      { diameter: 0.56, segments: 8 },
      scene,
    );
    pelvis.position.y = -0.43;
    pelvis.scaling.set(1, 0.65, 0.6);
    bodyParts.push(pelvis);
    function limb(
      name: string,
      start: Vector3,
      end: Vector3,
      top: number,
      bottom: number,
    ) {
      const direction = end.subtract(start);
      const part = MeshBuilder.CreateCylinder(
        name,
        {
          height: direction.length(),
          diameterTop: top,
          diameterBottom: bottom,
          tessellation: 8,
          subdivisions: 3,
        },
        scene,
      );
      part.position = start.add(end).scale(0.5);
      part.rotationQuaternion = Quaternion.FromUnitVectorsToRef(
        Vector3.Up(),
        direction.normalize(),
        new Quaternion(),
      );
      bodyParts.push(part);
    }
    for (const sign of [-1, 1]) {
      limb(
        "upper-arm",
        new Vector3(sign * 0.44, 0.55, 0),
        new Vector3(sign * 0.65, 0.04, 0.02),
        0.2,
        0.27,
      );
      limb(
        "forearm",
        new Vector3(sign * 0.65, 0.04, 0.02),
        new Vector3(sign * 0.73, -0.49, -0.03),
        0.12,
        0.2,
      );
      const hand = MeshBuilder.CreateSphere(
        "hand",
        { diameter: 0.17, segments: 6 },
        scene,
      );
      hand.position.set(sign * 0.73, -0.58, -0.03);
      hand.scaling.y = 1.4;
      bodyParts.push(hand);
      limb(
        "thigh",
        new Vector3(sign * 0.2, -0.52, 0),
        new Vector3(sign * 0.26, -1.03, 0.02),
        0.22,
        0.3,
      );
      limb(
        "shin",
        new Vector3(sign * 0.26, -1.03, 0.02),
        new Vector3(sign * 0.28, -1.51, 0),
        0.13,
        0.21,
      );
      const foot = MeshBuilder.CreateBox(
        "foot",
        { width: 0.17, height: 0.13, depth: 0.34 },
        scene,
      );
      foot.position.set(sign * 0.28, -1.58, -0.08);
      bodyParts.push(foot);
    }
    const body = Mesh.MergeMeshes(bodyParts, true, true)!;
    body.name = "projected-character";
    body.parent = root;
    body.material = material;
    const wire = body.clone("character-wireframe", root)!;
    wire.material = wireMaterial;
    wire.scaling.setAll(1.002);

    const lightMaterial = new StandardMaterial("emitter-material", scene);
    lightMaterial.disableLighting = true;
    lightMaterial.emissiveColor = cyan;
    const limeMaterial = new StandardMaterial("signal-material", scene);
    limeMaterial.disableLighting = true;
    limeMaterial.emissiveColor = lime;
    const rings: Mesh[] = [];
    for (let index = 0; index < 3; index++) {
      const ring = MeshBuilder.CreateTorus(
        `projector-ring-${index}`,
        {
          diameter: 2.05 + index * 0.5,
          thickness: index === 0 ? 0.013 : 0.009,
          tessellation: 96,
        },
        scene,
      );
      ring.position.y = -1.8 - index * 0.05;
      ring.material = index === 1 ? limeMaterial : lightMaterial;
      rings.push(ring);
    }
    const orbit = MeshBuilder.CreateTorus(
      "orbital-outline",
      { diameter: 4.05, thickness: 0.008, tessellation: 128 },
      scene,
    );
    orbit.rotation.x = Math.PI / 2;
    orbit.rotation.z = 0.3;
    orbit.position.y = -0.1;
    orbit.material = lightMaterial;
    const orbitBack = MeshBuilder.CreateTorus(
      "orbital-depth",
      { diameter: 3.85, thickness: 0.006, tessellation: 96 },
      scene,
    );
    orbitBack.rotation.x = 0.85;
    orbitBack.rotation.z = -0.65;
    orbitBack.material = limeMaterial;
    const sweep = MeshBuilder.CreateTorus(
      "scan-sweep",
      { diameter: 1.9, thickness: 0.013, tessellation: 64 },
      scene,
    );
    sweep.material = lightMaterial;

    const ticks: Vector3[][] = [];
    for (let index = 0; index < 64; index++) {
      const angle = (index * Math.PI * 2) / 64;
      const length = index % 4 === 0 ? 0.14 : 0.055;
      ticks.push([
        new Vector3(Math.cos(angle) * 1.68, -1.87, Math.sin(angle) * 1.68),
        new Vector3(
          Math.cos(angle) * (1.68 + length),
          -1.87,
          Math.sin(angle) * (1.68 + length),
        ),
      ]);
    }
    const tickMesh = MeshBuilder.CreateLineSystem(
      "projector-scale",
      { lines: ticks },
      scene,
    );
    tickMesh.color = cyan;
    tickMesh.alpha = 0.55;
    const floorLines: Vector3[][] = [];
    for (let index = -5; index <= 5; index++) {
      floorLines.push([
        new Vector3(index * 0.5, -1.95, -2.5),
        new Vector3(index * 0.5, -1.95, 2.5),
      ]);
      floorLines.push([
        new Vector3(-2.5, -1.95, index * 0.5),
        new Vector3(2.5, -1.95, index * 0.5),
      ]);
    }
    const grid = MeshBuilder.CreateLineSystem(
      "projection-grid",
      { lines: floorLines },
      scene,
    );
    grid.color = new Color3(0.07, 0.22, 0.17);
    grid.alpha = 0.085;

    // A single mesh animates all particles in its vertex shader, without per-frame JS allocations.
    const particleMesh = new Mesh("signal-particles", scene);
    const positions: number[] = [],
      normals: number[] = [],
      indices: number[] = [];
    for (let index = 0; index < 150; index++) {
      const seed = (Math.sin(index * 127.1 + 1) * 43758.5453) % 1;
      const fraction = Math.abs(seed);
      const size = index % 8 === 0 ? 0.022 : 0.01;
      positions.push(-size, -size, 0, size, -size, 0, 0, size * 2, 0);
      for (let corner = 0; corner < 3; corner++)
        normals.push(fraction, (index * 0.317) % 4.8, (index * 0.173) % 1);
      indices.push(index * 3, index * 3 + 1, index * 3 + 2);
    }
    const vertexData = new VertexData();
    vertexData.positions = positions;
    vertexData.normals = normals;
    vertexData.indices = indices;
    vertexData.applyToMesh(particleMesh);
    particleMesh.alwaysSelectAsActiveMesh = true;
    const particleMaterial = new ShaderMaterial(
      "particle-field",
      scene,
      { vertexSource: particlesVertex, fragmentSource: particlesFragment },
      {
        attributes: ["position", "normal"],
        uniforms: ["worldViewProjection", "time", "reveal"],
        needAlphaBlending: true,
      },
    );
    particleMaterial.backFaceCulling = false;
    particleMaterial.disableDepthWrite = true;
    particleMaterial.alphaMode = Engine.ALPHA_COMBINE;
    particleMaterial.setFloat("time", 0).setFloat("reveal", 0);
    particleMesh.material = particleMaterial;
    const glow = new GlowLayer("projection-bloom", scene, {
      mainTextureRatio: 0.35,
      blurKernelSize: 32,
    });
    glow.intensity = 0.5;
    for (const mesh of [...rings, orbit, orbitBack, sweep])
      glow.addIncludedOnlyMesh(mesh);

    function applyQuality() {
      if (!engine) return;
      const compact = host.clientWidth < 520;
      const pixelRatio =
        quality === "high"
          ? Math.min(window.devicePixelRatio, 2)
          : quality === "low"
            ? 0.8
            : Math.min(window.devicePixelRatio, compact ? 1.25 : 1.5) /
              autoScale;
      engine.setHardwareScalingLevel(1 / pixelRatio);
      glow.isEnabled = quality !== "low" && autoScale < 1.7;
      particleMesh.setEnabled(quality !== "low");
      engine.resize();
    }

    // Assign after scene setup, keeping the callback stable across pause/resume cycles.
    renderFrame = () => {
      if (disposed || !engine || !scene || document.hidden) return;
      const delta = Math.min(engine.getDeltaTime() / 1000, 0.05);
      if (motion) {
        elapsed += delta;
        time += delta;
      } else elapsed = 4;
      const projection = 1;
      const smoothing = 1 - Math.exp(-delta * 5);
      camera.alpha +=
        (-Math.PI / 2 + pointerX * 0.2 - camera.alpha) * smoothing;
      camera.beta += (1.3 + pointerY * 0.065 - camera.beta) * smoothing;
      camera.radius = 7.7;
      root.rotation.y = Math.sin(time * 0.28) * 0.18;
      root.position.y = Math.sin(time * 0.65) * 0.035;
      for (const shader of [material, wireMaterial]) {
        shader
          .setFloat("time", time)
          .setFloat("reveal", projection)
          .setVector3("cameraPosition", camera.position);
      }
      particleMaterial.setFloat("time", time).setFloat("reveal", projection);

      tickMesh.rotation.y = time * 0.04;
      orbit.rotation.y = Math.sin(time * 0.14) * 0.18;
      orbit.visibility = projection * 0.38;
      orbitBack.rotation.y = time * 0.075;
      orbitBack.visibility = projection * 0.18;
      sweep.position.y = -1.65 + ((time * 0.45) % 3.0);
      sweep.visibility = projection * (motion ? 0.34 : 0);
      if (quality === "auto" && elapsed > 3 && delta > 0.025) slowFrames++;
      else slowFrames = Math.max(0, slowFrames - 1);
      if (slowFrames > 90 && autoScale < 2) {
        autoScale = Math.min(2, autoScale + 0.25);
        slowFrames = 0;
        applyQuality();
      }
      scene.render();
      if (!motion) engine.stopRenderLoop(render);
    };

    applyQuality();
    resizeObserver = new ResizeObserver(() => {
      applyQuality();
      if (!motion && ready) engine?.runRenderLoop(render);
    });
    resizeObserver.observe(host);
    host.addEventListener("pointermove", onPointer);
    host.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);
    engine.onContextLostObservable.add(() => {
      engine?.stopRenderLoop();
      options.onFailure();
    });
    await Promise.all([
      material.forceCompilationAsync(body),
      wireMaterial.forceCompilationAsync(wire),
      particleMaterial.forceCompilationAsync(particleMesh),
    ]);
    await scene.whenReadyAsync();
    if (disposed || options.signal.aborted)
      throw new DOMException("Cancelled", "AbortError");
    ready = true;
    host.dataset.renderer = engine instanceof WebGPUEngine ? "webgpu" : "webgl";
    engine.runRenderLoop(render);
    options.onReady();
    return {
      dispose,
      setMotion(enabled) {
        motion = enabled;
        if (ready && !document.hidden) {
          // Static frames also need the engine's end-of-frame GPU submission.
          engine?.runRenderLoop(render);
        }
      },
      setQuality(value) {
        quality = value;
        autoScale = 1;
        slowFrames = 0;
        applyQuality();
        if (!motion) engine?.runRenderLoop(render);
      },
    };
  } catch (error) {
    dispose();
    throw error;
  }

  // Function declarations allow visibility listeners to share the same render callback.
  function render() {
    renderFrame();
  }
}
