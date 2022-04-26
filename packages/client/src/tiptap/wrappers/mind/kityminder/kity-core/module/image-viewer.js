define(function(require, exports, module) {

    var kity = require('../core/kity');
    var keymap = require('../core/keymap');

    var Module = require('../core/module');
    var Command = require('../core/command');

    Module.register('ImageViewer', function() {

        function createEl(name, classNames, children) {
            var el = document.createElement(name);
            addClass(el, classNames);
            children && children.length && children.forEach(function (child) {
                el.appendChild(child);
            });
            return el;
        }

        function on(el, event, handler) {
            el.addEventListener(event, handler);
        }

        function addClass(el, classNames) {
            classNames && classNames.split(' ').forEach(function (className) {
                el.classList.add(className);
            });
        }

        function removeClass(el, classNames) {
            classNames && classNames.split(' ').forEach(function (className) {
                el.classList.remove(className);
            });
        }

        var ImageViewer = kity.createClass('ImageViewer', {
            constructor: function () {
                var btnClose = createEl('button', 'km-image-viewer-btn km-image-viewer-close');
                var btnSource = createEl('button', 'km-image-viewer-btn km-image-viewer-source');
                var image = this.image = createEl('img');
                var toolbar = this.toolbar = createEl('div', 'km-image-viewer-toolbar', [btnSource, btnClose]);
                var container = createEl('div', 'km-image-viewer-container', [image]);
                var viewer = this.viewer = createEl('div', 'km-image-viewer', [toolbar, container]);
                this.hotkeyHandler = this.hotkeyHandler.bind(this)
                on(btnClose, 'click', this.close.bind(this));
                on(btnSource, 'click', this.viewSource.bind(this));
                on(image, 'click', this.zoomImage.bind(this));
                on(viewer, 'contextmenu', this.toggleToolbar.bind(this));
                on(document, 'keydown', this.hotkeyHandler);
            },
            dispose: function () {
                this.close();
                document.removeEventListener('remove', this.hotkeyHandler);
            },
            hotkeyHandler: function (e) {
                if (!this.actived) {
                    return;
                }
                if (e.keyCode === keymap['esc']) {
                    this.close();
                }
            },
            toggleToolbar: function (e) {
                e && e.preventDefault();
                this.toolbar.classList.toggle('hidden');
            },
            zoomImage: function (restore) {
                var image = this.image;
                if (typeof restore === 'boolean') {
                    restore && addClass(image, 'limited');
                }
                else {
                    image.classList.toggle('limited');
                }
            },
            viewSource: function (src) {
                window.open(this.image.src);
            },
            open: function (src) {
                var input = document.querySelector('input');
                if (input) {
                    input.focus();
                    input.blur();
                }
                this.image.src = src;
                this.zoomImage(true);
                document.body.appendChild(this.viewer);
                this.actived = true;
            },
            close: function () {
                this.image.src = '';
                document.body.removeChild(this.viewer);
                this.actived = false;
            }
        });

        return {
            init: function() {
                this.viewer = new ImageViewer();
            },
            events: {
                'normal.dblclick': function(e) {
                    var shape = e.kityEvent.targetShape
                    if (shape.__KityClassName === 'Image' && shape.url) {
                        this.viewer.open(shape.url);
                    }
                }
            }
        };
    });
});