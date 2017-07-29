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
            acc.push(<div className="exercise minified pointer" onClick={() => this.props.openEditor(index)}>
                <div className="">
                    <img className="exerciseImage" src={exercise.imageUrl} />
                </div>
                <h3>{exercise.machine} - {exercise.name}</h3>
            </div>);

            return acc;
        }, []);

        return (
            <div className="exerciseList">
                {exercises}
            </div>
        );
    }
}
