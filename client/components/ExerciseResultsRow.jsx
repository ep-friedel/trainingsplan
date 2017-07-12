import React from 'react';

export default class resultsRow extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        let rep,
            cells = [];
        for (rep in this.props.data) {
            cells.push(this.renderCell(this.props.data[rep], rep));
        }

        return React.createElement(
            'tr',
            null,
            cells
        );
    }

    renderCell(data, id) {
        return React.createElement(
            'td',
            {key: id},
            React.createElement(
                'p',
                null,
                (data.reps !== undefined) ? data.reps + ' reps' : ''
            ),
            React.createElement(
                'p',
                null,
                (data.weight !== undefined) ? data.weight + 'kg' : ''
            )
        );
    }
}