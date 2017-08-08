import React from 'react';

export default class ExerciseList extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        if (!this.props.show) {
            return null;
        }

        let exercises = this.props.exercises.reduce((acc, exercise, index) => {
            acc.push(<div className={"exerciseListRow pointer row " + (exercise.selected ? 'selected' : '')} onClick={() => this.props.selectItem(index)}>
                    <img className="exerciseListImage" src={exercise.imageUrl} />
                <h3>{exercise.machine} - {exercise.name}</h3>
            </div>);

            return acc;
        }, []);

        return (
            <div className="exerciseList">
                {this.props.showAddExercise ? (
                    <div className="exerciseListRow pointer row" onClick={() => this.props.selectItem('new')}>
                        <div className="fa fa-plus-circle exerciseListImage"></div>
                        <h3>Neue Übung</h3>
                    </div>
                ) : null}
                {exercises}
            </div>
        );
    }
}
