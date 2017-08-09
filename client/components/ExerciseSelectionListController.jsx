import React from 'react';
import ExerciseList from './ExerciseList.jsx';

export default class ExerciseSelectionListController extends React.Component {
    constructor(props) {
        super();

        this.state = {
            showExerciseList: true
        };
    }

    toggleItem(index) {
        let newArr = this.state.exercises.concat([]);

        newArr[index] = Object.assign({}, newArr[index], {selected: !newArr[index].selected});

        this.setState({
        	exercises: newArr
        }, () => this.props.callback ? this.props.callback(newArr) : '');
    }

    render() {
        return (
            <div>
                <ExerciseList exercises={this.props.exercises} selectItem={(index) => this.toggleItem(index)} show={this.state.showExerciseList}></ExerciseList>
            </div>);
    }
};