"use client";
import * as pc from "playcanvas";
import { useRef, useEffect } from "react";

export default function Home() {
  const canvasRef = useRef();

  useEffect(() => {
    async function main() {
      document.addEventListener("gesturestart", function (e) {
        e.preventDefault();
        document.body.style.zoom = 1;
      });

      document.addEventListener("gesturechange", function (e) {
        e.preventDefault();

        document.body.style.zoom = 1;
      });
      document.addEventListener("gestureend", function (e) {
        e.preventDefault();
        document.body.style.zoom = 1;
      });

      addEventListener("click", function () {
        var el = document.documentElement,
          rfs =
            el.requestFullscreen ||
            el.webkitRequestFullScreen ||
            el.mozRequestFullScreen ||
            el.msRequestFullscreen;
        rfs.call(el);
      });

      const canvas = canvasRef.current;

      const assets = {
        font: new pc.Asset("font", "font", {
          url: "/Roboto-Regular.json",
        }),
        navigateButton: new pc.Asset("buttonImage", "texture", {
          url: "Navigate-Button.png",
        }),
        navigateButtonHover: new pc.Asset("buttonImage", "texture", {
          url: "Navigate-Button-Hover.png",
        }),
      };

      const device = await pc.createGraphicsDevice(canvas);
      device.maxPixelRatio = 10;

      const createOptions = new pc.AppOptions();
      createOptions.graphicsDevice = device;
      createOptions.mouse = new pc.Mouse(document.body);
      createOptions.touch = new pc.TouchDevice(document.body);
      createOptions.elementInput = new pc.ElementInput(canvas);

      createOptions.componentSystems = [
        pc.RenderComponentSystem,
        pc.CameraComponentSystem,
        pc.ScreenComponentSystem,
        pc.ButtonComponentSystem,
        pc.ElementComponentSystem,
      ];
      createOptions.resourceHandlers = [pc.TextureHandler, pc.FontHandler];

      const app = new pc.AppBase(canvas);
      onresize = function () {
        app.resizeCanvas(canvas.width, canvas.height);
      };
      app.init(createOptions);

      // Set the canvas to fill the window and automatically change resolution to be the same as the canvas size
      app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
      app.setCanvasResolution(pc.RESOLUTION_AUTO);

      // Ensure canvas is resized when window changes size
      const resize = () => app.resizeCanvas();
      window.addEventListener("resize", resize);
      app.on("destroy", () => {
        window.removeEventListener("resize", resize);
      });

      const assetListLoader = new pc.AssetListLoader(
        Object.values(assets),
        app.assets
      );
      assetListLoader.load(() => {
        app.start();

        // Create a camera
        const camera = new pc.Entity();
        camera.addComponent("camera", {
          clearColor: new pc.Color(30 / 255, 30 / 255, 30 / 255),
        });
        app.root.addChild(camera);

        // Create a 2D screen
        const screen = new pc.Entity();
        screen.addComponent("screen", {
          referenceResolution: new pc.Vec2(1280, 720),
          scaleBlend: 0.5,
          scaleMode: pc.SCALEMODE_BLEND,
          screenSpace: true,
        });
        app.root.addChild(screen);

        const container = new pc.Entity();
        container.addComponent("element", {
          anchor: [1, 0, 1, 0],
          height: 67 + 60,
          pivot: [1, 0],
          width: 208 + 60,
        });

        screen.addChild(container);

        // Button
        const button = new pc.Entity();
        button.addComponent("button");
        button.addComponent("element", {
          anchor: [0.5, 0.5, 0.5, 0.5],
          height: 67,
          pivot: [0.5, 0.5],
          type: pc.ELEMENTTYPE_IMAGE,
          width: 208,
          useInput: true,
          textureAsset: assets.navigateButton,
        });
        container.addChild(button);

        const textBasic = new pc.Entity();
        textBasic.setLocalPosition(0, 200, 0);
        textBasic.addComponent("element", {
          pivot: new pc.Vec2(0.5, 0.5),
          anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
          fontAsset: assets.font.id,
          fontSize: 40,
          text: "Hello world",
          type: pc.ELEMENTTYPE_TEXT,
          color: pc.Color.BLACK,
        });
        screen.addChild(textBasic);

        // Create a label for the button
        const label = new pc.Entity();
        label.addComponent("element", {
          anchor: [0.5, 0.5, 0.5, 0.5],
          color: pc.Color.WHITE,
          fontAsset: assets.font.id,
          fontSize: 24,
          height: 64,
          pivot: [0.5, 0.5],
          text: "Navigate",
          type: pc.ELEMENTTYPE_TEXT,
          width: 128,
          wrapLines: true,
        });
        button.addChild(label);

        // Change the background color every time the button is clicked
        button.button.on("click", () => {
          camera.camera.clearColor = new pc.Color(
            Math.random(),
            Math.random(),
            Math.random()
          );
        });

        button.button.on("hoverstart", () => {
          button.element.textureAsset = assets.navigateButtonHover;
        });
        button.button.on("hoverend", () => {
          button.element.textureAsset = assets.navigateButton;
        });
        app.on("update", (dt) => {});
      });
    }

    main();
  }, []);

  return <canvas ref={canvasRef} id="application"></canvas>;
}
