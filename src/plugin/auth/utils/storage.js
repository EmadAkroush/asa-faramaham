function set(key, value, expires) {
    if (expires) {
        sessionStorage.setItem(key, value);
    }
    else {
        localStorage.setItem(key, value);
    }
}

function get(key) {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
}

function remove(key) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
}

function clear() {
    localStorage.clear();
}

export {
    get,
    set,
    remove,
    clear
};