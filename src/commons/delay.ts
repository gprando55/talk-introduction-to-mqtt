export const waitSeconds = async (seconds = 1): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};
