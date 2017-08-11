import React from 'react';
import details from './ExerciseDetails.jsx';
import resultsRow from './ExerciseResultsRow.jsx';
import enterResults from './ExerciseEnterResults.jsx';
import '../css/Exercise.css';

export default class Exercise extends React.Component {
    constructor(props) {
        super();
        let i,
            pastResults = props.pastResults;

        this.state =  {
            display: 'minified',
            completed: false,
            incomplete: false,
            saved: false,
            newResults: [],
            currentRep: {
                repetition: 1,
                reps: pastResults.length ? pastResults[pastResults.length - 1][0].reps : 0,
                weight: pastResults.length ? pastResults[pastResults.length - 1][0].weight : 0
            }
        };

        if (props.newResults) {
            this.state.newResults = props.newResults;
        } else {
            for (i = 0; i < props.details.repetitions; i++) {
                this.state.newResults.push({reps: undefined, weight: undefined});
            }
        }
    }

    changedReps(newNumber) {
        let changedRep = Object.assign({}, this.state.currentRep, {reps: parseFloat(newNumber)});

        this.setState({
            currentRep: changedRep,
            saved: false
        });
    }

    changedWeight(newNumber) {
        let changedRep = Object.assign({}, this.state.currentRep, {weight: parseFloat(newNumber)});

        this.setState({
            currentRep: changedRep,
            saved: false
        });
    }

    closeAndSave() {
        if (this.state.completed) {
            this.props.saveNewResults(this.state.newResults, this.state.completed, () => this.closeExercise());
        } else {
            this.props.openModal({
                text: 'Sind sie sicher, dass sie die Trainingseinheit abschließen wollen, ohne sie zu beenden?',
                title: 'Bestätigung',
                buttons: [
                    {
                        name: 'Ja',
                        click: () => {
                            this.setState({
                                completed: true,
                                incomplete: true
                            });
                            this.props.closeModal();
                            this.props.saveNewResults(this.state.newResults, this.state.completed, () => this.closeExercise());
                        }
                    },
                    {
                        name: 'Nein',
                        click: () => this.props.closeModal()
                    },
                ]
            });
        }
    }

    enterResultsHandler() {
        let s = this.state,
            cRep = s.currentRep,
            rep = cRep.repetition,
            changedResult = s.newResults.slice();

        changedResult[rep - 1] = Object.assign({}, s.newResults[rep - 1], {reps: cRep.reps, weight: cRep.weight})

        if (this.props.details.repetitions > rep) {
            this.setState({
                newResults: changedResult,
                currentRep: Object.assign({}, cRep, {repetition: rep + 1})
            });
        } else {
            this.setState({
                newResults: changedResult,
                completed: true
            });
        }
    }

    openExercise() {
        this.props.setExercise(this.props.dataId);
    }

    closeExercise() {
        this.props.setExercise(-1);
    }

    render() {
        if (this.props.hide && this.state.display !== 'full') {
            return null;
        }

        switch(this.props.display) {
        case 'hidden':
            return null;
        case 'minified':
            return React.createElement(
                'div',
                {
                    className: "exercise minified pointer" + (this.state.completed ? ' completed' : '') + (this.state.incomplete ? ' incomplete' : ''),
                    onClick: () => this.openExercise()
                },
                React.createElement(
                    'div',
                    {className: 'imageContainer'},
                    React.createElement(
                        'img',
                        {
                            className: 'exerciseImage',
                            src: this.props.details.imageUrl
                        }
                    )
                ),
                React.createElement(
                    'h3',
                    null,
                    (this.props.details.machine ? (this.props.details.machine + ' - ') : '') + this.props.details.name
                )
            );

        case 'full':
            return React.createElement(
                'div',
                {className: "exercise" + (this.state.completed ? ' completed' : '')},
                React.createElement(
                    'h3',
                    null,
                    (this.props.details.machine ? this.props.details.machine + ' - ' : '') + this.props.details.name
                ),
                React.createElement(
                    'div',
                    {className: "row margin-top"},
                    React.createElement(
                        'div',
                        {className: "imageWrapper"},
                        React.createElement(
                            'img',
                            {
                                className: 'exerciseImage',
                                src: this.props.details.imageUrl
                            }
                        )
                    ),
                    React.createElement(
                        details,
                        {details: this.props.details}
                    )
                ),
                React.createElement(
                    'div',
                    {className: 'margin-top'},
                    React.createElement(
                        'h3',
                        null,
                        'Vergangene Trainingseinheiten',
                    ),
                    React.createElement(
                        'table',
                        {className: 'pastResults flex-table'},
                        React.createElement(
                            'tbody',
                            null,
                            React.createElement(
                                resultsRow,
                                {data: this.props.pastResults[this.props.pastResults.length - 3]}
                            ),
                            React.createElement(
                                resultsRow,
                                {data: this.props.pastResults[this.props.pastResults.length - 2]}
                            ),
                            React.createElement(
                                resultsRow,
                                {data: this.props.pastResults[this.props.pastResults.length - 1]}
                            )
                        )
                    )
                ),
                React.createElement(
                    'div',
                    {className: 'margin-top'},
                    React.createElement(
                        'h3',
                        null,
                        'Heutige Trainingseinheit',
                    ),
                    React.createElement(
                        'table',
                        {className: 'newResults flex-table'},
                        React.createElement(
                            'tbody',
                            null,
                            React.createElement(
                                resultsRow,
                                {
                                    data: this.state.newResults
                                }
                            )
                        )
                    ),
                    React.createElement(
                        enterResults,
                        {
                            currentReps: this.state.currentRep.reps,
                            currentWeight: this.state.currentRep.weight,
                            changedReps: (newNumber) => this.changedReps(newNumber),
                            changedWeight: (newNumber) => this.changedWeight(newNumber),
                            repetition: this.state.currentRep.repetition,
                            enterResults: () => this.enterResultsHandler(),
                            completed: this.state.completed
                        }
                    )
                ),
                React.createElement(
                    'div',
                    {className: 'margin-top'},
                    (!(this.state.completed  && this.state.saved) ? React.createElement(
                        'button',
                        {
                            className: 'fullWidthButton',
                            onClick: () => this.closeAndSave()
                        },
                        'Speichern und Abschließen'
                    ) : null),
                    React.createElement(
                        'button',
                        {
                            className: 'fullWidthButton closeButton',
                            onClick: () => this.closeExercise()
                        },
                        'Schließen'
                    )
                )
            );
        }
    }
}