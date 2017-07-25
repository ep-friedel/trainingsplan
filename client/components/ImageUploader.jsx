import React from 'react';


export default class ImageUploader extends React.Component {
    constructor(props) {
        super();
        this.state = {
            imageUrl: '',
            fileName: ''
        }
    }

    handleNewFile() {

    }

    render() {
        let id = new Date().getTime().toString().slice(4, -2);

        return (
            <div>
                <h3>{this.props.opts.title ? this.props.opts.title : 'Bild hochladen'}</h3>
                <input type="file" multiple="false" id={'imageUploader:' + id} className="hidden" onChange={(evt) => this.handleNewFile(evt)}/>
                <div className="row">
                    <div class="column imageContainer">
                        <img src={this.state.imageUrl} />
                        <h5></h5>
                    </div>
                    <div class="column">
                        <label htmlFor={'imageUploader:' + id} className="labelButton uploadButtonIcon">{this.state.imageUrl.length ? 'Andere ' : ''}Datei auswählen</label>
                    </div>
                </div>
            </div>
        );
    }
};