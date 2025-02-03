"use client";
import * as pc from "playcanvas";
import { useRef, useEffect } from "react";

export default function Home() {
  const canvasRef = useRef();

  useEffect(() => {
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
    const app = new pc.Application(canvas);

    onresize = function () {
      app.resizeCanvas(canvas.width, canvas.height);
    };

    app.setCanvasResolution(pc.RESOLUTION_AUTO);
    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);

    const camera = new pc.Entity();
    camera.addComponent("camera", {
      clearColor: new pc.Color(1, 1, 1),
    });
    camera.setPosition(0, 0, 3);
    app.root.addChild(camera);

    const screen = new pc.Entity();
    screen.addComponent("screen", {
      referenceResolution: new pc.Vec2(1280, 720),
      scaleBlend: 0.5,
      scaleMode: pc.SCALEMODE_BLEND,
      screenSpace: true,
    });
    app.root.addChild(screen);

    const assets = {
      font: new pc.Asset("font", "font", { url: "/Roboto-Regular.json" }),
    };

    app.graphicsDevice.maxPixelRatio = 10;

    const assetListLoader = new pc.AssetListLoader(
      Object.values(assets),
      app.assets
    );
    assetListLoader.load(() => {
      app.start();

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

      app.on("update", (dt) => {});
    });
  }, []);

  return <canvas ref={canvasRef} id="application"></canvas>;
}
