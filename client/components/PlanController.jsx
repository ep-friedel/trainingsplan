import React from 'react';
import Plan from './Plan.jsx';

export default class PlanController extends React.Component {
    constructor(props) {
        super();

        this.state = {
            updateNeeded: true,
            loadingData: false,
            exercises: [],
            currentExercise: -1
        }
    }

    toggleMinimized() {
        if (this.props.currentPlan === -1 && this.state.updateNeeded) {
            this.setState(Object.assign({}, this.state, {loadingData: true}));
            this.props.setPlan(this.props.dataId);
            this.loadData();
        } else {
            this.props[(this.props.currentPlan === -1) ? this.props.setPlan(this.props.dataId) : this.props.setPlan(-1)];
        }
    }

    setExercise(id) {
        this.setState(Object.assign({}, this.state, {currentExercise: id}));
    }

    loadData() {
        fetch(`/api/trainingplans/${this.props.options.id}/exercises`, {
            mode: 'same-origin',
            credentials: 'include'
        })
        .then(res => Promise[(res.status >= 400) ? 'reject' : 'resolve'](res))
        .then(res => res.json())
        .then((data) => {
            this.setState(Object.assign({}, this.state, {loadingData: false, updateNeeded: false, exercises: data}));
        })
        .catch(() => {
            this.setState(Object.assign({}, this.state, {loadingData: false, updateNeeded: true}));
            this.props.showAll();
        });
    }

    saveResults(a, b) {
        return new Promise(res => setTimeout(res, 1000))
    }

    render() {
        let style;

        if (this.props.currentPlan === -1) {
            style = 'minimized';
        } else if (this.props.currentPlan === this.props.dataId) {
            if (this.state.loadingData) {
                style = 'updating';
            } else {
                style = 'full';
            }
        } else if (this.props.currentPlan !== -1) {
            style = 'hidden';
        }

        return <Plan
            currentExercise={this.state.currentExercise}
            setExercise={(id) => this.setExercise(id)}
            exercises={this.state.exercises}
            mode={style}
            toggleMinimized={() => this.toggleMinimized()}
            planName={this.props.options.name}
            planNotes={this.props.options.note}
            imageUrl={this.props.options.imageUrl}
            saveNewResults={this.saveResults}
        />
    }
}