import { isServer } from "@solidjs/web";
import { access } from "@solid-primitives/utils";
import { createFormControlInput, useFormControl } from "@solid-primitives/a11y";
//#region src/form-control/create-form-control-field.tsx
const FORM_CONTROL_FIELD_PROP_NAMES = [
	"id",
	"aria-label",
	"aria-labelledby",
	"aria-describedby"
];
function createFormControlField(props = {}) {
	const context = useFormControl();
	if (!isServer) context.registerField(access(props.id) ?? context.generateId("field"));
	return createFormControlInput(props);
}
//#endregion
export { createFormControlField as n, FORM_CONTROL_FIELD_PROP_NAMES as t };
