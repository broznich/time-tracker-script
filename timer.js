var Timer = function (config) {
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
};

var View = function (config) {
    this.container = config.el;

    this.resetStatus();

    this.hideContainer();
    this.clearContainer();

    this.createElements();
    this.attachEvents();
    this.appendElements();

    this.proceedShowHideDependencies();
};

View.prototype = {
    getShowHideConfig: function (codename) {
        var config = {
            base: {
                // default
                // @TODO extend
            },
            stopped: {
                start: true,
                stop: false,
                pause: false,
                timer: false,
                issue: true
            },
            inprogress: {
                start: false,
                stop: true,
                pause: true,
                timer: true,
                issue: true
            },
            paused: {
                start: true,
                stop: true,
                pause: false,
                timer: true,
                issue: true
            }
        };

        return config[codename] || config["base"];
    },

    resetStatus: function () {
        this.status = null;
    },

    createElements: function () {
        var els = {};
        els.loader = this.createLoaderEl();
        els.start = this.createStartButton();
        els.stop = this.createStopButton();
        els.pause = this.createPauseButton();
        els.timer = this.createTimerEl();

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

    showElement: function (el) {
        el.style.display = "initial";
    },

    hideElement: function (el) {
        el.style.display = "none";
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
    }
}

var theme = {
	pause: 	'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABK9JREFUeNrsWktME0EYnn95+ERBfBu1EExM0MBFPaqJjxgfNOq9jd44ITdO1BM3xQs3CQ1XNK2PGF+x8aZeaoyJiQZajRqfgEZgC93ff3YBBW23u8zsbLV/8tOS7j878833f/PP7DJWspKVTJXh+/4m7ir7AJ4M9N3lrfQRpNvtI28mD+S4MkWeJE/QPzHYeDZd1ADg254QY1qbNWhXLRAYRjdsao0WFQD45gIfeCT3TDtukZhhRGBze9TXAODrLqI69FlUlwItpQaGYUtH2ncAYKqzhWadD75asqKMEBvCEDgf9w0AONQRsmbe0zUkDHVdUeUA4OC5kDXzKoyYUH8xqgwAfNVKtIeY4moiCA09cc8BwJdnuOAl5ed8IZqAzbCt15Uwlrtnn97HQPXgTatmiDwF93vGAHxxWoHoFSCK2wei3jAA9YjNFUmzEAIYmRuH1bygoW/NguO48d+j0hmAzw8WMvtBaLwT/3v8oRZe5wuO+8WCxrtRuQxAvc0W1R0P86jyZIJhVmjcb9bmlAWOGIDPdpHyaynbRnc+gvzt7EGRcfPUOQA7n6TlMMDQg0KKR2NCYhxSH9klOQCgLmaTgxMy4/bJA8CYaCaFFgCALi8O0dHZg0MGZAIMBTDA0GXGBSQCMMGKIAXkFEL4eEmT65nzlgFmX2H3+FOxDMApgVXrpLdxeUwruGDYM/mUIQlgIW47EMFx89zsqwwNQEPMCZrbdkTdfwEiCCmnKptzJuXFpeQBYPADEAEAuJ3JwuKSUjTAmgGWMOsAO7dvR2zcXE9IBABiPA/tvJBcFhk3pw10dkbpCABt71iabpD08SqQNPsojQFWJ7rtOpK9v7wlV7j5m+C437xb+omQ2Zl7VUM2YshPiyNlB77Ff8WsWGnt1NDmSMxVnKn+ZQe+13kCwNTdFSH66GP+snD5wW9RTwAwQbi98sH03tsPlig/POrqWNz9cwEGYVpy+Jqr+tnACE1j2PUoFnLnqVs1JExM7aMxYMHyI8NxJQCYINxcFUJFegA8749+VfdwdMYmb9SqEMVwxbEv6h+Pz4JwvZanQ58HmmDmfMXxL/55QWIWhGurt06DIGt1SJiDP/HZf6/IzAEitiZEQESE7BxntrjAIhXBT/5+SWq+Za6u5drQZlPB2W1tuytPfiyu1+T+AOLKuukXJSk10AQjkGemkybVGYtVnvqQZv+yZQbWN3Fn/6Ph+/6l3FX3Q3oK4LvLldbSCFXkS8gX5bhSJx8n/86XOth4NlPUAODbnhrGtDXWoF21QGAYn2BT63BRAYBvLtD+XVtLTVcKapGYYHyEze2jvgYAX3fRzhI2kEvKaxzjygFbOqZ8BwCmOmnQ2jpqTpOsKAax4QMEzo/5BgAc6lhGzaz2eA35DHVdP5QDgIPnSOC0VWoWMOMr1F8cVwYAvmolkYMaxdXEMDT0ZDwHAF+eoVwHUnsAxQAg+Shs6zXctuDuTNDQF9PYs8wPhriY/o55xgB8cbosdzWnDAUdtg9kvWEA6nypy7cWEy217B/ZwdnKjLI8oLuN48b7lJXOAHx+iBWw1hvQeDtH/OGZzoqMm60RoPEOK1nJSubIfgowAHNQTn0Y3MjOAAAAAElFTkSuQmCC',
	stop:	'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABJlJREFUeNrsWklMFEEUrd/AiDuL4hZ1MJKQIIGLy01MAGNcmKj3meiNE3Dj5HDihnjhhmHiFc3gEqNinHhyuYwxJCYamdGoUUFAI9AD099fPUDiAlPddnX16Pzkz5JUann1/vu/qpuxvOUtb6oMP1yp465yDuDKQt/376avAA3XQF5P7l+mZYI8Th6jP1HYfj6Z0wDgu74gY1pbZtG2eiAwjF7Y0RrJKQDwbQ9feHj5nbbcIzHDCMPOjoinAcA33UR1GMhQXQq0FBoYgl2dSc8BgIkLLbTrfPElkhVlktgQAn/XkGcAwNHOYGbnXc0hIajsjigHAF+3BzM7r8KICXsuRpQBgK9aifYQVVxNBGBv35DrAODLc1zw4vJjXkQTsB6qLtsSxkL77NMHGKhevGklDJGH4BHXGIAvzioQPQFRrB6MuMMA1MMCreJmMQQw+XfrwhJeBNGvbNUkbxORzgAcaRLd/QDU3HUkV+NIcws/GwixoOZeRC4DUG8TQnbfwyHn6D0XY5gWadhmlQWWGIDP95PyawmhjmsfO1tmPz+Igursh9qnSTkMMPSASyfoP4w9K1wX0MclOQCg3sBUGYoCwBrkAWDM1pOqKwJAF80alu4eLDIg5WeoiAGGLtrSLxGAWZYDISCnEMInq+ss7IJKBphzhQMzz5xlAM4rrnTnpHRrrQ545BNWADiUcrYOkDS2JQ1AA9QRQNLYFkUQElZV1jkEhAFIyAPA4BcgigAQZ0DcSreatV1gMbMOEHHHGSDsMYkAQJTHoojL0AChcdHaHaUlALTD00kaIG7GYzaXoQHZPW7OURoDMhPpFZlM+v66FqfWbvYlBkCv9Bshc0LD60cFxJDfGIcLGr/avhhJD2/YmDndYZhlvxJLFDR+q3QFgPl7G4L0NcC8ZaHCpq8RVwAwQbiz8cHC2dsLFis8OmXrWtz+cwEGIUo5POeqfjYwSdsYcuUs8BsLbpeSODG1j8aABQqPTQwpAcAE4VZZEBXpAfC4P/5F3cPRRZu7Wa5CFENFJ8bVPx5fAuFGOQ+HARc0wYz5opPj3nlBYgmE65t2L4AgKzvEzMWfGvPeKzI/ARHdHCQgwg6eHBM003BR4LO3X5L61VLXKrg2tAlUcSsdbXt9pz/l1mtyvwFxdcvCi5IUGmiC4V9hp+Mm1RmL+s58TLJ/2VKDW+u4s//R8MOVNdxVz0N6COD7fl8mNcJ68tXkq5ZpqZPPkH/jqQ62n0/lNAD4rq+UMW1zZtG2eiAwjM+wo3UipwDAtz10htcqqGufQz0SE4xPsLNjytMA4JtuOlnCNnJJcY3TXDlgV+e85wDAxAVatLaFutMkK4pBbPgI/q5pzwCAo51rqZtNLueQMajs/q4cAHzdTgKnlalJYMYX2HNxRhkA+KqVRA5KFVcTE7C3L+U6APjyHMU6kNoDKAYAyaeg6rJhtwd7d4KGXkxrTzMvGGIxfU67xgB8cbZg+WpOGQo6VA+m3WEA6jzVZcvFRE0t/dcRwhnOjAKBjeJzSktnAI40M8Fcb0DNHWf2duTo4gKz1ghQc5flLW95s2Q/BBgA75XqL8/21I0AAAAASUVORK5CYII=',
	start:	'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABXhJREFUeNrsWk1sE1cQfmM7TiBNnfBboIATgZoqhRi1RZwaI/VHUUuwWiSOXsEtlzrccoo55QbuJTdQLE4VaeWUVhXQCouqLaUFjCgEBCIOCCJ+Q4RIsIl3Om/tRoLEzr71vt1165EmVqTdmTffm9+3j7EqValKdhGOH2nnbOcawBJD7x5aTz8hUhckDhD7izyZJk4RJ+mfBKzeO1bRAOCdgTBjrkjeaEMSCAw1Bmu64xUFAN4+wA2PFt9pYYnkGWoU1u6LOxoAvNVPrg6DeVeXAi2FBiqwrnfMcQBgum8n7To3vlFyRnlC3qCAf/+wYwDA0d5wfuctrSEKNPfHbQcAb/aE8ztvB5EntByM2wYA3ugmt4eEzd1ECDYMDFsOAF7fwxNeSn7M68kJGICNhw0lRo9x78sMMtBlfIiBO8VQjfHdkoBAI0PkIbjdMg/Aq7t0Jz1oPTqrA6/t7iAg+Ht+CZ6gQOtQ3BoARnaM6jUC3j4Gc9/v6qO/EW33zKM06WqWDgBe/kio5EHbiXl14JVOH29zyX0VU72g7WRcLgB/f3CBfnT39vDOaSgNaLAjnx9YwAQEUqRvizQA8NL7lPldaSEFm/4AfbK3fUl/o+WHheqHTX/qrgguwcwfYupzJsS6gTrzFcMXfoaZmLCOlzgjVGnEAMBMkCEpEWERb9l8fhI2p3oYywZIV1JYl8YZoUFMrA9Qnweo9ss/pWkfucjrOl5oCfMxWKhsIgbk5YBzq1DYmHfHy2u3z7/poyQZKeQH03WKAfBXkzgA702YM3GeW7aeYY6X36CZOnU/iGcXted7f0EAtk6Ze+hytp5Xi9gCTwVg6/RFc3MAzjBHEGbNzTdCus94xUNgW9acEPi9lnoQGnpARwgI6BSqAqiC5Ruu/lZLLTOLILKotl9ornyxMoiQljPJFTH+17ow0wwX0pmWB4CqJUHpAKi/8ITLqCNc2N3nmwckegBLagccsgw/vZi7e5SamUgZYpIyQyBBsRiTYXwuWR9GVStvjeUcVVKjKnRGKawpd6peaBx2b38GpeW91lGo66aMw6RvizwPyHsBX+xg2Tv+c4NPMxyZYuL3GWHvNKQ591OD7iMx94dPYZ73+3hpM/tIjHQJH4kZOhVGhKgRL5g5+XoHf4/yiIxKEjWUM4xqmznuO6VnMMlXDV4+tTiXVUGSnk8mDR2LG/8uwECh+E3pcONEmVgvRE9ItGLJLDDHC35s2kkg2PtpDFjI0zkxbAsAGgg/LAmjCVXB4OIVz6eP7fs4+i+9+H5pmFkPglLz2SP7P4/PgnBsKQ+HQZNLW9GYr9nxyDkXJGZB+I4fW2kgBCUZn9SM73rovCsyLwGRWG5kjC094gKL1oQeOPuS1KuU/XZFuNDxGe3zeZmNeT+/X1nX5OYA8c3KwkVJCg3UwPCX2OlUYaRNeL+4N8b+y5QdeqOdM/s/Eo4fWczZ7nVIDwG8e8hbOORoIF5EXFvkyQzxNPFTXupg9d5sRQOAdwaaGHMtzxttSAKBoT6ANd0TFQUA3j7gI8NXkGivSRLJE9T7sHbfpKMBwFv9NFnCKmJJcY1TPHPAut4ZxwGA6T4y2rWSxLkkZxSVvOEe+PdPOQYAHO2tJzHLLK4hD6G5/5ntAODNHkpwriX2FDD1MbQcnLYNALzRTUkOmmzuJiZgw0DWcgDw+h6KdfAxK+7LlF4JEk/CxsOqUQnGzgTVTB3ZntPx5BQDt0q5q44W6pGEQZ2mxyoPwKu73MW7uVeEtx6dXRhe2+0mILxymi/MQOtQzhoPwAwvdcK1GN76mi9wGke6CEB0m4wAX1NOugfg5Y+ZSK2HtuPzxiZe6eRx5DL3sgOq0HaCValKVRKifwQYAN8WR5MZXYLnAAAAAElFTkSuQmCC',
    loader: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALPSURBVDjLjZNbSFNxHMcXm+BDBEFBvgRS9CBFrxJRoUlPs4ceJMiHsIshSTdSi7AI1K6KOfOSaZgXQmyic5u3TJ3zNue8TEvP5tl0czed7uy+nW//DV3ajQ58D+fh9/nwP/8fX85s9e1okkySVhKKhCEJqspvYKjoEnrykoOtD08zjbeOU++vxbYKUvdlFqbsjgbACYVDhgcWxfkwDApgVlbBOvUBFlUNVkYqsdxXCl1HIaiWfEzX5mCg6DKas0+BCAYiAnXtA9WWwKSoJHkHo7wcS18FWJS8BiV8htmGJ1BW3kXfy9SwoCg1RhURyCbpOIWsFwviCszUP8KIIA09+edBjg1ybFRfP4SytIOoyDiKhqcXUFFSgJI6cVxEEHr1zPskCr0XVocfbh8Lj5+FzRnAjMGNMdoFrdULyuJF27gFJe1ayRYcEYQiVbs+S9VOdpEMM54gDHY/Zo0eaAgo+76Bt1Id+0akbd4O7xCEIlSux7co7dQw5YBu1ReG2ydsKJXS88UiTfyv8G+CrdQPmvvHaQZjWgcEErrvTzP/FDQOmuQTegYKIihu0/T/t6BeZjohHDXTkzoHbEwAxnU/RGMmFDTNLYjTE0p7+XvorgQeK03i6kiydwhq+1eETUMmVmN2hzfhDbDYcAehs/nQXfYCynsn4Ra9AquWwNl4B6MZxwIdibybYbimzyjtnLJh2e6D0xuEj8CBIAuGfCv1LnRdPAwXgVHMB7L2AnmxsDw/A+lZrobT0DkVV9dvQK96DeYNfxgmbFhgdwXwbcWDrsQosIrQBn8+a7kHEPqdcBempWUYkMsgn7NCb3Fh3UlWaHSg/osWjz9OoCU5BkxVGkAgz30OVknodC7IPSztKNPfuqDI5WP46hEYsmJhzokCdWUXuvm8gCSJ+4Czvc6kwhSpMLNZ4XAXSIWDpMLMp5T9NtE5nnNzC0shOHR/PwBGKPcL7gZY5gAAAABJRU5ErkJggg=='
};

if(timerEl){
    var timer = new Timer({
        el: 	document.querySelector('#account ul li:first-child'),
        theme:		theme,
        key: "e96d1822f969ca326b0c7bd53bc96152f4986ef8"
    });
}
