export var Settings = {
    "display.brightness": ["dark", "light"],
    "display.articleslist": ["simplified", "traditional"],
    "display.articleslist.simplified": ["tags", "categories"],
    "display.appslist": ["simplified", "traditional"],
    "display.sidebar": ["show", "hide"],
    "edit.article.description": ["top", "left"],
    "display.taglist.linecount": {"default": 4, "max": 10, "min": 1}
};

export function SettingItem(key) {
    if (localStorage.getItem(key) == null) {
        if (Settings[key][0])
            localStorage.setItem(key, Settings[key][0]);
        else
            localStorage.setItem(key, Settings[key].default);
    }
    return localStorage.getItem(key);
}

export function UpdateItem(key, value) {
    localStorage.setItem(key, value);
}