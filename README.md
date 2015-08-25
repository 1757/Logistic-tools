### Installation

```bash
npm install -g harp
curl -s https://www.parse.com/downloads/cloud_code/installer.sh | sudo /bin/bash
```

Or follow https://parse.com/apps/quickstart#hosting/windows

### Local server

```bash
harp server
```

### Build and deploy

```bash
harp build -o _parse/public
cd _parse
parse deploy
```
