import { Polymorphic } from "../polymorphic/index.jsx";
import { createEffect, merge, untrack } from "solid-js";
import { isServer } from "@solidjs/web";
import { access } from "@solid-primitives/utils";
import { FormControlContext, createFormControl, useFormControl as useFormControlContext } from "@solid-primitives/a11y";
//#region src/form-control/create-form-control.tsx
const FORM_CONTROL_PROP_NAMES = [
	"id",
	"name",
	"validationState",
	"required",
	"disabled",
	"readOnly"
];
function createFormControl$1(props) {
	const context = createFormControl(props);
	const defaultId = (registered, part) => () => registered() ?? (isServer ? context.generateId(part) : void 0);
	const labelId = defaultId(context.labelId, "label");
	const fieldId = defaultId(context.fieldId, "input");
	const descriptionId = defaultId(context.descriptionId, "description");
	const errorMessageId = () => context.errorMessageId() ?? (isServer && access(props.validationState) === "invalid" ? context.generateId("error-message") : void 0);
	return { formControlContext: {
		...context,
		labelId,
		fieldId,
		descriptionId,
		errorMessageId,
		getAriaLabelledBy: (fieldId, fieldAriaLabel, fieldAriaLabelledBy) => {
			const hasAriaLabelledBy = fieldAriaLabelledBy != null || labelId() != null;
			return [
				fieldAriaLabelledBy,
				labelId(),
				hasAriaLabelledBy && fieldAriaLabel != null ? fieldId : void 0
			].filter(Boolean).join(" ") || void 0;
		},
		getAriaDescribedBy: (fieldAriaDescribedBy) => [
			descriptionId(),
			errorMessageId(),
			fieldAriaDescribedBy
		].filter(Boolean).join(" ") || void 0
	} };
}
//#endregion
//#region src/form-control/form-control-description.tsx
/**
* The description that gives the user more information on the form control.
*/
function FormControlDescription(props) {
	const context = useFormControlContext();
	const mergedProps = merge({ id: context.generateId("description") }, props);
	if (!isServer) untrack(() => context.registerDescription(mergedProps.id));
	createEffect(() => mergedProps.id, (id) => context.registerDescription(id));
	return <Polymorphic as="div" {...context.dataset()} {...mergedProps} />;
}
//#endregion
export { createFormControl$1 as a, FORM_CONTROL_PROP_NAMES as i, FormControlContext as n, useFormControlContext as r, FormControlDescription as t };
