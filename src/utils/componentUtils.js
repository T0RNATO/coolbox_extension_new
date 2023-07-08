import browser from "webextension-polyfill";
import {computed, ref} from "vue";
import tailwind from "tailwindcss/tailwind.css?inline";
import icons from "/public/css/icons.css?inline";

/**
 * Returns a reactive reference to Chrome extension storage
 * @param {String} path - The fullstop-seperated path for the value to be stored, e.g `foo.bar.baz` is `foo:{bar:{baz:<value>}}`
 * @param {*} defaultV - The default for the value
 */
export function useExtensionStorage(path, defaultV) {
    // The value that's being stored
    const storage = ref(defaultV)

    let internalStorageChange = false;
    // Check for when the actual storage changes, and update the ref
    browser.storage.local.onChanged.addListener((changes) => {
        // Get the first section of the path
        const p = path.split(".");
        const change = changes[p[0]];

        if (change && !internalStorageChange) {
            storage.value = objValueFromStringPath(change.newValue, p.slice(1).join("."));
        } else if (internalStorageChange) {
            internalStorageChange = false;
        }
    })
    // Get the value from storage initially
    browser.storage.local.get().then(data => {
        try {
            storage.value = objValueFromStringPath(data, path);
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

function objValueFromStringPath(obj, path) {
    const p = path.split(".");
    let out = obj;
    for (const section of p) {
        out = out[section];
    }
    return out;
}

export const twStyleSheet = new CSSStyleSheet();
export const iconsStyleSheet = new CSSStyleSheet();
export const otherStyling = new CSSStyleSheet();
twStyleSheet.replaceSync(tailwind);
iconsStyleSheet.replaceSync(icons);
// language=CSS
otherStyling.replaceSync(`
    .dui-radio {
        border: 1px solid rgb(107 114 128);
    }`)
export const defaultSheets = [twStyleSheet, iconsStyleSheet, otherStyling];