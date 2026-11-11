const clients = new Set();

const addRealtimeClient = (response) => {
    clients.add(response);

    const removeClient = () => clients.delete(response);
    response.on("close", removeClient);
    response.on("error", removeClient);
};

const publishRealtimeUpdate = (resource, expoId, action) => {
    const message = `data: ${JSON.stringify({ resource, expoId: String(expoId), action })}\n\n`;

    for (const client of clients) {
        try {
            client.write(message);
        } catch (error) {
            clients.delete(client);
            console.error("Could not send a live update:", error.message);
        }
    }
};

export { addRealtimeClient, publishRealtimeUpdate };
