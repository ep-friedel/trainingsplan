import React from 'react';
import PlanEditor from './PlanEditor.jsx';
import Dialog from './Dialog.jsx';

export default class PlanEditorController extends React.Component {
    constructor(props) {
        let settings = {
            name: '',
            note: '',
            imageUrl: '',
            exercises: []
        }

        super();

        if (props.defaultSettings) {
            settings = Object.assign(settings, props.defaultSettings);
        }

        this.state = {
            settings: settings,
            dialogOptions: {
                showDialog: false,
                hideClose: true,
                text: 'Senden...',
                content: null,
                title: 'Daten übertragen',
                buttons: []
            }
        }
    }

    setProperty(key, value) {
        let newObj = Object.assign({}, this.state.settings);

        newObj[key] = value;

        this.setState({settings: newObj});
    }

    setExerciseProperty(index, key, value) {
        let newObj = Object.assign({}, this.state.settings.exercises[index]),
            exercises = this.state.settings.exercises.concat([]);

        newObj[key] = value;
        exercises[index] = newObj;

        this.setState({settings: Object.assign({}, this.state.settings, {exercises: exercises})});
    }

    savePlan() {
        console.log(this.state);

        let formData  = new FormData(),
            imageUpload;

        formData.append('planImage', this.state.settings.image);
        this.setState(Object.assign({}, this.state, { dialogOptions: Object.assign({}, this.state.dialogOptions, {showDialog: true})}));

        if (this.state.settings.image) {
            imageUpload = fetch('/api/plan/image', {
                method: 'post',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
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
            return fetch('/api/plan', {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                credentials: 'include',
                method: "POST",
                body: JSON.stringify({
                    name: this.state.settings.name,
                    note: this.state.settings.note,
                    imageUrl: this.state.settings.imageUrl,
                    exercises: this.state.settings.exercises,
                    id: (this.state.settings.id ? this.state.settings.id : undefined)
                })
            });
        })
        .then(() => {
            this.setState({ dialogOptions: Object.assign({}, this.state.dialogOptions, {showDialog: false})});
            if (this.props.submitCallback) {
                this.props.submitCallback(this.state.settings);
            }
        })
        .catch((err) => {
            console.log(err);
            this.setState({dialogOptions: Object.assign({}, this.state.dialogOptions, {showDialog: false})});
        });
    }

    render() {
        return (
            <div className="padding">
                <Dialog opts={this.state.dialogOptions}>
                    <div className="row margin-top">
                        <span className="fa fa-fw fa-cog slow-spin fa-3x" />
                    </div>
                </Dialog>
                <PlanEditor defaults={this.state.settings} exercises={this.props.exercises} setProperty={(key, val) => this.setProperty(key, val)}></PlanEditor>
                <button className="fullWidthButton" onClick={() => this.savePlan()}>Save</button>
            </div>
        )
    }
};