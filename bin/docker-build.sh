#!/bin/sh
docker build --squash -t tech-radar:latest -t "tech-radar:$(git rev-parse --short HEAD)" .
