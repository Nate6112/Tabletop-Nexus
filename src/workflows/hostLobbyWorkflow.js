export const hostLobbyWorkflow = ({ hostAgent, hostName, roomName, rulesetId, displayMode, maxPlayers }) =>
  hostAgent.createHostedRoom({ hostName, roomName, rulesetId, displayMode, maxPlayers });
