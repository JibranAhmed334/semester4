export function subscribeToLiveUpdates(apiUrl, onUpdate) {
  const source = new EventSource(`${apiUrl.replace(/\/$/, '')}/updates`);

  source.onmessage = (event) => {
    try {
      const update = JSON.parse(event.data);
      if (update.resource !== 'connected') onUpdate(update);
    } catch (error) {
      console.error('Could not read a live update:', error);
    }
  };

  return () => source.close();
}
