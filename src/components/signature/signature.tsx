import { Component, Host, h, Prop } from '@stencil/core';
import SignaturePad from "signature_pad";
import * as blobUtil from 'blob-util';

@Component({
  tag: 'rfk-signature',
  styleUrl: 'signature.css',
  shadow: true
})
export class Signature {

  @Prop() fieldName;


  signaturePad: any;

  canvasElement: HTMLCanvasElement;
  signaturePadElement: HTMLDivElement;

  render() {
    return (
      <Host>

        <div id="signature-pad" class="signature-pad" ref={(el) => this.signaturePadElement = el as HTMLDivElement}>
          <div class="signature-pad--header">
            <div class="signature-pad--actions">
              <ion-button onClick={_ => this.clearSignature()}>
                Clear
              </ion-button>
              <ion-button onClick={_ => this.saveSignature()}>
                Save
            </ion-button>
            </div>
          </div>
          <div class="signature-pad--body">
            <canvas ref={(el) => this.canvasElement = el as HTMLCanvasElement}></canvas>
          </div>
        </div>
      </Host>
    );
  }

  resizeCanvas() {
    console.log("resize");
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.canvasElement.width = this.canvasElement.offsetWidth * ratio;

    this.canvasElement.height = this.canvasElement.offsetHeight * ratio;
    this.canvasElement.getContext("2d").scale(ratio, ratio);
    this.signaturePad.clear();
  }

  clearSignature() {
    this.signaturePad.clear();
  }

  saveSignature() {
    const dataUrl = this.signaturePad.toDataURL();
    const file = blobUtil.dataURLToBlob(dataUrl);
    let ev = new CustomEvent('attachment-changed',
      { detail: { property : this.fieldName, value: file } });
    window.dispatchEvent(ev);
  }

  componentDidLoad() {
    this.signaturePad = new SignaturePad(this.canvasElement);
    this.resizeCanvas();
  }
}