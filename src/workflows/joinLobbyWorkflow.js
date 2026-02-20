export const joinLobbyWorkflow = ({ clientAgent, joinCode, playerName, avatar }) =>
  clientAgent.join({ joinCode, playerName, avatar });
