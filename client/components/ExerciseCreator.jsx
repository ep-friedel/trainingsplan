import React from 'react';
import DataInput from './DataInput.jsx';
import DataPairInputs from './DataPairInputs.jsx';
import ImageUploader from './ImageUploader.jsx';
import '../css/Exercise.css';

export default class ExerciseCreator extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        return (
            <div>
                <ImageUploader opts={{}}></ImageUploader>
                <DataInput defaultValue="" callback={() => {}} className="" name="Machine" datatype="text" ></DataInput>
                <DataInput defaultValue="" callback={() => {}} className="" name="Name" datatype="text" ></DataInput>
                <DataInput defaultValue="" callback={() => {}} className="" name="Note" datatype="textfield" ></DataInput>
                <h3 className="">Setup</h3>
                <DataPairInputs output={console.log} ></DataPairInputs>
                <button>Speichern</button>
            </div>
        );
    }
};