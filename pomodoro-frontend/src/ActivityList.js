import React from 'react';

/**
 * Prints the list of activities to the DOM
 * @param {*} activities The list of activities to display
 * @param {*} onClose The function to call when the user closes the activity list
 * @returns 
 */
function ActivityList({ activities, onClose }) {
  return (
    <div className="activity-list">
      <h2>Activities in the Last Week</h2>
      <ul>
        {activities.map((activity, index) => (
          <li key={index}>
            {activity.name} - {new Date(activity.date).toLocaleDateString()} - 
            {Math.floor(activity.duration / 60)}:{(activity.duration % 60).toString().padStart(2, '0')}
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default ActivityList;
