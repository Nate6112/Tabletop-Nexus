export const firstLaunchWorkflow = ({ profileStore, username, avatar }) => {
  profileStore.init();
  return profileStore.upsertIdentity({ username, avatar });
};
