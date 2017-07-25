import React from 'react';
import DataInput from './DataInput.jsx';

export default class enterResults extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        let rep;

        if (this.props.completed) {
            return null;
        }

        return React.createElement(
            'div',
            {className: 'enterResults'},
            React.createElement(
                'h3',
                null,
                this.props.repetition + '. Satz'
            ),
            React.createElement(
                'div',
                {className: 'row'},
                React.createElement(
                    DataInput,
                    {
                        defaultValue: this.props.currentReps,
                        callback: (newNumber) => this.props.changedReps(newNumber),
                        className: 'exerciseInput',
                        name: 'Wiederholungen',
                        datatype: 'number'
                    }
                ),
                React.createElement(
                    DataInput,
                    {
                        defaultValue: this.props.currentWeight,
                        callback: (newNumber) => this.props.changedWeight(newNumber),
                        className: 'exerciseInput',
                        name: 'Gewicht',
                        datatype: 'number'
                    }
                )
            ),
            React.createElement(
                'button',
                {className: 'submitResults fullWidthButton', onClick: this.props.enterResults},
                'Ergebnisse eintragen'
            )
        );
    }
}