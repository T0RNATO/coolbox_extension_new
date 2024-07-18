import browser, {Storage} from "webextension-polyfill";
import {computed, ref, UnwrapRef, WritableComputedRef} from "vue";
// @ts-ignore, vite-specific code
import tailwind from "tailwindcss/tailwind.css?inline";
// @ts-ignore, vite-specific code
import icons from "/src/assets/css/icons.css?inline";

// count the number of current changes that should not update refs
let internalStorageChangeCount: number = 0;
// count the number of current changes that should not activate watchers
let noPropagateStorageChangeCount: number = 0;

/**
 * Returns a reactive reference to Chrome extension storage
 */
export function useExtensionStorage<T>(path: string, defaultV: T): WritableComputedRef<UnwrapRef<T>> {
    // A reactive reference to the actual piece of data
    const storage = ref(defaultV);

    // Get the value from storage initially
    browser.storage.local.get().then(data => {
        try {
            storage.value = objValueFromStringPath(data, path);
        } catch {
            // @ts-ignore, idek what's going on here
            storage.value = defaultV;
            setStorageValue(path, defaultV, true);
        }
    })

    // Check for when browser storage changes, and update the value in the ref
    browser.storage.local.onChanged.addListener((changes) => {
        if (internalStorageChangeCount > 0) {return}
        if (changes['subjects']) {return}

        // Get the first section of the path
        const p = path.split(".");
        const change = changes[p[0]];

        if (!change) {return}

        storage.value = objValueFromStringPath(change.newValue, p.slice(1).join("."), defaultV);
    })
    // Return a computed property that updates storage and returns the value
    return computed({
        get() {
            return storage.value;
        },
        set(value) {
            storage.value = value;
            setStorageValue(path, value);
        }
    })
}

// Change a value in browser storage without messing with reactive refs to that storage
export function manualStorageSet(data: object) {
    internalStorageChangeCount++;
    return browser.storage.local.set(data).then(() => {
        internalStorageChangeCount--;
    })
}

export function listenForStorageChange(path: string, callback: (storage: Storage.StorageChange) => void) {
    browser.storage.local.onChanged.addListener((changes) => {
        if (noPropagateStorageChangeCount > 0 || !changes[path]) {return}
        callback(changes[path]);
    })
}

// Given a period-seperated path and a value, set the value in browser storage
function setStorageValue(path: string, value: any, doNotPropagate = false) {
    if (doNotPropagate) {
        noPropagateStorageChangeCount++;
    }
    internalStorageChangeCount++;
    browser.storage.local.get().then(data => {
        let out = data;
        const layers = path.split(".");
        for (const layer of layers.slice(0, -1)) {
            const l = out[layer];
            if (l !== undefined) {
                out = l;
            } else {
                out[layer] = {};
                out = out[layer];
            }
        }
        out[layers[layers.length - 1]] = value;
        browser.storage.local.set(data).then(() => {
            if (doNotPropagate) {
                noPropagateStorageChangeCount--;
            }
            internalStorageChangeCount--;
        })
    })
}

// Given an object and a period-seperated path, return the value at that path
function objValueFromStringPath(obj: object, path: string, optionalDefault?: any): any {
    const pathSegments = path.split(".");
    let output = obj;
    // loop through the path segments and get the value
    for (const segment of pathSegments) {
        // may error, but will be caught
        output = output[segment];
    }
    if (output === undefined) {
        if (optionalDefault) {return optionalDefault}
        throw new Error("Value not found in object");
    }
    return output;
}

const twStyleSheet = new CSSStyleSheet();
const iconsStyleSheet = new CSSStyleSheet();
const otherStyling = new CSSStyleSheet();

twStyleSheet.replaceSync(tailwind);
iconsStyleSheet.replaceSync(icons);

otherStyling.replaceSync(`
    .dui-radio, .dui-checkbox {
        border: 1px solid rgb(107 114 128);
    }
    .option {
        display: flex;
        margin-bottom: 0.25rem;
        align-items: center;
    }
`)

export const defaultSheets: CSSStyleSheet[] = [twStyleSheet, iconsStyleSheet, otherStyling];

export const weekNumber= ref("");

const numberToNumber = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
    "eleven": 11,
    "twelve": 12,
    "thirteen": 13,
    "fourteen": 14
}

// Not remotely scuff code to wait until calendar is loaded and add the week number to the heading
setTimeout(() => {
    const calendarEvents: HTMLSpanElement[] = Array.from(document.querySelectorAll(".fc-event-title"));
    const weekEvent = calendarEvents.find(el =>
        el.innerText.includes("Week") &&
        /\(\d+\)/.test(el.innerText)
    );
    const weekNo = numberToNumber[weekEvent?.innerText.split(" ")[1].toLowerCase()];
    if (weekNo) {
        weekNumber.value = `(Week ${weekNo})`;
    }
}, 1500);