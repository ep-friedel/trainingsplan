import React from 'react';
import UserPlanListController from './UserPlanListController.jsx';
import UserPlansEditor from './UserPlansEditor.jsx';
import ExerciseListController from './ExerciseListController.jsx';
import PlanListController from './PlanListController.jsx';
import '../css/Dashboard.css';

export default class Dashboard extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        return (
            <div className="dashBoard">
                {(() => {switch(this.props.activePage) {
                    case 'UserPlanList':
                        return <UserPlanListController show={true}/>;
                    case 'ExerciseEditor':
                        return <ExerciseListController></ExerciseListController>;
                    case 'PlanEditor':
                        return <PlanListController></PlanListController>;
                    case 'UserPlansEditor':
                        return <UserPlansEditor></UserPlansEditor>;
                    default:
                        return (
                            <ul>
                                <li className="dashboardItem pointer column" onClick={() => this.props.openPage('UserPlanList')}>
                                    <span className="fa fa-play dashboardIcon"></span>
                                    <p>Training starten</p>
                                </li>
                                <li className="dashboardItem pointer column" onClick={() => this.props.openPage('UserPlansEditor')}>
                                    <span className="fa fa-list-alt dashboardIcon"></span>
                                    <p>Trainingspläne verwalten</p>
                                </li>
                                <li className="dashboardItem pointer column" onClick={() => this.props.openPage('PlanEditor')}>
                                    <span className="fa fa-list-alt dashboardIcon"></span>
                                    <p>Planvorlagen verwalten</p>
                                </li>
                                <li className="dashboardItem pointer column" onClick={() => this.props.openPage('ExerciseEditor')}>
                                    <span className="fa fa-wrench dashboardIcon"></span>
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
