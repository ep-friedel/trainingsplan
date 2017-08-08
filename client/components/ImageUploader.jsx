import React from 'react';
import '../css/ImageUploader.css';

function resize(file, maxDimensions) {
    return new Promise((resolve, reject) => {
        let maxWidth  = maxDimensions.width,
            maxHeight = maxDimensions.height;

        if (!file.type.match(/image.*/)) {
            return reject();
        }

        let image = document.createElement('img');

        image.onload = (imgEvt) => {
            let width  = image.width,
                height = image.height,
                isTooLarge = false;

            if (width >= height && width > maxDimensions.width) {
                height *= maxDimensions.width / width;
                width = maxDimensions.width;
                isTooLarge = true;
            } else if (height > maxDimensions.height) {
                width *= maxDimensions.height / height;
                height = maxDimensions.height;
                isTooLarge = true;
            }

            if (!isTooLarge) {
                return resolve(file);
            }

            let canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            let ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, width, height);

            canvas.toBlob((blob) => {
                resolve(new File([blob], file.name, {type: file.type}));
            }, file.type);
        };

        image.src = URL.createObjectURL(file);
    })
}

export default class ImageUploader extends React.Component {
    constructor(props) {
        super();
        this.state = {
            imageUrl: props.opts.imageUrl ? props.opts.imageUrl : '',
            fileName: ''
        }
    }

    handleNewFile(evt) {
        let reader = new FileReader(),
            input = evt.target;

        resize(input.files[0], {width: 1000, height: 1000})
            .then(file => {
                let objectUrl = URL.createObjectURL(file);
                this.setState({
                    imageUrl: objectUrl
                });

                this.props.callback(file, objectUrl);
            });

    }

    render() {
        let id = new Date().getTime().toString().slice(4, -2);

        return (
            <div>
                <h3>{this.props.opts.title ? this.props.opts.title : 'Bild hochladen'}</h3>
                <input type="file" name="exerciseImage" id={'imageUploader:' + id} className="hidden" onChange={(evt) => this.handleNewFile(evt)}/>
                <div className="column alignCenter">
                    <div className={(this.state.imageUrl.length ? '' : 'fa-picture-o ') + 'column imageContainer fa'}>
                        <img src={this.state.imageUrl} />
                        <h5></h5>
                    </div>
                    <label htmlFor={'imageUploader:' + id} className="labelButton uploadButtonIcon fa fa-upload margin-top">{this.state.imageUrl.length ? 'Andere ' : ''}Datei auswählen</label>
                </div>
            </div>
        );
    }
};