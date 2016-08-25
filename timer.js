// jshint esversion:6

/*var Timer = function (config) {
    var self = this;

    this.initConfig(config);
    this.createView();
    this.loadInitialData(function (data) {
        self.updateView(data);
    });
};

Timer.prototype = {
    initConfig: function (config) {
        this.config = config;
    },

    createView: function () {
        this.view = new View(this.config);
    },

    loadInitialData: function () {

    },

    startTask: function () {

    },

    pauseTask: function () {

    },

    stopTask: function () {

    }
};*/

var View = function (config) {
    this.container = config.el;

    this.resetStatus();
    //this.clearContainer();

    this.createElements();
    this.attachEvents();
    this.appendElements();

    this.proceedShowHideDependencies();
};

View.prototype = {
    getShowHideConfig: function (codename) {
        codename = codename || "base";

        var config = {
            base: {
                start: true,
                stop: true,
                pause: true,
                timer: true,
                issue: true
            },
            stopped: {
                stop: false,
                pause: false,
                timer: false
            },
            inprogress: {
                start: false
            },
            paused: {
                pause: false
            }
        };

        return Object.assign({}, config.base, config[codename] || {});
    },

    resetStatus: function () {
        this.status = null;
    },

    createElements: function () {
        var els = {};
        els.loader = this.createElement("div", "rm-ext-loader");
        els.start = this.createElement("a", ["rm-ext-button", "rm-ext-start"]);
        els.stop = this.createElement("a", ["rm-ext-button", "rm-ext-stop"]);
        els.pause = this.createElement("a", ["rm-ext-button", "rm-ext-pause"]);
        els.timer = this.createElement("span", "rm-ext-timer");

        this.els = els;
    },

    appendElements: function () {
        var parent = this.container,
            els = this.els;

        parent.appendChild(els.loader);
        parent.appendChild(els.start);
        parent.appendChild(els.stop);
        parent.appendChild(els.pause);
        parent.appendChild(els.timer);
    },

    attachEvents: function () {
        var els = this.els;

        els.start.addEventListener("click", this.changeEvent.bind(this, "inprogress"));
        els.stop.addEventListener("click", this.changeEvent.bind(this, "stopped"));
        els.pause.addEventListener("click", this.changeEvent.bind(this, "paused"));
    },

    showElement: function (el) {
        el.classList.remove("hided");
    },

    hideElement: function (el) {
        el.classList.add("hided");
    },

    proceedShowHideDependencies: function (codename) {
        codename = codename || "stopped";

        var config = this.getShowHideConfig(codename);

        for (let one in this.els) {
            if (this.els.hasOwnProperty(one)) {
                let current = this.els[one],
                    visible = config[one];

                if (visible) {
                    this.showElement(current);
                } else {
                    this.hideElement(current);
                }
            }
        }
    },

    createElement: function (tagName, cls) {
        var el = document.createElement(tagName);

        switch (tagName) {
            case "a":
                el.href = "";
                break;
        }

        if (cls instanceof Array) {
            cls.forEach(one => el.classList.add(one));
        } else {
            el.classList.add(cls);
        }

        return el;
    },

    clearContainer: function () {
        this.container.innerHTML = "";
    },

    changeEvent: function (type, e) {
        e.preventDefault();
        this.proceedShowHideDependencies(type);
        console.log(arguments);
    }
};

var view = new View({
    el: 	document.querySelector('#container'),
    key: "e96d1822f969ca326b0c7bd53bc96152f4986ef8"
});