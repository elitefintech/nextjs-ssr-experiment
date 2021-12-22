"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variant = void 0;
var react_1 = __importStar(require("react"));
function Variant(props) {
    var onRunVariant = props.onRunVariant, pName = props.name;
    (0, react_1.useEffect)(function () {
        onRunVariant === null || onRunVariant === void 0 ? void 0 : onRunVariant(pName);
    }, [onRunVariant, pName]);
    var childrenWithProps = react_1.default.Children.map(props.children, function (child) {
        return react_1.default.cloneElement(child, {
            onClick: function (e) {
                if (props.onClick) {
                    props.onClick(e, props.name);
                }
                if (child.props.onClick) {
                    child.props.onClick(e);
                }
            },
        });
    });
    return (react_1.default.createElement(react_1.default.Fragment, { key: props.name }, childrenWithProps));
}
exports.Variant = Variant;
