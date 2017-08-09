import React from 'react';
import PlanList from './PlanList.jsx';
import PlanEditorController from './PlanEditorController.jsx';
import Dialog from './Dialog.jsx';

const emptyPlan = {
            name: '',
            note: '',
            imageUrl: '',
            exercises: []
        };

export default class ExerciseListController extends React.Component {
    constructor(props) {
        super();

        this.state = {
            plans: [],
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
            editorSettings: emptyPlan
        };
    }

    componentDidMount() {
        fetch('/api/plan', {
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
                plans: data,
                dialogOptions: Object.assign({}, this.state.dialogOptions, {showDialog: false})
            });
        })
        .catch(err => {
            console.log(err);
            this.setState({
                dialogOptions: Object.assign({}, this.state.dialogOptions, {showDialog: false})
            });
        });

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
                exercises: data
            });
        })
        .catch(err => {
            console.log(err);
        })
    }

    openEditor(index) {
        this.setState({
            showEditor: true,
            showExerciseList: false,
            editorSettings: (index === 'new') ? emptyPlan : Object.assign({}, this.state.plans[index]),
            currentIndex: (index === 'new') ? this.state.plans.length : index
        });
    }

    closeEditor() {
        this.setState({
            showEditor: false,
            showExerciseList: true
        });
    }

    saveChanges(newObj) {
        let newArr = this.state.plans.concat([]);

        newArr[this.state.currentIndex] = newObj;

        this.setState({
            showEditor: false,
            showExerciseList: true,
            plans: newArr
        });
    }

    render() {
        return (<div>
            <Dialog opts={this.state.dialogOptions}>
                <div className="row margin-top">
                    <span className="fa fa-fw fa-cog slow-spin fa-3x" />
                </div>
            </Dialog>
            <PlanList plans={this.state.plans} selectItem={(index) => this.openEditor(index)} show={this.state.showExerciseList} showAddExercise={true}></PlanList>
            {(this.state.showEditor ? (
                <div>
                    <PlanEditorController submitCallback={changedSettings => this.saveChanges(changedSettings) } defaultSettings={this.state.editorSettings} exercises={this.state.exercises} show={true}></PlanEditorController>
                    <div className="padding-left padding-right">
                        <button className="fullWidthButton" onClick={() => this.closeEditor()}>Abbrechen</button>
                    </div>
                </div>) : null
            )}
        </div>)
    }
};