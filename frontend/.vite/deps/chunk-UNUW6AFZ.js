import {
  Transition_default,
  useTimeout
} from "./chunk-2LGELTGO.js";
import {
  chainPropTypes
} from "./chunk-JX37XSKT.js";
import {
  useForkRef_default
} from "./chunk-ENOTHQ22.js";
import {
  require_jsx_runtime,
  require_prop_types,
  useTheme
} from "./chunk-BAY67NBI.js";
import {
  require_react
} from "./chunk-6GAV2S6I.js";
import {
  __toESM
} from "./chunk-DC5AMYBS.js";

// node_modules/@mui/material/esm/Grow/Grow.js
var React2 = __toESM(require_react(), 1);
var import_prop_types2 = __toESM(require_prop_types(), 1);

// node_modules/@mui/utils/esm/elementAcceptingRef/elementAcceptingRef.js
var import_prop_types = __toESM(require_prop_types(), 1);
function isClassComponent(elementType) {
  const {
    prototype = {}
  } = elementType;
  return Boolean(prototype.isReactComponent);
}
function acceptingRef(props, propName, componentName, location, propFullName) {
  const element = props[propName];
  const safePropName = propFullName || propName;
  if (element == null || // When server-side rendering React doesn't warn either.
  // This is not an accurate check for SSR.
  // This is only in place for Emotion compat.
  // TODO: Revisit once https://github.com/facebook/react/issues/20047 is resolved.
  typeof window === "undefined") {
    return null;
  }
  let warningHint;
  const elementType = element.type;
  if (typeof elementType === "function" && !isClassComponent(elementType)) {
    warningHint = "Did you accidentally use a plain function component for an element instead?";
  }
  if (warningHint !== void 0) {
    return new Error(`Invalid ${location} \`${safePropName}\` supplied to \`${componentName}\`. Expected an element that can hold a ref. ${warningHint} For more information see https://mui.com/r/caveat-with-refs-guide`);
  }
  return null;
}
var elementAcceptingRef = chainPropTypes(import_prop_types.default.element, acceptingRef);
elementAcceptingRef.isRequired = chainPropTypes(import_prop_types.default.element.isRequired, acceptingRef);
var elementAcceptingRef_default = elementAcceptingRef;

// node_modules/@mui/utils/esm/getReactElementRef/getReactElementRef.js
var React = __toESM(require_react(), 1);
function getReactElementRef(element) {
  var _a;
  if (parseInt(React.version, 10) >= 19) {
    return ((_a = element == null ? void 0 : element.props) == null ? void 0 : _a.ref) || null;
  }
  return (element == null ? void 0 : element.ref) || null;
}

// node_modules/@mui/material/esm/transitions/utils.js
var reflow = (node) => node.scrollTop;
function getTransitionProps(props, options) {
  const {
    timeout,
    easing,
    style = {}
  } = props;
  return {
    duration: style.transitionDuration ?? (typeof timeout === "number" ? timeout : timeout[options.mode] || 0),
    easing: style.transitionTimingFunction ?? (typeof easing === "object" ? easing[options.mode] : easing),
    delay: style.transitionDelay
  };
}

