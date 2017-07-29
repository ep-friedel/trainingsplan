import React from 'react';
import ExerciseList from './ExerciseList.jsx';
import ExerciseEditorController from './ExerciseEditorController.jsx';
import Dialog from './Dialog.jsx';

const emptyExercise = {
        machine: '',
        name: '',
        note: '',
        imageUrl: '',
        setup: {
            key: '',
            val: 'number'
        },
        image: ''
    };

export default class ExerciseListController extends React.Component {
    constructor(props) {
        super();

        this.state = {
            exercises: [],
            dialogOptions: {
                showDialog: true,
                hideClose: true,
                text: 'Fetching...',
                content: null,
                title: 'Fetching Data...',
                buttons: []
            },
            showEditor: false,
            showExerciseList: true,
            editorSettings: emptyExercise
        };
    }

    componentDidMount() {
        fetch('/api/exercise', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            method: "GET"
        })
        .then(res => res.json())
        .then(data => {
            this.setState({
                exercises: data,
                dialogOptions: Object.assign({}, this.state.dialogOptions, {showDialog: false})
            });
        })
        .catch(err => {
            console.log(err);
            this.setState({
                dialogOptions: Object.assign({}, this.state.dialogOptions, {showDialog: false})
            });
        })
    }

    openEditor(index) {
        this.setState({
            showEditor: true,
            showExerciseList: false,
            editorSettings: Object.assign({}, this.state.exercises[index])
        }, () =>{
            console.log(this.state);
        });
    }

    closeEditor() {
        this.setState({
            showEditor: false,
            showExerciseList: true
        });
    }

    render() {
        return (<div>
            <Dialog opts={this.state.dialogOptions}>
                <div className="row margin-top">
                    <span className="fa fa-fw fa-cog slow-spin fa-3x" />
                </div>
            </Dialog>
            <ExerciseList exercises={this.state.exercises} openEditor={(index) => this.openEditor(index)} show={this.state.showExerciseList}></ExerciseList>
            {(this.state.showEditor ? (<div><ExerciseEditorController defaultSettings={this.state.editorSettings} show={true}></ExerciseEditorController><button onClick={() => this.closeEditor()}>Abbrechen</button></div>) : null)}
        </div>)
    }
};