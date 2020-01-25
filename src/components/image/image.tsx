import { Component, Element, h, Prop } from '@stencil/core';
import * as blobUtil from 'blob-util';

const MAX_UPLOAD_SIZE = 1024; // bytes
const ALLOWED_FILE_TYPES = 'image.*';

@Component({
  tag: 'rfkode-image',
  styleUrl: 'image.css',
  shadow: true
})
export class Image {

  @Prop() fieldName;
  @Prop() value;


  fileInput: HTMLInputElement;

  @Element() private elementHost: HTMLElement;

  componentDidLoad() {
    if(this.value){
      const imagePreviewContainer: HTMLElement = this.elementHost.shadowRoot.querySelector('#image-preview');
      console.log("Blob Value: " + this.value);
      const url = URL.createObjectURL(blobUtil.base64StringToBlob(this.value));
      imagePreviewContainer.style.backgroundImage = `url(${url})`;
    }
  }

  public onInputChange(files: FileList) {
    // check if 1 image is uploaded
    if (files.length === 1) {
      const imageFile = files[0];
      // check if the user isn't trying to upload a file larger then the MAX_UPLOAD_SIZE
      if (!this.checkFileSize(imageFile.size)) {
        console.error('Maximum file size exceeded. Max file size is: ' + MAX_UPLOAD_SIZE);
        return false;
      }
      // check if the user isn't trying to upload anything else then an image
      else if (!this.checkFileType(imageFile.type)) {
        console.error('File type is not allowed');
        return false;
      }
      // upload image
      this.uploadImage(imageFile);
    }else{
      console.error(files.length === 0 ? 'NO IMAGE UPLOADED' : 'YOU CAN ONLY UPLOAD ONE IMAGE AT THE TIME');
      return false;
    }
  }

  private uploadImage(file : any) {
    // create a new instance of HTML5 FileReader api to handle uploading
    const reader = new FileReader();

    reader.onloadstart = () => {
      console.log('started uploading');
    }

    reader.onload = () => {
      const   imagePreviewContainer: HTMLElement = this.elementHost.shadowRoot.querySelector('#image-preview');
      imagePreviewContainer.style.backgroundImage = `url(${reader.result})`;

      console.log('uploading finished, emitting an image blob to the outside world');

      let ev = new CustomEvent('attachment-changed',
      { detail: { property : this.fieldName, value: file } });
      window.dispatchEvent(ev);
    };

    reader.onloadend = () => {
      console.log('upload finished');
    };

    reader.onerror = (err) => {
      console.error('something went wrong...', err);
    };
    reader.readAsDataURL(file);
  }

  private checkFileSize(size: number): boolean {
    return (size / MAX_UPLOAD_SIZE / MAX_UPLOAD_SIZE) <= MAX_UPLOAD_SIZE;
  }

  private checkFileType(type: string): boolean {
    return type.match(ALLOWED_FILE_TYPES).length > 0;
  }

  render() {
    return <div class="image-upload">
      <div class="image-upload__edit">
        <label htmlFor="file"></label>
        <input type="file" name="files[]" id="file" accept="image/*" class="image-upload__input"
          onChange={($event: any) => this.onInputChange($event.target.files)} />
      </div>

      <div class="image-upload__preview">
        <div id="image-preview"></div>
      </div>
    </div>;
  }
}