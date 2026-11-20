import { Polymorphic } from "../polymorphic/index.js";
import { t as createTagName } from "../create-tag-name/D6_aBB9R.js";
import { r as useFormControlContext } from "../form-control-description/BFR2LXoN.js";
import { createComponent, isServer, memo, mergeProps } from "@solidjs/web";
import { createEffect, createSignal, merge, omit, untrack } from "solid-js";
//#region src/form-control/form-control-label.tsx
/**
* The label that gives the user information on the form control.
*/
function FormControlLabel(props) {
	const [ref, setRef] = createSignal(void 0, { ownedWrite: true });
	const context = useFormControlContext();
	const mergedProps = merge({ id: context.generateId("label") }, props);
	const others = omit(mergedProps, "ref");
	const tagName = createTagName(ref, () => "label");
	if (!isServer) untrack(() => context.registerLabel(others.id));
	createEffect(() => others.id, (id) => context.registerLabel(id));
	return createComponent(Polymorphic, mergeProps({
		as: "label",
		ref: [setRef, untrack(() => mergedProps.ref)],
		get "for"() {
			return memo(() => {
				return tagName() === "label";
			})() ? context.fieldId() : void 0;
		}
	}, () => {
		return context.dataset();
	}, others));
}
//#endregion
export { FormControlLabel as t };
