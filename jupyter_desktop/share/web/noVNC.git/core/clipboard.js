export default class Clipboard {
    constructor(target) {
        this._target = target;

        this._eventHandlers = {
            'copy': this._handleCopy.bind(this),
            'paste': this._handlePaste.bind(this)
        };

        // ===== EVENT HANDLERS =====

        this.onpaste = () => {};
    }

    // ===== PRIVATE METHODS =====

    async _handleCopy(e) {
        try {
            if (navigator.permissions && navigator.permissions.query) {
                const permission = await navigator.permissions.query({ name: "clipboard-write", allowWithoutGesture: false });
                if (permission.state === 'denied') return;
            }
        } catch (err) {
            // Some browsers might error due to lack of support, e.g. Firefox.
        }

        if (navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(e.clipboardData.getData('text/plain'));
            } catch (e) {
                /* Do nothing */
            }
        }
    }

    async _handlePaste(e) {
        try {
            if (navigator.permissions && navigator.permissions.query) {
                const permission = await navigator.permissions.query({ name: "clipboard-read", allowWithoutGesture: false });
                if (permission.state === 'denied') return;
            }
        } catch (err) {
            // Some browsers might error due to lack of support, e.g. Firefox.
        }

        let data;
        if (navigator.clipboard.readText) {
            try {
                data = await navigator.clipboard.readText();
            } catch (e) {
                /* Do nothing */
                return;
            }
        } else if (e.clipboardData) {
            data = e.clipboardData.getData('text/plain');
        }
        this.onpaste(data);
    }

    // ===== PUBLIC METHODS =====

    grab() {
        if (!Clipboard.isSupported) return;
        this._target.addEventListener('copy', this._eventHandlers.copy);
        this._target.addEventListener('paste', this._eventHandlers.paste);
    }

    ungrab() {
        if (!Clipboard.isSupported) return;
        this._target.removeEventListener('copy', this._eventHandlers.copy);
        this._target.removeEventListener('paste', this._eventHandlers.paste);
    }
}

Clipboard.isSupported = (navigator && navigator.clipboard) ? true : false;
