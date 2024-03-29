import browser from "webextension-polyfill";
import {computed, ref, WritableComputedRef} from "vue";
import tailwind from "tailwindcss/tailwind.css?inline";
import icons from "/src/assets/css/icons.css?inline";

/**
 * Returns a reactive reference to Chrome extension storage
 */
export function useExtensionStorage<T>(path: string, defaultV: T): WritableComputedRef<T> {
    // The value that's being stored
    const storage = ref(defaultV);

    let internalStorageChange = false;
    // Check for when the actual storage changes, and update the ref
    browser.storage.local.onChanged.addListener((changes) => {
        // Get the first section of the path
        const p = path.split(".");
        const change = changes[p[0]];

        if (change && !internalStorageChange) {
            storage.value = objValueFromStringPath(change.newValue, p.slice(1).join("."), defaultV);
        } else if (internalStorageChange) {
            internalStorageChange = false;
        }
    })
    // Get the value from storage initially
    browser.storage.local.get().then(data => {
        try {
            storage.value = objValueFromStringPath(data, path, defaultV);
        } catch {
            storage.value = defaultV;
            setStorageValue(path, defaultV);
        }
    })
    // Return a computed property that updates storage and returns the value
    return computed({
        get() {
            return storage.value;
        },
        set(value) {
            storage.value = value;
            internalStorageChange = true;
            setStorageValue(path, value);
        }
    })
}

function setStorageValue(path, value) {
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
        browser.storage.local.set(data)
    })
}

function objValueFromStringPath(obj, path, optionalDefault) {
    const p = path.split(".");
    let out = obj;
    for (const section of p) {
        out = out[section];
    }
    if (out === undefined && optionalDefault) {
        out = optionalDefault;
    }
    return out;
}

const twStyleSheet = new CSSStyleSheet();
const iconsStyleSheet = new CSSStyleSheet();
const otherStyling = new CSSStyleSheet();

twStyleSheet.replaceSync(tailwind);
iconsStyleSheet.replaceSync(icons);
// language=CSS
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