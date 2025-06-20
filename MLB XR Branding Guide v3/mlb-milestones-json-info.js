// This file provides a summary of the MLB milestones API JSON structure used in the app.

// Endpoint: https://statsapi.mlb.com/api/v1/milestones?hydrate=person,team&limit=100

/*
Sample JSON structure:
{
  "milestones": [
    {
      "milestoneAchievementId": 12345,
      "player": {
        "id": 123,
        "fullName": "Player Name",
        ... // more player fields
      },
      "team": {
        "id": 456,
        "name": "Team Name",
        ... // more team fields
      },
      "milestoneRule": {
        "type": "Home Runs",
        "statistic": "HR",
        ... // more rule fields
      },
      "achievementStatus": "in_progress",
      "achievementValue": 500,
      "currentValue": 492,
      "dateAchieved": null,
      ... // more fields
    },
    ...
  ]
}
*/

// Key fields:
// - milestoneAchievementId: Unique ID for the milestone achievement
// - player: Player info (id, name, etc.)
// - team: Team info (id, name, etc.)
// - milestoneRule: Type of milestone, statistic, etc.
// - achievementStatus: Status (e.g., achieved, in_progress)
// - achievementValue/currentValue: Numeric values
// - dateAchieved: Date milestone was achieved (if any)
