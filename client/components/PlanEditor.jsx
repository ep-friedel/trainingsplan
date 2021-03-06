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

            exercises: [],
            selectedExercises: props.defaults.exercises.map(exercise => exercise.id)
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

    handleExerciseSelectionChange(exercises) {
        this.setState({exercises: exercises.filter((exercise) => exercise.selected)});
    }

    getDialogExercises() {
        return this.props.exercises.map(exercise => Object.assign({}, exercise, {selected: this.state.selectedExercises.includes(exercise.id)}));
    }

    render() {
        return (
            <div className="">
                <div className="row stretch">
                    <div className="column margin-right">
                        <DataInput defaultValue={this.props.defaults.name} callback={name => this.props.setProperty('name', name)} className="" name="Name" datatype="text" ></DataInput>
                        <DataTextArea defaultValue={this.props.defaults.note} callback={note => this.props.setProperty('note', note)} className="" name="Note" datatype="textfield" ></DataTextArea>
                    </div>
                    <div className="column margin-right">
                        <ImageUploader callback={image => this.props.setProperty('image', image)} opts={{imageUrl: this.props.defaults.imageUrl}}></ImageUploader>
                    </div>
                </div>
                <div>
                    <h3>Übungsverwaltung</h3>
                    <button className="fullWidthButton" onClick={() => this.toggleModal(true)} >Übungen auswählen</button>
                    <div className="exerciseList margin-bottom">
                        {this.props.defaults.exercises.map((exercise, index) => {
                            return (
                                <div className="row exerciseListRow">
                                    <img className="exerciseListImage" src={exercise.imageUrl} />
                                    <h3>{exercise.name}</h3>
                                    <DataInput defaultValue={exercise.sets} callback={sets => this.props.setExerciseProperty(index, 'sets', sets)} className="" name="Sätze" datatype="number" ></DataInput>
                                    <DataInput defaultValue={exercise.repetitions} callback={repetitions => this.props.setExerciseProperty(index, 'repetitions', repetitions)} className="" name="Wiederholungen" datatype="text" ></DataInput>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <Dialog opts={this.state} close={() => this.toggleModal(false)}>
                    <ExerciseSelectionListController
                        exercises={this.getDialogExercises()}
                        callback={exercises => this.handleExerciseSelectionChange(exercises)}>
                    </ExerciseSelectionListController>
                </Dialog>
            </div>
        );
    }
};