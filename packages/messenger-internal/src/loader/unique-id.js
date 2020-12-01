/**
 * Courtesy of https://gist.github.com/jed/982883
 * It's not cryptographically safe, so don't use it for that purpose.
 */

// prettier-ignore
// eslint-disable-next-line
function b(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b)}

export const uniqueId = b;
