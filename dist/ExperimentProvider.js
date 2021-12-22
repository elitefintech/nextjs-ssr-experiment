"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperimentProvider = exports.ExperimentContext = void 0;
var react_1 = __importDefault(require("react"));
var react_2 = require("react");
var js_cookie_1 = __importDefault(require("js-cookie"));
exports.ExperimentContext = (0, react_2.createContext)([
    {},
    console.log,
]);
function ExperimentProvider(props) {
    var _a = (0, react_2.useState)(props.initialState || js_cookie_1.default.get() || {}), cookies = _a[0], setCookies = _a[1];
    return (react_1.default.createElement(exports.ExperimentContext.Provider, { value: [cookies, setCookies] }, props.children));
}
exports.ExperimentProvider = ExperimentProvider;
