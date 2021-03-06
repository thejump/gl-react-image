"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _glReact = require("gl-react");

var _glReact2 = _interopRequireDefault(_glReact);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _rectCrop = require("rect-crop");

var _rectCrop2 = _interopRequireDefault(_rectCrop);

var _rectClamp = require("rect-clamp");

var _rectClamp2 = _interopRequireDefault(_rectClamp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var shaders = _glReact2.default.Shaders.create({
  image: {
    frag: "\nprecision highp float;\nvarying vec2 uv;\nuniform sampler2D t;\nuniform vec4 crop;\nvec2 invert (vec2 p) {" + "\n  return vec2(p.x, 1.0-p.y);\n}\nvoid main () {\n  vec2 p = invert(invert(uv) * crop.zw + crop.xy);\n  gl_FragColor =\n    step(0.0, p.x) *\n    step(0.0, p.y) *\n    step(p.x, 1.0) *\n    step(p.y, 1.0) *\n    texture2D(t, p);\n}"
  }
});

exports.default = _glReact2.default.createComponent(function (_ref) {
  var width = _ref.width;
  var height = _ref.height;
  var source = _ref.source;
  var imageSize = _ref.imageSize;
  var _ref$resizeMode = _ref.resizeMode;
  var resizeMode = _ref$resizeMode === undefined ? "cover" : _ref$resizeMode;
  var center = _ref.center;
  var zoom = _ref.zoom;

  if (!imageSize) {
    if (source.width && source.height) {
      imageSize = { width: source.width, height: source.height };
    } else {
      throw new Error("gl-rect-image: imageSize is required if you don't provide {width,height} in source");
    }
  }
  var crop = void 0;
  switch (resizeMode) {
    case "cover":
      {
        if (!center) center = [0.5, 0.5];
        if (!zoom) zoom = 1;
        var rect = (0, _rectCrop2.default)(zoom, center)({ width: width, height: height }, imageSize);
        rect = (0, _rectClamp2.default)(rect, [0, 0, imageSize.width, imageSize.height]);
        crop = [rect[0] / imageSize.width, rect[1] / imageSize.height, rect[2] / imageSize.width, rect[3] / imageSize.height];
        break;
      }
    case "contain":
      {
        if (center || zoom) {
          console.warn("gl-react-image: center and zoom props are only supported with resizeMode='cover'");
        }
        var ratio = width / height;
        var imageRatio = imageSize.width / imageSize.height;
        crop = ratio > imageRatio ? [(1 - ratio / imageRatio) / 2, 0, ratio / imageRatio, 1] : [0, (1 - imageRatio / ratio) / 2, 1, imageRatio / ratio];
        break;
      }
    case "stretch":
      if (center || zoom) {
        console.warn("gl-react-image: center and zoom props are only supported with resizeMode='cover'");
      }
      crop = [0, 0, 1, 1];
      break;

    default:
      throw new Error("gl-react-image: unknown resizeMode=" + resizeMode);
  }

  return _react2.default.createElement(_glReact2.default.Node, {
    shader: shaders.image,
    uniforms: {
      t: source,
      crop: crop
    }
  });
}, {
  displayName: "Image"});
//# sourceMappingURL=Image.js.map