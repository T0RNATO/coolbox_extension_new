export const range = n => [...Array(n).keys()];

// Code from https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
export function shadeHexColor(color, percent) {
    let f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function hexToRGB(hex) {
    return [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
    ];
}

function RGBtoHex(rgb) {
    return `#${rgb[0].toString(16).padStart(2, '0')}${rgb[1].toString(16).padStart(2, '0')}${rgb[2].toString(16).padStart(2, '0')}`
}

// Code modified from Arjan Haverkamp, https://gist.github.com/av01d/538b3fffc78fdc273894d173a83c563f
export function hexGradient(startHex, endHex, steps) {
    const start = hexToRGB(startHex);
    const end = hexToRGB(endHex);

    const colors = [];
    let alpha = 0;
    for (let i = 0; i < steps; i++) {
        alpha += 1.0 / steps;

        colors.push(RGBtoHex([
            Math.round(end[0] * alpha + (1 - alpha) * start[0]),
            Math.round(end[1] * alpha + (1 - alpha) * start[1]),
            Math.round(end[2] * alpha + (1 - alpha) * start[2])
        ]));
    }
    return colors;
}