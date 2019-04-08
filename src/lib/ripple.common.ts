import { Color } from "tns-core-modules/color";
import { addWeakEventListener } from "tns-core-modules/ui/core/weak-event-listener/weak-event-listener";
import { View } from "tns-core-modules/ui/page/page";
import { Length } from "tns-core-modules/ui/styling/style-properties";

export class RippleCommon {
    protected tnsView: WeakRef<View>;
    protected effectiveColor: Color = new Color("#000000");
    protected _rippleColor: string | Color;
    protected _rippleColorAlpha: number | null | undefined;
    protected _enabled: boolean = true;
    protected rippleApplied: boolean = false;
    protected _rippleLayer: "background" | "foreground" | "auto";
    protected initialized = false;

    get enabled() {
        return this._enabled;
    }
    set enabled(v: boolean) {
        this._enabled = !!v;
        this.refreshRippleState();
    }

    get rippleLayer(): "background" | "foreground" | "auto" {
        return this._rippleLayer;
    }
    set rippleLayer(layer: "background" | "foreground" | "auto") {
        /* */
    }
    get color(): string | Color {
        return this._rippleColor;
    }
    set color(v: string | Color) {
        this._rippleColor = v;
        this.invalidateColor();
    }

    set alpha(v: number | null | undefined) {
        this._rippleColorAlpha = v;
        this.invalidateColor();
    }
    get alpha(): number | null | undefined {
        return this._rippleColorAlpha;
    }

    constructor(tnsView: View) {
        this.tnsView = new WeakRef(tnsView);
    }

    init() {
        this.initialized = true;
        this.bindEvents();
        this.refreshRippleState();
    }

    dispose() {
        /* */
    }

    refreshRippleState() {
        if (!this.initialized) { return; }
        if (this.enabled) {
            this.rippleApplied = this.apply();
        } else {
            this.rippleApplied = !this.remove();
        }
    }

    protected apply(): boolean {
        return false;
    }

    protected remove(): boolean {
        return false;
    }

    private invalidateColor() {
        let c: Color;
        if (this._rippleColor) {
            if (this._rippleColor instanceof Color) {
                c = this._rippleColor;
            } else {
                c = new Color(this._rippleColor);
            }
        } else {
            c = new Color("#000000");
        }
        let alpha = 0.25;
        if (this.alpha !== null && this.alpha !== undefined) {
            alpha = +this.alpha;
        }
        c = new Color(c.a * alpha, c.r, c.g, c.b);
        this.effectiveColor = c;
        this.refreshRippleColor();
    }

    protected refreshRippleColor() {
        /* */
    }

    protected onLoaded() {
        /** */
    }

    protected onUnloaded() {
        /** */
    }
    private bindEvents() {
        const tnsView = this.tnsView.get();
        if (tnsView) {
            addWeakEventListener(tnsView, View.loadedEvent, this.onLoaded, this);
            addWeakEventListener(tnsView, View.unloadedEvent, this.onUnloaded, this);
            // in some cases, the element is already loaded by time of binding
            if (tnsView.isLoaded) {
                this.onLoaded();
            }
        }
    }
}
