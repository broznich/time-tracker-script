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

var Timer = function () {
    this.time = 0;
};

Timer.prototype = {
    update: function (time) {
        this.stopInterval();
        this.setValue(this.convertTimeToMins(time));
        this.startInterval();
    },

    setValue: function (tmins) {
        this.time = +tmins;
    },

    getRawValue: function () {
        return this.time;
    },

    getValue: function () {
        return this.convertMinsToTime(this.getRawValue());
    },

    start: function () {
        this.startInterval();
    },

    stop: function () {
        var value = this.getValue();

        this.stopInterval();
        this.setValue(0);

        return value;
    },

    pause: function () {
        this.stopInterval();
    },

    reset: function () {
        this.stopInterval();
        this.setValue(0);
        this.startInterval();
    },

    stopInterval: function () {
        if (this.interval) {
            window.clearInterval(this.interval);
        }

        this.interval = null;
    },

    startInterval: function () {
        if (this.interval) {
            this.stopInterval();
        }

        this.interval = window.setInterval(this.tick.bind(this), 1000);
    },

    convertTimeToMins: function (time) {
        if (time.indexOf(":") < 0) {
            return time;
        }

        var splitted = time.split(/:/),
            hours = +splitted[0],
            minutes = +splitted[1];

        return hours * 60 + minutes;
    },

    convertMinsToTime: function (mins) {
        if (typeof mins === "string" && mins.indexOf(":") >= 0) {
            return mins;
        }

        var hours = Math.floor(mins/60),
            minutes = mins % 60;

        return hours + ":" + (minutes < 10 ? "0" + minutes : minutes);
    },

    tick: function () {
        console.log("tick");
        this.time++;
    }
};

var View = function (config) {
    this.initConfig(config);
    this.els = this.initElements(config.template);

    this.initEvents();
    this.initTimerCmp();
    this.proceedShowHideDependencies();
};

View.prototype = {
    error: function (message) {
        throw new Error(message);
    },

    initConfig: function (config) {
        this.config = config;
    },

    initElements: function (template) {
        var elements = {};
        for (let one in template) {
            if (template.hasOwnProperty(one)) {
                let tplOne = template[one],
                    value;

                if (tplOne instanceof Object) {
                    value = this.initElements(tplOne);
                } else {
                    value = document.querySelector(tplOne);
                }

                if (value) {
                    elements[one] = value;
                } else {
                    this.error("Incorrect template config");
                }
            }
        }

        return elements;
    },

    initTimerCmp: function () {
        var self = this;
        this.timerCmp = new Timer();
        this.interval = window.setInterval(function () {
            let value = self.timerCmp.getRawValue();

            self.updateTimer(value > 0 ? self.timerCmp.getValue() : self.timerCmp.convertMinsToTime(0));
        }, 1000);
    },

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

    initEvents: function () {
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

        var config = this.getShowHideConfig(codename),
            els = this.els;

        for (let one in config) {
            if (config.hasOwnProperty(one) && els.hasOwnProperty(one)) {
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

    getElement: function (selector) {
        return document.querySelector(selector);
    },

    clearContainers: function () {
        this.buttons.innerHTML = "";
        this.issue.innerHTML = "";
        this.timer.innerHTML = "";
    },

    changeEvent: function (type, e) {
        console.log(type);
        e.preventDefault();
        this.proceedShowHideDependencies(type);

        switch (type) {
            case "inprogress":
                this.timerCmp.start();
                break;
            case "stopped":
                this.timerCmp.stop();
                break;
            case "paused":
                this.timerCmp.pause();
                break;
        }
    },

    updateStatus: function (data) {
        if (data.issue) {
            this.updateIssue(data.issue);
        }

        if (data.timer) {
            this.timerCmp.update(data.timer);
            this.updateTimer(this.timerCmp.getValue());
        }

        if (data.status) {
            this.proceedShowHideDependencies(data.status);
        }
    },

    updateIssue: function (issue) {
        this.els.issue.innerHTML = "#" + issue;
    },

    updateTimer: function (time) {
        this.els.timer.innerHTML = time;
    }
};

var view = new View({
    template: {
        container: "#container",
        buttons: "#buttons-container",
        start: "#buttons-container a.rm-ext-button.rm-ext-start",
        stop: "#buttons-container a.rm-ext-button.rm-ext-stop",
        pause: "#buttons-container a.rm-ext-button.rm-ext-pause",
        timer: "#timer-container",
        issue: "#issue-container"
    },
    key: "e96d1822f969ca326b0c7bd53bc96152f4986ef8"
});