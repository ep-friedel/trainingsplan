import React from 'react';
import Dialog from './Dialog.jsx';
import PlanList from './PlanList.jsx';
import UserPlanEditorController from './UserPlanEditorController.jsx';

export default class UserPlansEditor extends React.Component {
    constructor(props) {
        super();

        this.state = {
            showPlanList: true,
            templates: [],
            initialized: false,
            dialogOptions: {
                showDialog: true,
                hideClose: false,
                text: 'Bitte wählen Sie eine Planvorlage',
                content: null,
                title: 'Daten übertragen',
                buttons: [{name: 'Auswählen', click: () => {this.selectCurrentPlan()}}]
            },
        }
    }

/*
savePlan={(index, plan) => this.savePlan(index, plan)}

    savePlan(index, plan) {
        let newArr = this.state.plans.slice();

        newArr[index] = plan;
        this.setState({plans: newArr});
    }
*/

    componentDidMount() {
        Promise.all(['/api/plan', '/api/userplans'].map(url => fetch(url, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            method: "GET"
        })))
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(responses => {
            this.setState({
                initialized: true,
                templates: responses[0],
                plans: responses[1]
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }

    handleSelect(index) {
        this.setState({
            showEditor: (index === 'new') ? false : true,
            showPlanList: false,
            showSelectPlanDialog: (index === 'new') ? true : false,
            index: ((index === 'new') ? 'new' : this.state.plans[index].planId),
            currentPlan: ((index === 'new') ? {planId: ''} : this.state.plans[index])
        });
    }

    selectPlanTemplate(index) {
        console.log(index);
        this.setState({
            currentPlan: Object.assign({}, this.state.currentPlan, {planId: this.state.templates[index].id})
        });
    }

    selectCurrentPlan(index) {
        this.setState({
            showEditor: true,
            showPlanList: false,
            showSelectPlanDialog: false
        });
    }

    closeEditor() {
        this.setState({
            showEditor: false,
            showPlanList: true,
            showSelectPlanDialog: false
        });
    }

    onSubmit(newObj) {
        this.props.savePlan(this.state.index, newObj);
        this.closeEditor();
    }

    render() {
        if (this.state.initialized) {
            return (<div>
                <PlanList plans={this.state.plans} selectItem={(index) => this.handleSelect(index)} show={this.state.showPlanList} showAddExercise={true}></PlanList>
                {(this.state.showEditor ? (
                    <div>
                        <UserPlanEditorController plan={this.state.currentPlan} submitCallback={newObj => this.state.onSubmit(newObj)} ></UserPlanEditorController>
                        <div className="padding-left padding-right">
                            <button className="fullWidthButton" onClick={() => this.closeEditor()}>Abbrechen</button>
                        </div>
                    </div>) : null
                )}
                {(this.state.showSelectPlanDialog ? (
                    <Dialog opts={this.state.dialogOptions} close={() => this.closeEditor()}>
                        <PlanList plans={this.state.templates} new={index === 'new'} selectItem={(index) => this.selectPlanTemplate(index)} show={true} showAddExercise={false}></PlanList>
                    </Dialog>) : null
                )}
            </div>)

        }
        return (<div className="row margin-top">
                <span className="fa fa-fw fa-cog slow-spin fa-3x" />
            </div>);
    }
}


