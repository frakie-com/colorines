function adjustColor(color, adjustments) {
    var newColor = {
        h: color.h,
        s: color.s,
        b: color.b,
        a: color.a
    };
    newColor.h += adjustments.hue || 0;
    newColor.h %= 360;
    var adj = {};
    adj.s = adjustments.saturation || 0;
    adj.b = adjustments.brightness || 0;
    adj.a = adjustments.alpha || 0;
    for (var key in adj) {
        newColor[key] = Math.max(Math.min(newColor[key] * (1 + adj[key]), 1), 0);
    }
    return newColor;
}
function hex2rgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2}) *$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function parseRgba(raw) {
    var resul, retval = {};
    resul = raw.match(/rgba?\(([ \d.e-]*),([ \d.e-]*),([ \d.e-]*),?([ \d.e-]*)?/i);
    retval.r = parseFloat(resul[1]);
    retval.g = parseFloat(resul[2]);
    retval.b = parseFloat(resul[3]);
    retval.a = typeof resul[4] == 'undefined' ? 1 : parseFloat(resul[4]);
    return retval;
}
function parseColor(color) {
    if (color[0] == '#')
        return hex2rgb(color);
    if (color.match(/^rgb/))
        return parseRgba(color);
}
function color2hsl(color) {
    color = parseColor(color);
    return rgb2hsl(color.r, color.g, color.b, color.a);
}
function hex2hsl(hex) {
    var rgb = hex2rgb(hex);
    return rgb2hsl(rgb.r, rgb.g, rgb.b);
}
function rgb2hsl(r, g, b, a) {
    r = r / 255;
    g = g / 255;
    b = b / 255;
    var min = Math.min(r, g, b), max = Math.max(r, g, b), diff = max - min, h = 0, s = 0, l = (min + max) / 2;
    if (diff != 0) {
        s = l < 0.5 ? diff / (max + min) : diff / (2 - max - min);
        h = (r == max ? (g - b) / diff : g == max ? 2 + (b - r) / diff : 4 + (r - g) / diff) * 60;
    }
    return [
        h,
        s,
        l,
        _.isNumber(a) ? a : 1
    ];
}
function hsl2rgb(h, s, l, a) {
    if (h == 360) {
        h = 0;
    }
    while (h < 0) {
        h += 360;
    }
    while (h > 360) {
        h -= 360;
    }
    var r, g, b;
    if (h < 120) {
        r = (120 - h) / 60;
        g = h / 60;
        b = 0;
    } else if (h < 240) {
        r = 0;
        g = (240 - h) / 60;
        b = (h - 120) / 60;
    } else {
        r = (h - 240) / 60;
        g = 0;
        b = (360 - h) / 60;
    }
    r = Math.min(r, 1);
    g = Math.min(g, 1);
    b = Math.min(b, 1);
    r = 2 * s * r + (1 - s);
    g = 2 * s * g + (1 - s);
    b = 2 * s * b + (1 - s);
    if (l < 0.5) {
        r = l * r;
        g = l * g;
        b = l * b;
    } else {
        r = (1 - l) * r + 2 * l - 1;
        g = (1 - l) * g + 2 * l - 1;
        b = (1 - l) * b + 2 * l - 1;
    }
    r = Math.ceil(r * 255);
    g = Math.ceil(g * 255);
    b = Math.ceil(b * 255);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
}
