
class UIValidation {
    /**
     * @method apply - apply validation markup to an element
     * @param propertyPath - what property is affected by this validation e.g. model.firstName
     * @param ruleName - what rule is being applied e.g. required, minlength, maxlength, min, max, pattern
     * @param definition
     */
    static apply(bid, propertyPath, ruleName, definition) {
        const elements = document.querySelectorAll(`[data-field="${propertyPath}"]`);

        let element = null;
        for (const searchElement of elements) {
            if (searchElement.__bid == bid) {
                element = searchElement;
                break;
            }
        }

        if (element == null) return;

        ruleName = ruleName.toLowerCase();
        if (this[ruleName] != null) {
            this[ruleName](element, definition.value, definition.required);
        }
    }

    /**
     * @method required - apply required validation to an element or remove it based on the required flag
     * @param element {HTMLElement} - the element to apply/remove the required validation to/from
     * @param required {boolean} - whether to apply or remove the required validation
     */
    static required(element, required) {
        if (required) {
            element.setAttribute('required', 'required');
        } else {
            element.removeAttribute('required');
        }
    }

    /**
     * @method minLength - add the min length validation to an element or remove it based on the required flag
     * @param element {HTMLElement} - the element to apply/remove the min length validation to/from
     * @param minLength {number} - the minimum length of the value
     * @param required {boolean} - whether to apply or remove the min length validation
     */
    static minlength(element, minLength, required = true) {
        if (required) {
            element.setAttribute('minlength', minLength);
        }
        else {
            element.removeAttribute('minlength');
        }
    }

    /**
     * @method maxLength - add the min length validation to an element or remove it based on the required flag
     * @param element {HTMLElement} - the element to apply/remove the min length validation to/from
     * @param maxLength {number} - the minimum length of the value
     * @param required {boolean} - whether to apply or remove the min length validation
     */
    static maxlength(element, maxLength, required = true) {
        if (required) {
            element.setAttribute('maxlength', maxLength);
        }
        else {
            element.removeAttribute('maxlength');
        }
    }

    /**
     * @method min - add the min validation to an element or remove it based on the required flag
     * @param element {HTMLElement} - the element to apply/remove the min validation to/from
     * @param min {number} - the minimum value
     * @param required {boolean} - whether to apply or remove the min validation
     */
    static min(element, min, required = true) {
        if (required) {
            element.setAttribute('min', min);
        }
        else {
            element.removeAttribute('min');
        }
    }

    /**
     * @method max - add the max validation to an element or remove it based on the required flag
     * @param element {HTMLElement} - the element to apply/remove the max validation to/from
     * @param max {number} - the maximum value
     * @param required {boolean} - whether to apply or remove the max validation
     */
    static max(element, max, required = true) {
        if (required) {
            element.setAttribute('max', max);
        }
        else {
            element.removeAttribute('max');
        }
    }

    /**
     * @method pattern - add or remove the pattern attribute to the element based on the required flag
     * @param element {HTMLElement} - the element to apply/remove the pattern validation to/from
     * @param pattern {string} - the pattern to apply to the element
     * @param required {boolean} - whether to apply or remove the pattern validation
     */
    static pattern(element, pattern, required = true) {
        if (required) {
            element.setAttribute('pattern', pattern);
        }
        else {
            element.removeAttribute('pattern');
        }
    }
}

crs.binding.ui = UIValidation;

/// crs.binding.ui.validations.apply(bid, "model.firstName", "required", false);
/// crs.binding.ui.required(element, false);
/// crs.binding.ui.max(element, 10, true);
