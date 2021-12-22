"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debug = void 0;
var react_1 = __importDefault(require("react"));
function Debug(props) {
    function handleRemoveExperiment() {
        props.handleRemoveExperiment(props.name);
    }
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("section", null,
            react_1.default.createElement("h2", null,
                props.name,
                react_1.default.createElement("span", { onClick: handleRemoveExperiment, title: "Remove experiment cookie" })),
            props.children.map(function (child, idx) { return (react_1.default.createElement("label", { key: child.props.name },
                react_1.default.createElement("input", { type: "radio", value: idx, name: props.name, onChange: props.debugChange, checked: idx === props.variant }),
                child.props.name)); }))));
}
exports.Debug = Debug;
