## Ubiquiti Programming Homework - Ubiquitodo

### Tech:

- `Next.js`
- `yjs`
- `dnd-kit`
- `LevelDB`
- `Drizzle` (Phased out)
- `TRPC` (Phased out)

Initially it was planned to develop the solution with a Drizzle/TRPC stack which is pretty cool to use, but ultimately was not very suitable for a real-time pub/sub architecture.

Instead a much more traditional and a very crude stack was selected and implemented as a MVP due to the ready support for yjs communication.

Yjs was selected because it is very efficient and uses deltas streamed over Uint8 streams which is far more efficient than anything I could have come up with in the meanwhile. Persistence is facilitated with a filesystem based LevelDB which offloads data from ECS clusters onto a persisted and shared storage.

ECS clusters are spun up via Github Actions on push to `main` and there's a `docker-compose` setup to work with it locally. There's also a terraform script for spinning up a simple ec2 instance with the WS server on it.

There are a lot of considerations regarding the stability, security and reliability of the system, especially backend. If this were to be developed into a production app, the backend would need to be rewritten with a proper authentication, decoder, room initialization (for things like id autoincrementation (currently done on client, yikes)).

This turned out to be more of a system architect and devops task than it was a "regular" programming task.

Please do not abuse my server/cluster instances. They cost money and well.. I'm looking for a job.

### Execution:

Next.js server for frontend:

```bash
pnpm dev
```

Node WS server with LevelDB for persistence:

```bash
docker-compose up
```

### Implemented user stories (simplified):

- Can create to-do items
- Can collaborate in real-time
- Tasks can be marked as done
- Complete tasks can be filtered out (incomplete subtasks will be filtered as well)
- Can add subtasks
- Can make an infinite amount of nested to-do items (styling is not adjusted for that, though)
- Can see some presence of other users (shared cursor and selection 90% implemented)
- Can create multiple shareable Todo lists with unique URLs
- Can edit offline and sync to remote server on reconnect (not tested too extensively)
- Can drag & drop

No VR Salad tracking, sorry!
