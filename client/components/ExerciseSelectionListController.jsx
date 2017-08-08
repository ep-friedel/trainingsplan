import React from 'react';
import ExerciseList from './ExerciseList.jsx';
import Dialog from './Dialog.jsx';

export default class ExerciseSelectionListController extends React.Component {
    constructor(props) {
        super();

        this.state = {
            exercises: [],
            showExerciseList: true,
            loading: true
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
                loading: false
            });
        })
        .catch(err => {
            console.log(err);
        })
    }

    toggleItem(index) {
        let newArr = this.state.exercises.concat([]);

        newArr[index] = Object.assign({}, newArr[index], {selected: !newArr[index].selected});

        this.setState({
        	exercises: newArr
        }, () => this.props.callback ? this.props.callback(newArr) : '');
    }


    render() {
        if (this.state.loading) {
            return (
                <div className="column">
                    <h3>Daten abrufen...</h3>
                    <div className="row margin-top">
                        <span className="fa fa-fw fa-cog slow-spin fa-3x" />
                    </div>
                </div>);
        }

        return (
            <div>
                <ExerciseList exercises={this.state.exercises} selectItem={(index) => this.toggleItem(index)} show={this.state.showExerciseList}></ExerciseList>
            </div>);
    }
};