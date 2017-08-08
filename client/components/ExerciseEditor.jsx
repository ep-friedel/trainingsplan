import React from 'react';
import DataInput from './DataInput.jsx';
import DataTextArea from './DataTextArea.jsx';
import DataPairInputs from './DataPairInputs.jsx';
import ImageUploader from './ImageUploader.jsx';
import '../css/Exercise.css';

export default class ExerciseEditor extends React.Component {
    /*
        setProperty: function to set property on settings object
        handleSubmit: cb on submit
        defaults: {
            machine
            name
            note
            imageUrl
            setup: {
                key
                val
            }
        }

    */
    constructor(props) {
        super();
    }

    render() {
        let key,
            array = [];

        for (key in this.props.defaults.setup) {
            array.push({key: key, val: this.props.defaults.setup[key]});
        }
        
        return (
            <div className="column padding">
                <div className="row">
                    <div className="column margin-right">
                        <DataInput defaultValue={this.props.defaults.machine} callback={machine => this.props.setProperty('machine', machine)} className="" name="Machine" datatype="text" ></DataInput>
                        <DataInput defaultValue={this.props.defaults.name} callback={name => this.props.setProperty('name', name)} className="" name="Name" datatype="text" ></DataInput>
                    </div>
                    <ImageUploader callback={image => this.props.setProperty('image', image)} opts={{imageUrl: this.props.defaults.imageUrl}}></ImageUploader>
                </div>
                <DataTextArea defaultValue={this.props.defaults.note} callback={note => this.props.setProperty('note', note)} className="" name="Note" datatype="textfield" ></DataTextArea>
                <h3 className="">Setup</h3>
                <DataPairInputs limit={5} output={setup => this.props.setProperty('setup', setup)} titleCol1="Einstellung" titleCol2="Art" col1type='text' col2type='select' col2options={[{value: 'text', name: 'Freitext'}, {value: 'number', name: 'Zahl'}]} array={array}></DataPairInputs>
                <label className="labelButton" onClick={() => this.props.handleSubmit()} >Speichern</label>
                {(this.props.children ? this.props.children : null)}
            </div>
        );
    }
};