// node_modules/@mui/material/esm/Grow/Grow.js
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function getScale(value) {
  return `scale(${value}, ${value ** 2})`;
}
var styles = {
  entering: {
    opacity: 1,
    transform: getScale(1)
  },
  entered: {
    opacity: 1,
    transform: "none"
  }
};
var isWebKit154 = typeof navigator !== "undefined" && /^((?!chrome|android).)*(safari|mobile)/i.test(navigator.userAgent) && /(os |version\/)15(.|_)4/i.test(navigator.userAgent);
var Grow = React2.forwardRef(function Grow2(props, ref) {
  const {
    addEndListener,
    appear = true,
    children,
    easing,
    in: inProp,
    onEnter,
    onEntered,
    onEntering,
    onExit,
    onExited,
    onExiting,
    style,
    timeout = "auto",
    // eslint-disable-next-line react/prop-types
    TransitionComponent = Transition_default,
    ...other
  } = props;
  const timer = useTimeout();
  const autoTimeout = React2.useRef();
  const theme = useTheme();
  const nodeRef = React2.useRef(null);
  const handleRef = useForkRef_default(nodeRef, getReactElementRef(children), ref);
  const normalizedTransitionCallback = (callback) => (maybeIsAppearing) => {
    if (callback) {
      const node = nodeRef.current;
      if (maybeIsAppearing === void 0) {
        callback(node);
      } else {
        callback(node, maybeIsAppearing);
      }
    }
  };
  const handleEntering = normalizedTransitionCallback(onEntering);
  const handleEnter = normalizedTransitionCallback((node, isAppearing) => {
    reflow(node);
    const {
      duration: transitionDuration,
      delay,
      easing: transitionTimingFunction
    } = getTransitionProps({
      style,
      timeout,
      easing
    }, {
      mode: "enter"
    });
    let duration;
    if (timeout === "auto") {
      duration = theme.transitions.getAutoHeightDuration(node.clientHeight);
      autoTimeout.current = duration;
    } else {
      duration = transitionDuration;
    }
    node.style.transition = [theme.transitions.create("opacity", {
      duration,
      delay
    }), theme.transitions.create("transform", {
      duration: isWebKit154 ? duration : duration * 0.666,
      delay,
      easing: transitionTimingFunction
    })].join(",");
    if (onEnter) {
      onEnter(node, isAppearing);
    }
  });
  const handleEntered = normalizedTransitionCallback(onEntered);
  const handleExiting = normalizedTransitionCallback(onExiting);
  const handleExit = normalizedTransitionCallback((node) => {
    const {
      duration: transitionDuration,
      delay,
      easing: transitionTimingFunction
    } = getTransitionProps({
      style,
      timeout,
      easing
    }, {
      mode: "exit"
    });
    let duration;
    if (timeout === "auto") {
      duration = theme.transitions.getAutoHeightDuration(node.clientHeight);
      autoTimeout.current = duration;
    } else {
      duration = transitionDuration;
    }
    node.style.transition = [theme.transitions.create("opacity", {
      duration,
      delay
    }), theme.transitions.create("transform", {
      duration: isWebKit154 ? duration : duration * 0.666,
      delay: isWebKit154 ? delay : delay || duration * 0.333,
      easing: transitionTimingFunction
    })].join(",");
    node.style.opacity = 0;
    node.style.transform = getScale(0.75);
    if (onExit) {
      onExit(node);
    }
  });
  const handleExited = normalizedTransitionCallback(onExited);
  const handleAddEndListener = (next) => {
    if (timeout === "auto") {
      timer.start(autoTimeout.current || 0, next);
    }
    if (addEndListener) {
      addEndListener(nodeRef.current, next);
    }
  };
  return (0, import_jsx_runtime.jsx)(TransitionComponent, {
    appear,
    in: inProp,
    nodeRef,
    onEnter: handleEnter,
    onEntered: handleEntered,
    onEntering: handleEntering,
    onExit: handleExit,
    onExited: handleExited,
    onExiting: handleExiting,
    addEndListener: handleAddEndListener,
    timeout: timeout === "auto" ? null : timeout,
    ...other,
    children: (state, {
      ownerState,
      ...restChildProps
    }) => {
      return React2.cloneElement(children, {
        style: {
          opacity: 0,
          transform: getScale(0.75),
          visibility: state === "exited" && !inProp ? "hidden" : void 0,
          ...styles[state],
          ...style,
          ...children.props.style
        },
        ref: handleRef,
        ...restChildProps
      });
    }
  });
});
true ? Grow.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * Add a custom transition end trigger. Called with the transitioning DOM
   * node and a done callback. Allows for more fine grained transition end
   * logic. Note: Timeouts are still used as a fallback if provided.
   */
  addEndListener: import_prop_types2.default.func,
  /**
   * Perform the enter transition when it first mounts if `in` is also `true`.
   * Set this to `false` to disable this behavior.
   * @default true
   */
  appear: import_prop_types2.default.bool,
  /**
   * A single child content element.
   */
  children: elementAcceptingRef_default.isRequired,
  /**
   * The transition timing function.
   * You may specify a single easing or a object containing enter and exit values.
   */
  easing: import_prop_types2.default.oneOfType([import_prop_types2.default.shape({
    enter: import_prop_types2.default.string,
    exit: import_prop_types2.default.string
  }), import_prop_types2.default.string]),
  /**
   * If `true`, the component will transition in.
   */
  in: import_prop_types2.default.bool,
  /**
   * @ignore
   */
  onEnter: import_prop_types2.default.func,
  /**
   * @ignore
   */
  onEntered: import_prop_types2.default.func,
  /**
   * @ignore
   */
  onEntering: import_prop_types2.default.func,
  /**
   * @ignore
   */
  onExit: import_prop_types2.default.func,
  /**
   * @ignore
   */
  onExited: import_prop_types2.default.func,
  /**
   * @ignore
   */
  onExiting: import_prop_types2.default.func,
  /**
   * @ignore
   */
  style: import_prop_types2.default.object,
  /**
   * The duration for the transition, in milliseconds.
   * You may specify a single timeout for all transitions, or individually with an object.
   *
   * Set to 'auto' to automatically calculate transition time based on height.
   * @default 'auto'
   */
  timeout: import_prop_types2.default.oneOfType([import_prop_types2.default.oneOf(["auto"]), import_prop_types2.default.number, import_prop_types2.default.shape({
    appear: import_prop_types2.default.number,
    enter: import_prop_types2.default.number,
    exit: import_prop_types2.default.number
  })])
} : void 0;
if (Grow) {
  Grow.muiSupportAuto = true;
}
var Grow_default = Grow;

export {
  reflow,
  getTransitionProps,
  getReactElementRef,
  elementAcceptingRef_default,
  Grow_default
};
//# sourceMappingURL=chunk-UNUW6AFZ.js.map
