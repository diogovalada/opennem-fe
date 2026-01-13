Don't make changes until I explicitly say so.

This is a fork of another project, I will keep pulling new features from upstream, so try to do changes that avoid too big merge conflicts in that sense.

For now I am running the development with `pnpm run docker:dev`, and typically have that docker container running in order to serve the website locally for development purposes.

You can read a overview of this project in `./AGENTS - OVERVIEW.md`.

For a summary of fork-specific changes, see `FORK_NOTES.md` and keep it updated when diverging from upstream.

### Running dev server

The dev server can be launched with:
```
pnpm run docker:dev (serves http://localhost:3000/). 

# or using native dev server:

yarn dev
```

Remember that you have access to playwright, if needed. Available via the Docker MCP gateway.

The python environment is present in ./.venv . It has uvicorn installed. Command:

