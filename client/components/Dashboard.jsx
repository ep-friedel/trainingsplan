import React from 'react';
import PlanList from './PlanList.jsx';
import ExerciseCreator from './ExerciseCreator.jsx';

export default class Dashboard extends React.Component {
    constructor(props) {
        super();

        this.state = {
            activePage: ''
        }
    }

    openPage(page) {
        this.setState({
            activePage: page
        });
    }

    render() {
        return (
            <div className="dashBoard">
                {(() => {switch(this.state.activePage) {
                    case 'PlanList':
                        return <PlanList userId={this.props.options.user.id} show={true} currentPlan={this.props.options.currentPlan} plans={this.props.options.plans} setPlan={this.props.setPlan}/>;
                    case 'ExerciseCreator':
                        return <ExerciseCreator display="true"></ExerciseCreator>;
                    default:
                        return (
                            <ul>
                                <li className="dashboardItem Pointer" onClick={() => this.openPage('PlanList')}>
                                    <span className="fa fa-play"></span>
                                    <p>Training starten</p>
                                </li>
                                <li className="dashboardItem Pointer" onClick={() => this.openPage('')}>
                                    <span className="fa fa-list-alt"></span>
                                    <p>Trainingspläne verwalten</p>
                                </li>
                                <li className="dashboardItem Pointer" onClick={() => this.openPage('ExerciseCreator')}>
                                    <span className="fa fa-wrench"></span>
                                    <p>Übungen verwalten</p>
                                </li>
                            </ul>
                        );
                    }
                })()}
            </div>
        );
    }
}
