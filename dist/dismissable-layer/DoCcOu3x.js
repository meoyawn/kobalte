import { n as layerStack } from "../layer-stack/DUp9FXTP.js";
import { createComponent, insert, ref, spread, template } from "@solidjs/web";
import { createContext, createEffect, createMemo, createSignal, omit, onSettled, untrack, useContext } from "solid-js";
import { interactOutside } from "@solid-primitives/interaction";
import { createShortcut } from "@solid-primitives/keyboard";
//#region src/dismissable-layer/dismissable-layer-context.tsx
const DismissableLayerContext = createContext(null);
function useOptionalDismissableLayerContext() {
	return useContext(DismissableLayerContext) ?? void 0;
}
//#endregion
//#region src/dismissable-layer/dismissable-layer.tsx
var _tmpl$ = /* @__PURE__ */ template(`<div>`);
function DismissableLayer(props) {
	const [ref$1, setRef] = createSignal(void 0, { ownedWrite: true });
	const parentContext = useOptionalDismissableLayerContext();
	const others = omit(props, "ref", "disableOutsidePointerEvents", "excludedElements", "onEscapeKeyDown", "onPointerDownOutside", "onFocusOutside", "onInteractOutside", "onDismiss", "bypassTopMostLayerCheck");
	const isPointerBlocking = createMemo(() => props.disableOutsidePointerEvents);
	const nestedLayers = /* @__PURE__ */ new Set([]);
	const registerNestedLayer = (element) => {
		nestedLayers.add(element);
		const parentUnregister = parentContext?.registerNestedLayer(element);
		return () => {
			nestedLayers.delete(element);
			parentUnregister?.();
		};
	};
	const shouldExcludeElement = (element) => {
		return untrack(() => {
			if (!ref$1()) return false;
			return props.excludedElements?.some((node) => node()?.contains(element)) || [...nestedLayers].some((layer) => layer.contains(element));
		});
	};
	const onPointerDownOutside = (e) => {
		untrack(() => {
			if (!ref$1() || layerStack.isBelowPointerBlockingLayer(ref$1())) return;
			if (!props.bypassTopMostLayerCheck && !layerStack.isTopMostLayer(ref$1())) return;
			props.onPointerDownOutside?.(e);
			props.onInteractOutside?.(e);
			if (!e.defaultPrevented) props.onDismiss?.();
		});
	};
	const onFocusOutside = (e) => {
		untrack(() => {
			props.onFocusOutside?.(e);
			props.onInteractOutside?.(e);
			if (!e.defaultPrevented) props.onDismiss?.();
		});
	};
	const interactOutsideRef = interactOutside({
		shouldExcludeElement,
		onPointerDownOutside,
		onFocusOutside
	});
	createShortcut(["Escape"], (e) => {
		untrack(() => {
			if (!e || !ref$1() || !layerStack.isTopMostLayer(ref$1())) return;
			props.onEscapeKeyDown?.(e);
			if (!e.defaultPrevented && props.onDismiss) {
				e.preventDefault();
				props.onDismiss();
			}
		});
	}, { preventDefault: false });
	// Register once the element exists (kobaltedev/kobalte#780): under a Portal
	// the ref arrives after the first settle.
	createEffect(ref$1, (node) => {
		if (!node) return;
		layerStack.addLayer({
			node: node,
			isPointerBlocking: isPointerBlocking(),
			dismiss: props.onDismiss
		});
		const unregisterFromParentLayer = parentContext?.registerNestedLayer(node);
		layerStack.assignPointerEventToLayers();
		layerStack.disableBodyPointerEvents(node);
		return () => {
			if (!node) return;
			layerStack.removeLayer(node);
			unregisterFromParentLayer?.();
			layerStack.assignPointerEventToLayers();
			layerStack.restoreBodyPointerEvents(node);
		};
	});
	createEffect(() => ({
		ref: ref$1(),
		disabled: isPointerBlocking()
	}), ({ ref, disabled: disableOutsidePointerEvents }) => {
		if (!ref) return;
		const layer = layerStack.find(ref);
		if (layer && layer.isPointerBlocking !== disableOutsidePointerEvents) {
			layer.isPointerBlocking = disableOutsidePointerEvents;
			layerStack.assignPointerEventToLayers();
		}
		if (disableOutsidePointerEvents) layerStack.disableBodyPointerEvents(ref);
		return () => {
			layerStack.restoreBodyPointerEvents(ref);
		};
	}, { defer: true });
	return createComponent(DismissableLayerContext, {
		value: { registerNestedLayer },
		get children() {
			var _el$ = _tmpl$();
			spread(_el$, others, true);
			ref(() => {
				return [
					setRef,
					interactOutsideRef,
					props.ref
				];
			}, _el$);
			insert(_el$, () => {
				return others.children;
			});
			return _el$;
		}
	});
}
//#endregion
export { DismissableLayer as t };
