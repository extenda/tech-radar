#!/usr/bin/env sh

if [ "$USE_BERGLAS" = "true" ]; then
  exec /bin/berglas exec -- /usr/local/bin/node /opt/tech-radar/index.js
else
  exec /usr/local/bin/node /opt/tech-radar/index.js
fi
