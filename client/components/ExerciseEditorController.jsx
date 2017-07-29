import React from 'react';
import ExerciseEditor from './ExerciseEditor.jsx';
import Dialog from './Dialog.jsx';

export default class ExerciseEditorController extends React.Component {
    constructor(props) {
        super();
        let settings = {
                machine: '',
                name: '',
                note: '',
                imageUrl: '',
                setup: {},
                image: ''
            };

        if (props.defaultSettings) {
            settings = Object.assign(settings, props.defaultSettings);
        }

        this.state = {
            settings: settings,
            dialogOptions: {
                showDialog: false,
                hideClose: true,
                text: 'Submitting...',
                content: null,
                title: 'Submitting Data...',
                buttons: []
            }
        };
    }

    handleSubmit() {
        let formData  = new FormData(),
            imageUpload;

        formData.append('exerciseImage', this.state.settings.image);
        this.setState(Object.assign({}, this.state, { dialogOptions: Object.assign({}, this.state.dialogOptions, {showDialog: true})}));
        
        if (this.state.settings.image) {
            imageUpload = fetch('/api/exercise/image', {
                method: 'post',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json, application/xml, text/plain, text/html, *.*'
                },
                body: formData
            })
            .then(res => res.json())
            .then(resp => {
                return new Promise((resolve, reject) => this.setState({settings: Object.assign({}, this.state.settings, {
                    imageUrl: resp.url
                })}, resolve));
            });
        } else {
            imageUpload = Promise.resolve();
        }
        
        imageUpload.then(() => {
            return fetch('/api/exercise', {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                credentials: 'include',
                method: "POST",
                body: JSON.stringify({
                    machine: this.state.settings.machine,
                    name: this.state.settings.name,
                    note: this.state.settings.note,
                    imageUrl: this.state.settings.imageUrl,
                    setup: this.state.settings.setup
                })
            });
        })
        .then(() => {
            this.setState({ dialogOptions: Object.assign({}, this.state.dialogOptions, {showDialog: false})});
        })
        .catch((err) => {
            console.log(err);
            this.setState({dialogOptions: Object.assign({}, this.state.dialogOptions, {showDialog: false})});
        });
    }

    setProperty(key, value) {
        let newObj = Object.assign({}, this.state.settings);

        newObj[key] = value;

        this.setState({settings: newObj});
    }

    render() {
        if (!this.props.show) {
            return null;
        }

        return (
            <ExerciseEditor setProperty={(key, val) => this.setProperty(key, val)} handleSubmit={() => this.handleSubmit()} defaults={this.state.settings}>
                <Dialog opts={this.state.dialogOptions}>
                    <div className="row margin-top">
                        <span className="fa fa-fw fa-cog slow-spin fa-3x" />
                    </div>
                </Dialog>
            </ExerciseEditor>
        )
    }
};