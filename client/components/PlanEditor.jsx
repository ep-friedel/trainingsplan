import React from 'react';
import ExerciseSelectionListController from './ExerciseSelectionListController.jsx';
import Dialog from './Dialog.jsx';
import DataInput from './DataInput.jsx';
import ImageUploader from './ImageUploader.jsx';
import DataTextArea from './DataTextArea.jsx';
import DataPairInputs from './DataPairInputs.jsx';

export default class PlanEditor extends React.Component {
    constructor(props) {
        super();

        this.state = {
            showDialog: false,
            hideClose: false,
            close: () => this.toggleModal(false),
            text: 'Bitte Übungen für den Trainingsplan auswählen:',
            content: null,
            title: 'Übungsliste',
            buttons: [{
                name: "Übernehmen",
                click: () => this.saveSelection()
            }, {
                name: "Schließen",
                click: () => this.toggleModal(false)
            }],

            exercises: []
        };
    }

    toggleModal(forceOpen) {
        this.setState({
            showDialog: (forceOpen !== undefined) ? forceOpen : !this.state.showDialog
        });
    }

    saveSelection() {
        this.props.setProperty('exercises', this.state.exercises);
        this.toggleModal(false);
    }

    render() {
        return (
            <div className="padding">
                <div className="row">
                    <div className="column">
                        <DataInput defaultValue={this.props.defaults.name} callback={name => this.props.setProperty('name', name)} className="" name="Name" datatype="text" ></DataInput>
                        <DataTextArea defaultValue={this.props.defaults.note} callback={note => this.props.setProperty('note', note)} className="" name="Note" datatype="textfield" ></DataTextArea>
                    </div>
                    <ImageUploader callback={image => this.props.setProperty('image', image)} opts={{imageUrl: this.props.defaults.imageUrl}}></ImageUploader>
                </div>
                <div>
                    <h3>Übungsverwaltung</h3>
                    <button onClick={() => this.toggleModal(true)} >Übung hinzufügen</button>
                    {this.props.defaults.exercises.map(exercise => {
                        return (
                            <div className="row">
                                <img src={exercise.imgUrl} />
                                <h3>{exercise.name}</h3>
                            </div>
                        );
                    })}
                </div>
                <Dialog opts={this.state} close={() => this.toggleModal(false)}>
                    <ExerciseSelectionListController callback={exercises => {this.setState({exercises: exercises.filter((exercise) => exercise.selected)}); }}></ExerciseSelectionListController>
                </Dialog>
            </div>
        );
    }
};