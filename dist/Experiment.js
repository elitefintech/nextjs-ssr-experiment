"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Experiment = void 0;
var react_1 = __importStar(require("react"));
var js_cookie_1 = __importDefault(require("js-cookie"));
var ExperimentProvider_1 = require("./ExperimentProvider");
var react_dom_1 = __importDefault(require("react-dom"));
var Debug_1 = require("./Debug");
function pickVariant(variants) {
    var pickedVariant = Math.floor(Math.random() * variants.length);
    return pickedVariant;
}
var MAX_AGE = 30; // 30 days
function Experiment(props) {
    var _a;
    var pDebug = props.debug, pDebugUriParam = props.debugUriParam, pMAX_AGE = props.MAX_AGE, pName = props.name, pPickVariant = props.pickVariant, children = props.children;
    var _b = (0, react_1.useState)((_a = props.debug) !== null && _a !== void 0 ? _a : false), debug = _b[0], setDebug = _b[1];
    var _c = (0, react_1.useContext)(ExperimentProvider_1.ExperimentContext), cookies = _c[0], setCookies = _c[1];
    var _d = (0, react_1.useState)(cookies[encodeURIComponent(props.name)]
        ? parseInt(cookies[encodeURIComponent(props.name)], 10)
        : -1), variant = _d[0], setVariant = _d[1];
    var _e = react_1.default.useState(false), open = _e[0], setOpen = _e[1];
    /**
     * Component did mount
     * We pick a variant if none has been set.
     */
    (0, react_1.useEffect)(function () {
        if (variant === -1) {
            var pickedVariant = pPickVariant
                ? pPickVariant(children)
                : pickVariant(children);
            setVariant(pickedVariant);
        }
    }, [pPickVariant, children, variant]);
    (0, react_1.useEffect)(function () {
        if (!pDebug) {
            setDebug(!!(pDebugUriParam &&
                window.location.href.indexOf(pDebugUriParam) > -1));
        }
    }, [pDebug, pDebugUriParam]);
    /**
     * Whenever the variant changes value we change the value in the cookie as well.
     */
    (0, react_1.useEffect)(function () {
        var _a;
        if (variant !== -1) {
            var newCookies = {};
            if (cookies) {
                newCookies = __assign(__assign({}, cookies), (_a = {}, _a[encodeURIComponent(pName)] = variant, _a));
            }
            if (JSON.stringify(cookies) !== JSON.stringify(newCookies)) {
                setCookies(newCookies);
                js_cookie_1.default.set(pName, "".concat(variant), {
                    expires: pMAX_AGE !== null && pMAX_AGE !== void 0 ? pMAX_AGE : MAX_AGE,
                });
            }
        }
    }, [variant, pMAX_AGE, pName, cookies, setCookies]);
    /**
     * Remove the experiment from the cookie
     * @param experimentName
     */
    function removeExperiment(experimentName) {
        var newCookies = {};
        if (cookies) {
            newCookies = __assign({}, cookies);
        }
        var _a = newCookies, _b = encodeURIComponent(experimentName), _ = _a[_b], trimmedCookies = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
        js_cookie_1.default.remove(experimentName);
        setCookies(trimmedCookies);
    }
    /**
     * Inject some extra functionality into the child Variant components.
     * These are mostly callbacks for reporting purposes.
     */
    var childrenWithProps = react_1.default.Children.map(props.children, function (child) {
        return react_1.default.cloneElement(child, {
            onClick: function (e, variantName) {
                if (props.onClick) {
                    props.onClick(e, props.name, variantName);
                }
                if (child.props.onClick) {
                    child.props.onClick(e, variantName);
                }
            },
            onRunVariant: function (variantName) {
                if (props.onRunExperiment) {
                    props.onRunExperiment(props.name, variantName);
                }
                if (child.props.onRunVariant) {
                    child.props.onRunVariant(variantName);
                }
            },
        });
    });
    /**
     * Open debug settings dialog
     */
    var handleOpen = function () {
        setOpen(true);
    };
    /**
     * Close debug settings dialog
     */
    var handleClose = function () {
        setOpen(false);
    };
    function debugChange(e) {
        setVariant(parseInt(e.currentTarget.value, 10));
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        childrenWithProps.length < 2 ? childrenWithProps : null,
        variant > -1 ? childrenWithProps[variant] : null,
        typeof document !== 'undefined' && debug
            ? react_dom_1.default.createPortal(react_1.default.createElement("button", { style: {
                    position: 'relative',
                    bottom: '0',
                    margin: '.5rem',
                    zIndex: '9999',
                }, onClick: handleOpen },
                "A/B ",
                props.name,
                " (",
                variant + 1,
                "\u2208",
                childrenWithProps.length,
                ")"), props.debugRoot ||
                document.querySelector('body'))
            : null,
        typeof document !== 'undefined' && debug ? (react_1.default.createElement(Debug_1.Debug, { debugChange: debugChange, handleClose: handleClose, handleRemoveExperiment: removeExperiment, open: open, name: props.name, variant: variant }, childrenWithProps)) : null));
}
exports.Experiment = Experiment;
