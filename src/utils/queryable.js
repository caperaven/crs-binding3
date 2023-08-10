/**
 * @class Queryable - A class that allows for querying elements.
 * When you have shadow dom items it is hard to find elements in the shadow dom.
 * When using post message you may not be able to find the element using document.querySelector because it is behind the dom.
 * This class allows you to add elements to a list and then query them.
 * If you want to use post message and the target elements are behind the shadow dom, just add it here and then query it.
 */
export class Queryable {
    #elements = [];

    add(element) {
        if (element == null) return;
        this.#elements.push(element);
    }

    remove(element) {
        if (element == null) return;

        const index = this.#elements.indexOf(element);
        if (index > -1) {
            this.#elements.splice(index, 1);
        }
    }

    query(selector) {
        if (selector == null) return [];
        return this.#elements.filter(element => element.matches(selector));
    }
}