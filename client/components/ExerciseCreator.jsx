import React from 'react';
import DataInput from './DataInput.jsx';
import DataPairInputs from './DataPairInputs.jsx';
import ImageUploader from './ImageUploader.jsx';
import '../css/Exercise.css';

export default class ExerciseCreator extends React.Component {
    constructor(props) {
        super();
        this.state = {
            machine: '',
            name: '',
            note: '',
            imageUrl: '',
            setup: {},
            image: ''
        }
    }

    handleSubmit() {
        let formData  = new FormData();

        formData.append('exerciseImage', this.state.image);

        fetch('/api/exercise/image', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*'
            },
            body: formData
        })
        .then(res => res.json())
        .then(resp => {
            return new Promise((resolve, reject) => this.setState({
                imageUrl: resp.url
            }, resolve));
        })
        .then(() => {
            return fetch('/api/exercise', {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    machine: this.state.machine,
                    name: this.state.name,
                    note: this.state.note,
                    imageUrl: this.state.imageUrl,
                    setup: this.state.setup
                })
            });
        });
    }

    setProperty(key, value) {
        let newObj = Object.assign({}, this.state);

        newObj[key] = value;

        this.setState(newObj, () => {
            console.log(this.state);
        });
    }

    render() {
        return (
            <div className="column padding">
                <div className="row">
                    <div className="column margin-right">
                        <DataInput defaultValue="" callback={machine => this.setProperty('machine', machine)} className="" name="Machine" datatype="text" ></DataInput>
                        <DataInput defaultValue="" callback={name => this.setProperty('name', name)} className="" name="Name" datatype="text" ></DataInput>
                        <DataInput defaultValue="" callback={note => this.setProperty('note', note)} className="" name="Note" datatype="textfield" ></DataInput>
                    </div>
                    <ImageUploader callback={image => this.setProperty('image', image)} opts={{}}></ImageUploader>
                </div>
                <h3 className="">Setup</h3>
                <DataPairInputs limit={3} output={setup => this.setProperty('setup', setup)} titleCol1="Einstellung" titleCol2="Art" col1type='text' col2type='select' col2options={[{value: 'text', name: 'Freitext'}, {value: 'number', name: 'Zahl'}]} array={[{key: '', val: 'number'}]}></DataPairInputs>
                <label className="labelButton" onClick={() => this.handleSubmit()} >Speichern</label>
            </div>
        );
    }
};