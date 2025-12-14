import { Application } from "express";

export default function getRoutes(app: Application): IRoutePayload[] {
  const paths: IRoutePayload[] = [];
  function print(path: any, layer: any) {
    if (layer.route) {
      layer.route.stack.forEach(
        print.bind(null, path.concat(split(layer.route.path))),
      );
    } else if (layer.name === "router" && layer.handle.stack) {
      layer.handle.stack.forEach(
        print.bind(null, path.concat(split(layer.regexp))),
      );
    } else if (layer.method) {
      paths.push({
        method: layer.method.toUpperCase(),
        path: path.concat(split(layer.regexp)).filter(Boolean).join("/"),
      });
    }
  }

  function split(thing: any) {
    if (typeof thing === "string") {
      return thing.split("/");
    } else if (thing.fast_slash) {
      return "";
    } else {
      var match = thing
        .toString()
        .replace("\\/?", "")
        .replace("(?=\\/|$)", "$")
        .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
      return match
        ? match[1].replace(/\\(.)/g, "$1").split("/")
        : "<complex:" + thing.toString() + ">";
    }
  }

  app._router.stack.forEach(print.bind(null, []));
  return paths;
}
