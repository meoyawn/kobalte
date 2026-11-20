import { Polymorphic } from "../polymorphic/index.js";
import { r as useFormControlContext } from "../form-control-description/BFR2LXoN.js";
import { createComponent, isServer, memo, mergeProps } from "@solidjs/web";
import { createEffect, merge, omit, untrack } from "solid-js";
//#region src/form-control/form-control-error-message.tsx
/**
* The error message that gives the user information about how to fix a validation error on the form control.
*/
function FormControlErrorMessage(props) {
	const context = useFormControlContext();
	const mergedProps = merge({ id: context.generateId("error-message") }, props);
	const others = omit(mergedProps, "forceMount");
	const isInvalid = () => context.validationState() === "invalid";
	if (isInvalid() && !isServer) untrack(() => context.registerErrorMessage(others.id));
	createEffect(() => isInvalid() ? others.id : void 0, (id) => {
		if (!id) return;
		return context.registerErrorMessage(id);
	});
	return memo(() => {
		return memo(() => {
			return !!(mergedProps.forceMount || isInvalid());
		})() ? createComponent(Polymorphic, mergeProps({
			as: "div",
			role: "alert"
		}, () => {
			return context.dataset();
		}, others)) : void 0;
	});
}
//#endregion
export { FormControlErrorMessage as t };
